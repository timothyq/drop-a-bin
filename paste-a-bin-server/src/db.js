const MongoClient = require("mongodb").MongoClient;

const mongoUsername = process.env.MONGO_USERNAME;
const mongoPassword = process.env.MONGO_PASSWORD;
const mongoHost = process.env.MONGO_HOST;
const mongoPort = process.env.MONGO_PORT;

const url = `mongodb://${mongoUsername}:${mongoPassword}@${mongoHost}:${mongoPort}`;
const client = new MongoClient(url);

const db = client.db("paste-a-bin");
const pastesCollection = db.collection("pastes");
const commentsCollection = db.collection("comments");

module.exports = { pastesCollection, commentsCollection };
