const MongoClient = require("mongodb").MongoClient;

let _connection = undefined;
let _db = undefined;

module.exports = async () => {
  if (!_connection) {
    _connection = await MongoClient.connect(
      process.env.MONGO_URL || "mongodb://localhost:27017/",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    _db = await _connection.db(process.env.MONGO_DB || "urban-chowk");
  }

  return _db;
};
