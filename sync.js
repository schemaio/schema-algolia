/**
 * Schema -> Algolia
 */

const algolia = require('./lib/algolia');
const Schema = require('schema-client');
const Spinner = require('cli-spinner').Spinner;

// Read `.env` into `process.env`
require('dotenv').config({
  silent: true,
});

// Load nconf environment variable defaults
require('nconf').env().defaults({
  ALGOLIA_PREFIX: 'schema_',
  ALGOLIA_INDEXES: 'products,pages,blogs',
});

// Load environment
const env = require('./env');

// Init schema client
const schema = new Schema.Client(
  env.SCHEMA_CLIENT_ID,
  env.SCHEMA_CLIENT_KEY
);

// Start algolia sync
const progress = algolia.sync({
  schema,
  app_id: env.ALGOLIA_APP_ID,
  api_key: env.ALGOLIA_API_KEY,
  prefix: env.ALGOLIA_PREFIX,
  indexes: env.ALGOLIA_INDEXES,
});

// Log progress
const spinner = new Spinner();
spinner.start();

console.log(`\nSyncing [${env.SCHEMA_CLIENT_ID}] -> Algolia`);

progress.on('index.started', (name, model) => {
  console.log(`\nSyncing index '${name}' from /${model}...`);
});
progress.on('index.progress', (count) => {
  spinner.stop(true);
  console.log(`  imported ${count} records`);
  spinner.start();
});
progress.on('index.error', (message) => {
  console.log(`  error: ${message}`);
});
progress.on('completed', (count, seconds) => {
  console.log(`\nDone. Imported ${count} records in ${seconds}s.\n`);
  spinner.stop(true);
  process.exit();
});
