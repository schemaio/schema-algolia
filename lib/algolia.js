const async = require('async');
const EventEmitter = require('events');
const algoliasearch = require('algoliasearch');

const algolia = module.exports;

/**
 * Sync data to algolia
 */
algolia.sync = function({
  schema,
  app_id,
  api_key,
  prefix,
  indexes,
}) {
  // Init algolia client
  const client = algoliasearch(app_id, api_key);

  // Get index list
  const indexArray = algolia.parseIndexArray(indexes);
  if (!indexArray.length) {
    throw new Error('No indexes specified for import (ALGOLIA_INDEXES)');
  }

  // Progress event emitter
  const events = new EventEmitter();

  // Progress vars
  const startTime = Date.now();
  let totalRecords = 0;

  // Iterate over indexes
  setImmediate(() => {
    async.eachSeries(indexArray,
      (index, done) => {
        algolia.syncIndex({
          client,
          schema,
          prefix,
          index,
          events,
        }, (countRecords) => {
          totalRecords += countRecords || 0;
          done();
        });
      },
      () => {
        const totalSeconds = (Date.now() - startTime) / 1000;
        events.emit('completed', totalRecords, totalSeconds);
      }
    );
  });

  return events;
}

// Helper to parse indexes config to array
algolia.parseIndexArray = function(indexes) {
  if (typeof indexes === 'string') {
    return indexes.split(/\s*,\s*/);
  }
  return indexes;
}

// Sync a single index with schema collection
algolia.syncIndex = function({
  client,
  schema,
  prefix,
  index,
  events,
}, callback) {
  const indexName = prefix + index;
  const modelName = index;

  events.emit('index.started', indexName, modelName);

  let page = 1;
  let result = null;
  let records = null;
  let countRecords = 0;

  async.doUntil(
    (done) => {
      schema.get(`/${modelName}`, { page, limit: 100 }, (err, res) => {
        if (err) {
          events.emit('index.error', err.toString());
          callback();
          return;
        }
        result = res.toObject();
        records = result.results;
        algolia.syncIndexRecords({
          client,
          indexName,
          records,
          events,
        }, (err) => {
          if (err) {
            events.emit('index.error', err.toString());
            callback();
            return;
          }
          events.emit('index.progress', records.length);
          countRecords += records.length;
          done();
        });
      });
    },
    () => {
      page++;
      return result.pages[page] === undefined;
    },
    () => {
      callback(countRecords);
    }
  );
}

// Sync records with algolia index
algolia.syncIndexRecords = function({
  client,
  indexName,
  records,
  events,
}, callback) {
  const index = client.initIndex(indexName);

  // Change id to objectID
  records.forEach(record => {
    record.objectID = record.id;
    delete record.id;
  });

  index.addObjects(records, (err, content) => {
    callback(err);
  });
}
