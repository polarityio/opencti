'use strict';

const request = require('postman-request');
const config = require('./config/config');
const async = require('async');
const fs = require('fs');
const _ = require('lodash');
const fp = require('lodash/fp');
const { setLogger } = require('./logger');
const { indicatorsQuery, observablesQuery } = require('./query');

let Logger = null;
let requestWithDefaults;

const MAX_PARALLEL_LOOKUPS = 10;

function startup(logger) {
  const defaults = {};

  Logger = logger;
  setLogger(Logger);

  const { cert, key, passphrase, ca, proxy, rejectUnauthorized } = config.request;

  if (typeof cert === 'string' && cert.length > 0) {
    defaults.cert = fs.readFileSync(cert);
  }

  if (typeof key === 'string' && key.length > 0) {
    defaults.key = fs.readFileSync(key);
  }

  if (typeof passphrase === 'string' && passphrase.length > 0) {
    defaults.passphrase = passphrase;
  }

  if (typeof ca === 'string' && ca.length > 0) {
    defaults.ca = fs.readFileSync(ca);
  }

  if (typeof proxy === 'string' && proxy.length > 0) {
    defaults.proxy = proxy;
  }

  if (typeof rejectUnauthorized === 'boolean') {
    defaults.rejectUnauthorized = rejectUnauthorized;
  }

  requestWithDefaults = request.defaults(defaults);
}

function doLookup(entities, options, cb) {
  let lookupResults = [];
  let tasks = [];

  Logger.trace({ options }, 'Options');

  const query =
    options.dataSources.value === 'observable' ? observablesQuery : indicatorsQuery;

  entities.forEach((entity) => {
    let requestOptions = {
      method: 'POST',
      uri: `${options.url}/graphql`,
      headers: {
        Authorization: 'Bearer ' + options.apiKey
      },
      body: {
        query,
        variables: {
          search: entity.value,
          first: 5,
          // orderBy: 'valid_until',
          orderMode: 'desc'
        }
      },
      json: true
    };

    tasks.push(function (done) {
      Logger.trace({ uri: requestOptions.uri }, 'Request URI');
      requestWithDefaults(requestOptions, function (error, res, body) {
        Logger.trace({ error, res, body }, 'Response');
        if (error) {
          Logger.trace({ error }, 'Error encountered');
          return done({
            detail: 'HTTP error encountered',
            error
          });
        }

        let processedResult = handleRestError(entity, res, body, options);

        Logger.trace({ processedResult }, 'Processed Result');

        if (processedResult.error) {
          done(processedResult);
          return;
        }

        done(null, processedResult);
      });
    });
  });

  async.parallelLimit(tasks, MAX_PARALLEL_LOOKUPS, (err, results) => {
    if (err) {
      cb(err);
      return;
    }

    results.forEach((result) => {
      if (
        !_.get(result, 'data.body') ||
        _.get(result, 'data.body.data.indicators.edges.length', []) === 0
      ) {
        lookupResults.push({
          entity: result.data.entity,
          data: null
        });
      } else {
        lookupResults.push({
          entity: result.data.entity,
          data: {
            summary: [],
            details: result.data.body
          }
        });
      }
    });

    Logger.trace({ lookupResults }, 'Lookup Results');
    cb(null, lookupResults);
  });
}

function getSummaryTags(body) {
  const tags = [];
  let maxScore = 0;
  let confidence = 'NA';
  const globalCount = fp.get('data.indicators.pageInfo.globalCount', body);
  const edges = fp.get('data.indicators.edges', body, []);

  edges.forEach((edge) => {
    const score = fp.get('node.x_opencti_score', edge, 0);
    if (score > maxScore) {
      maxScore = score;
      confidence = fp.get('node.confidence', edge, 'N/A');
    }
  });

  tags.push(`Indicator Count: ${globalCount}`);
  tags.push(
    `${
      globalCount > 1 ? 'Max Score: ' : 'Score: '
    } ${maxScore} / Confidence: ${confidence}`
  );
  return tags;
}

/**
 * Graphql responses are always a 200 so rather than check the status code we check for
 * the existence of an error.
 *
 * The exception to this rule is if the status code comes back as a 404, this means the graphql
 * endpoint could not be reached and we want to detect that and handle as an error.
 *
 * @param entity
 * @param res
 * @param body
 * @returns {{detail: *, errors: *, statusCode: *}|{data: {body, entity}, error: null}}
 */
const handleRestError = (entity, res, body, options) => {
  const errors = _.get(res, 'body.errors', []);

  Logger.trace({ entity, res, body, options }, 'Processed Result');

  Logger.trace({ errors }, 'Errors');

  const dataFound =
    _.get(res, 'body.data.indicators') || _.get(res, 'body.data.stixCyberObservables');

  Logger.trace({ dataFound }, 'Data Found');

  if (res.statusCode === 200 && errors.length === 0 && dataFound) {
    return {
      error: null,
      data: {
        entity,
        body
      }
    };
  } else if (res.statusCode === 404) {
    // This 404 means the graphql endpoint was not found.  All other errors are returned as a 200 status code
    // but with an `errors` array on the response body.
    return {
      error: `404 Error -- ${options.url}/graphql not found`,
      statusCode: 404,
      detail: `404 Error -- ${options.url}/graphql not found`
    };
  } else {
    // Handle any errors from the graphql endpoint.  Errors are always a 200 but there is an errors
    // array on the return object.  We use the first error to provide the error message but return the
    // full array.
    const firstErrorMessage = _.get(
      res,
      'body.errors[0].message',
      'No error message available'
    );
    const firstStatusCode = _.get(res, 'body.errors[0].data.http_status', 'unknown');
    return {
      error: errors,
      firstStatusCode,
      detail: firstErrorMessage
    };
  }
};

function validateOption(errors, options, optionName, errMessage) {
  if (
    typeof options[optionName].value !== 'string' ||
    (typeof options[optionName].value === 'string' &&
      options[optionName].value.length === 0)
  ) {
    errors.push({
      key: optionName,
      message: errMessage
    });
  }
}

function validateOptions(options, callback) {
  let errors = [];

  validateOption(errors, options, 'url', 'You must provide a valid URL.');
  validateOption(errors, options, 'apiKey', 'You must provide a valid API Key.');

  callback(null, errors);
}

module.exports = {
  doLookup: doLookup,
  validateOptions: validateOptions,
  startup: startup
};
