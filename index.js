const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;
const stripe = require("stripe")(process.env.STRIPE_KEY);

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
// JSON WEB token implementation

const verifyJWT = (req, res, next) => {
  const receivedToken = req.headers.authorization;
  if (!receivedToken) {
    return res.status(401).send({ message: "unauthorized access" });
  }
  const token = receivedToken.split(" ")[1];
  jwt.verify(token, process.env.JSON_TOKEN, function (err, decoded) {
    if (err) {
      return res.status(403).send({ message: "forbidden access" });
    }
    req.decoded = decoded;
    next();
  });
};

async function run() {
  try {
    await client.connect();
    const toolsCollection = client.db("cureTools").collection("tools");
    const usersCollection = client.db("cureTools").collection("users");
    const ordersCollection = client.db("cureTools").collection("orders");
    const reviewsCollection = client.db("cureTools").collection("reviews");

    // getting data for inventory section in the home page
    app.get("/tools", async (req, res) => {
      const query = {};
      const cursor = toolsCollection.find(query);
      const tools = await cursor.toArray();
      res.send(tools);
    });
    // getting all users
    app.get("/users", async (req, res) => {
      const query = {};
      const cursor = usersCollection.find(query);
      const users = await cursor.toArray();
      res.send(users);
    });
    // getting all products for manage products route
    app.get("/products", verifyJWT, async (req, res) => {
      const query = {};
      const cursor = toolsCollection.find(query);
      const products = await cursor.toArray();
      res.send(products);
    });
    // getting review data for review page
    app.get("/reviews", async (req, res) => {
      const query = {};
      const cursor = reviewsCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });
    // getting data for single inventory in the dynamic page.
    app.get("/tool/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const tool = await toolsCollection.findOne(query);
      res.send(tool);
    });
    // getting information of single user
    app.get("/user/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };

      const result = await usersCollection.findOne(query);
      res.send(result);
    });
    // getting logged in user's orders for my orders page
    app.get("/myOrders", async (req, res) => {
      const email = req.query.email;

      const query = { email: email };
      const cursor = ordersCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });
    // getting logged in user's review for add a review page
    app.get("/myReview/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const result = await reviewsCollection.findOne(query);
      res.send(result);
    });
    // getting all orders
    app.get("/orders", verifyJWT, async (req, res) => {
      const query = {};
      const cursor = ordersCollection.find(query);
      const orders = await cursor.toArray();
      res.send(orders);
    });
    // getting admin
    app.get("/users/admin/:email", async (req, res) => {
      const email = req.params.email;
      const user = await usersCollection.findOne({ email: email });
      const isAdmin = user.role === "Admin";
      res.send({ admin: isAdmin });
    });

    // adding new user's data in the database with generate a token
    app.put("/user/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const user = req.body;
      const options = { upsert: true };
      const data = {
        $set: {
          email: user.email,

          primaryName: user.primaryName,
          primaryPic: user.primaryPic,
        },
      };
      const result = await usersCollection.updateOne(query, data, options);
      const token = jwt.sign({ email: email }, process.env.JSON_TOKEN, {
        expiresIn: "1d",
      });

      res.send({ result, token });
    });
    //store reviews from the users to db
    app.put("/myReview/:email", async (req, res) => {
      const email = req.params.email;

      const data = req.body;

      const query = { email: email };
      const options = { upsert: true };
      const info = {
        $set: {
          email: data.email,
          name: data.name,
          img: data.img,
          ratingText: data.ratingText,
          ratingStar: data.ratingStar,
        },
      };

      const result = await reviewsCollection.updateOne(query, info, options);

      res.send(result);
    });
    // updating old user's data in the database
    app.put("/profile/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const user = req.body;
      const options = { upsert: true };
      const data = {
        $set: {
          profileName: user.profileName,
          phn: user.phn,
          address: user.address,
        },
      };
      const result = await usersCollection.updateOne(query, data, options);
      res.send(result);
    });
    // making or removing an admin
    app.put("/handleAdmin/:email", async (req, res) => {
      const email = req.params.email;
      const data = req.body;

      const filter = { email: email };
      const options = { upsert: true };
      const info = {
        $set: {
          role: data.role,
        },
      };
      const result = await usersCollection.updateOne(filter, info, options);
      res.send(result);
    });
    // updating shipment status by admins
    app.put("/shipment/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const data = {
        $set: {
          shipmentStatus: true,
        },
      };
      const result = await ordersCollection.updateOne(filter, data, options);
      res.send(result);
    });
    // updating payment information for my orders page in db
    app.put("/order/payment/:id", async (req, res) => {
      const id = req.params.id;
      const data = req.body;
      const query = { _id: ObjectId(id) };
      const options = { upsert: true };
      const info = {
        $set: {
          transaction: data.transaction,
          paymentStatus: data.paymentStatus,
        },
      };
      const result = await ordersCollection.updateOne(query, info, options);
      res.send(result);
    });

    // posting orders from inventory page
    app.post("/orders", async (req, res) => {
      const orders = req.body;
      const result = await ordersCollection.insertOne(orders);
      res.send(result);
    });
    // add new product by admins
    app.post("/tools", async (req, res) => {
      const tools = req.body;
      const result = await toolsCollection.insertOne(tools);
      res.send(result);
    });

    // deleting data from my order page
    app.delete("/order/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await ordersCollection.deleteOne(query);
      res.send(result);
    });
    // deleting products from manage product page
    app.delete("/tool/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await toolsCollection.deleteOne(query);
      res.send(result);
    });
    // delete item from order list
    app.delete("/order/:id", async (req, res) => {
      const id = req.params.id;

      const query = { _id: ObjectId(id) };
      const result = await ordersCollection.deleteOne(query);
      res.send(result);
    });
    // payment method added
    app.post("/create-payment-intent", async (req, res) => {
      const { totalPrice } = req.body;

      const amount = parseFloat(totalPrice) * 100;
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount,
        currency: "usd",
        payment_method_types: ["card"],
      });
      res.send({ clientSecret: paymentIntent.client_secret });
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
