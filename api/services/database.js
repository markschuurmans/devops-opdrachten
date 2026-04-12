const { MongoClient } = require("mongodb");

const uri = process.env.MONGO_URL;
const dbName = process.env.DB_NAME || "devops_opdrachten";

const client = new MongoClient(uri);

const db = client.db(dbName);

module.exports = {
    db: db,
    client: client
};