const { MongoClient } = require('mongodb');

const uri = process.env.MONGO_URL || process.env.ORDERS_MONGO_URL || 'mongodb://orders-mongodb:27017';
const dbName = process.env.ORDERS_DB_NAME || 'orders_db';

const client = new MongoClient(uri);
const db = client.db(dbName);

module.exports = {
  db,
  client
};


