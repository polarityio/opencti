'use strict';

const request = require('request');
const config = require('./config/config');
const async = require('async');
const fs = require('fs');
const fp = require('lodash/fp');
const query = require('./query');

let Logger;
let requestWithDefaults;

const MAX_PARALLEL_LOOKUPS = 10;

function startup(logger) {
  let defaults = {};
  Logger = logger;

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

  Logger.debug(entities);
  entities.forEach((entity) => {
    let requestOptions = {
      method: 'POST',
      uri: `${options.url}/graphql`,
      headers: {
        Authorization: 'Bearer '
      },
      body: {
        query: query,
        variables: { search: entity.value }
      },
      json: true
    };

    Logger.trace({ requestOptions }, 'Request Options');

    tasks.push(function (done) {
      requestWithDefaults(requestOptions, function (error, res, body) {
        let processedResult = handleRestError(entity, res, body);

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
      Logger.error({ err: err }, 'Error');
      cb(err);
      return;
    }

    results.forEach((result) => {
      if (
        !fp.get('body', result) ||
        !fp.get('body.data.indicators', result) ||
        fp.get('body.data.indicators.edges.length', result) === 0 ||
        fp.get('body.data.indicators.pageInfo.globalCount', result) === 0 
      ) {
        if (fp.get('data.body.data', result)) {
          Logger.trace({ RESULT: result });
          lookupResults.push({
            entity: result.data.entity,
            data: {
              summary: [],
              details: result.data.body
            }
          });
        } else {
          lookupResults.push({
            entity: result.body.entity,
            data: null
          });
        }
      }
    });

    Logger.debug({ lookupResults }, 'Results');
    cb(null, lookupResults);
  });
}

const handleRestError = (entity, res, body) => {
  if (res.statusCode === 404) {
    return {
      statusCode: res.statusCode,
      body: {
        errors: [res.error],
        data: null,
        entity
      }
    };
  }

  //handle gql errors
  if (fp.get('body.errors.length', res)) {
    const error = res.body.errors[0];
    const status = error.data.http_status;

    switch (status) {
      case 401:
        return {
          error: error.message,
          body
        };
      case 400:
        return {
          error: error.message,
          body
        };
      case 429:
        return {
          error: error.message,
          body: `Rate Limit Exceeded`
        };
      default:
        return {
          error: body,
          body: `Unexpected Gql Status Code ${res.statusCode} received`
        };
    }
  }

  if (res.body.data.indicators !== null) {
    return {
      error: null,
      data: {
        entity,
        body
      }
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
