const dotenv = require("dotenv");
dotenv.config();


const { MongoClient } = require("mongodb");


const connectionString = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_KEY}@cluster0.mlmw1.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let dbConnection;

const connectToServer = (callback) => {
  client.connect(function (err, db) {
    if (err || !db) {
      return callback(err);
    }

    dbConnection = db.db('cureTools');
    console.log("Connected to MongoDB");
    return callback();
  });
};

const getDb = () => {
  return dbConnection;
};

module.exports = { connectToServer, getDb };
