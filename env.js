const _ = require('lodash');
const util = require('util');
const nconf = require('nconf');

const env = module.exports;

const vars = {
  // Schema
  SCHEMA_CLIENT_ID: {
    required: true,
    export: true,
  },
  SCHEMA_CLIENT_KEY: {
    required: true,
    export: true,
    redacted: true,
  },

  // Algolia
  ALGOLIA_APP_ID: {
    required: true,
    export: true,
  },
  ALGOLIA_API_KEY: {
    required: true,
    export: true,
    redacted: true,
  },
  ALGOLIA_PREFIX: {
    export: true,
  },
  ALGOLIA_INDEXES: {
    export: true,
  },
};
_.each(vars, (envProps, envName) => {
  let envVal = nconf.get(envName) || '[UNDEFINED]';

  // Required
  if (envProps.required && envVal === '[UNDEFINED]') {
    // eslint-disable-next-line no-console
    console.error(
      `├── Missing ENV Variable: ${envName}. Check your .env file.`
    );
    process.exit(1);
  }

  // Cast to Number
  if (envProps.type === Number) {
    envVal = Number(envVal);
  }

  // Export
  if (envProps.export) {
    env[envName] = envVal;
  }

  // Redacted
  if (envProps.redacted) {
    envVal = '[REDACTED]';
  }

  // eslint-disable-next-line no-console
  console.log(`├── ${envName}=${envVal} ──┤`);
});
