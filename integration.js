'use strict';

const request = require('request');
const config = require('./config/config');
const async = require('async');
const fs = require('fs');
const query = require('./query');

// const query =
//   '\n            query Indicators($filters: [IndicatorsFiltering], $search: String, $first: Int, $after: ID, $orderBy: IndicatorsOrdering, $orderMode: OrderingMode) {\n                indicators(filters: $filters, search: $search, first: $first, after: $after, orderBy: $orderBy, orderMode: $orderMode) {\n                    edges {\n                        node {\n                            \n            id\n            standard_id\n            entity_type\n            parent_types\n            spec_version\n            created_at\n            updated_at\n            createdBy {\n                ... on Identity {\n                    id\n                    standard_id\n                    entity_type\n                    parent_types\n                    spec_version\n                    name\n                    description\n                    roles\n                    contact_information\n                    x_opencti_aliases\n                    created\n                    modified\n                    objectLabel {\n                        edges {\n                            node {\n                                id\n                                value\n                                color\n                            }\n                        }\n                    }\n                }\n                ... on Organization {\n                    x_opencti_organization_type\n                    x_opencti_reliability\n                }\n                ... on Individual {\n                    x_opencti_firstname\n                    x_opencti_lastname\n                }\n            }\n            objectMarking {\n                edges {\n                    node {\n                        id\n                        standard_id\n                        entity_type\n                        definition_type\n                        definition\n                        created\n                        modified\n                        x_opencti_order\n                        x_opencti_color\n                    }\n                }\n            }\n            objectLabel {\n                edges {\n                    node {\n                        id\n                        value\n                        color\n                    }\n                }\n            }\n            externalReferences {\n                edges {\n                    node {\n                        id\n                        standard_id\n                        entity_type\n                        source_name\n                        description\n                        url\n                        hash\n                        external_id\n                        created\n                        modified\n                    }\n                }\n            }\n            revoked\n            confidence\n            created\n            modified\n            pattern_type\n            pattern_version\n            pattern\n            name\n            description\n            indicator_types\n            valid_from\n            valid_until\n            x_opencti_score\n            x_opencti_detection\n            x_opencti_main_observable_type\n            x_mitre_platforms\n            observables {\n                edges {\n                    node {\n                        id\n                        observable_value\n                    }\n                }\n            }\n            killChainPhases {\n                edges {\n                    node {\n                        id\n                        standard_id\n                        entity_type\n                        kill_chain_name\n                        phase_name\n                        x_opencti_order\n                        created\n                        modified\n                    }\n                }\n            }\n        \n                        }\n                    }\n                    pageInfo {\n                        startCursor\n                        endCursor\n                        hasNextPage\n                        hasPreviousPage\n                        globalCount\n                    }\n                }\n            }\n        ';

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
        Authorization: 'Bearer ' + options.apiKey
      },
      body: {
        query,
        variables: { search: entity.value }
      },
      json: true
    };

    Logger.trace({ requestOptions }, 'Request Options');

    tasks.push(function (done) {
      requestWithDefaults(requestOptions, function (error, res, body) {
        let processedResult = handleRestError(error, entity, res, body);
         Logger.trace({ IN_DO_LOOKUP_PR: processedResult })
        if (processedResult.error) {
          done(processedResult);
          retur;
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
    Logger.trace({ IN_DO_LOOKUP_ERR: err });
    results.forEach((result) => {
      if (
        !result.body ||
        result.body === null ||
        !result.body.data.indicators ||
        result.body.data.indicators.edges.length === 0 ||
        result.body.data.indicators.pageInfo.globalCount === 0
      ) {
        lookupResults.push({
          entity: result.entity,
          data: null
        });
      } else {
        lookupResults.push({
          entity: result.entity,
          data: {
            summary: [],
            details: result.body
          }
        });
      }
    });

    Logger.debug({ lookupResults }, 'Results');
    cb(null, lookupResults);
  });
}

function handleRestError(error, entity, res, body) {
  let result;

  if (error) {
    return {
      error: error,
      detail: 'HTTP Request Error'
    };
  }

  if (res.statusCode === 200 && body) {
    // we got data!
    result = {
      entity: entity,
      body: body
    };
  } else if (res.statusCode === 404) {
    result = {
      error: 'Not Found',
      detail: body
    };
  } else if (res.statusCode === 400) {
    result = {
      error: 'Bad Request',
      detail: body
    };
  } else if (res.statusCode === 429) {
    result = {
      error: 'Rate Limit Exceeded',
      detail: body
    };
  } else {
    result = {
      error: 'Unexpected Error',
      statusCode: res ? res.statusCode : 'Unknown',
      detail: 'An unexpected error occurred'
    };
  }

  return result;
}

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
