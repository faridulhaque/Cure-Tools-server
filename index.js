const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;

const app = express();

app.use(cors());
app.use(express.json());

// connect with mongodb

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_KEY}@cluster0.mlmw1.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const toolsCollection = client.db("cureTools").collection("tools");
    const usersCollection = client.db("cureTools").collection("users");

    // getting data for inventory section in the home page
    app.get("/tools", async (req, res) => {
      const query = {};
      const cursor = toolsCollection.find(query);
      const tools = await cursor.toArray();
      res.send(tools);
    });
    // getting data for single inventory in the dynamic page.
    app.get("/tool/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const tool = await toolsCollection.findOne(query);
      res.send(tool);
    });
    // adding new user's data in the database
    app.put("/user/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const user = req.body;
      const options = { upsert: true };
      const data = {
        $set: {
          email: user.email,
          name: user.name,
          img: user.image,
        },
      };
      const result = await usersCollection.updateOne(query, data, options);
      res.send(result);
    });
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("hello world");
});
app.listen(port, () => {
  console.log("listening to port", port);
});
