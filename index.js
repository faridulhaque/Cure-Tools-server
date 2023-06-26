const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const { connectToServer } = require("./src/utilities/dbConnect");

const homeRoutes = require("./src/routes/home.routes")
const adminRoutes = require("./src/routes/admin.routes")
const profileRoutes = require("./src/routes/profile.routes")
const registerRoutes = require("./src/routes/register.routes")
const userOrdersRoutes = require("./src/routes/userOrders.routes")
const userReviewRoutes = require("./src/routes/userReview.routes")

const port = 5000;

const app = express();
const corsConfig = {
  origin: true,
  credentials: true,
};
app.use(cors(corsConfig));

app.use(express.json());
app.options("*", cors(corsConfig));

app.use("/api/register", registerRoutes)
app.use("/api/home", homeRoutes)
app.use("/api/admin", adminRoutes)
app.use("/api/profile", profileRoutes)
app.use("/api/userOrders", userOrdersRoutes)
app.use("/api/myReview", userReviewRoutes)

// connect with mongodb

connectToServer((error) => {
  if (!error) {
    app.listen(port, () => {
      console.log("listening to port", port);
    });
  }
  else {
    console.log(error)
  }
})


app.get("/", (req, res) => {
  res.send("hello world");
});

app.all("*", (req, res) => {
  res.send("no route found");
})





// async function run() {
//   try {
//     await client.connect();
//     const toolsCollection = client.db("cureTools").collection("tools");
//     const usersCollection = client.db("cureTools").collection("users");
//     const ordersCollection = client.db("cureTools").collection("orders");
//     const reviewsCollection = client.db("cureTools").collection("reviews");

//     // getting all products for manage products route
//     app.get("/products", async (req, res) => {
//       const query = {};
//       const cursor = toolsCollection.find(query);
//       const products = await cursor.toArray();
//       res.send(products);
//     });
//     // getting review data for review page
//     app.get("/reviews", async (req, res) => {
//       const query = {};
//       const cursor = reviewsCollection.find(query);
//       const result = await cursor.toArray();
//       res.send(result);
//     });




//     });
//     // getting information of single user
//     app.get("/user/:email", async (req, res) => {
//       const email = req.params.email;

//       const query = { email: email };

//       const result = await usersCollection.findOne(query);
//       res.send(result);
//     });
//     // getting logged in user's orders for my orders page
//     app.get("/myOrders/:email", async (req, res) => {
//    
//       res.send(result);
//     });
//  

//     // getting admin
//     app.get("/users/admin/:email", async (req, res) => {
//       const email = req.params.email;
//       const user = await usersCollection.findOne({ email: email });
//       const isAdmin = user.role === "admin";
//       res.send({ admin: isAdmin });
//     });

//     

//       
//       res.send(result);
//     });
//     //store reviews from the users to db
//     app.put("/myReview/:email", async (req, res) => {
//       

//       const result = await reviewsCollection.updateOne(query, info, options);

//       res.send(result);
//     });
//     // updating old user's data in the database
//     app.put("/profile/:email", async (req, res) => {
//       const email = req.params.email;
//       const query = { email: email };
//       const user = req.body;
//       const options = { upsert: true };
//       const data = {
//         $set: {
//           displayName: user.displayName,
//           phone: user.phone,
//           photo: user.photo,
//           address: user.address,
//         },
//       };
//       const result = await usersCollection.updateOne(query, data, options);
//       res.send(result);
//     });

//     // updating shipment status by admins
//     app.put("/shipment/:id", async (req, res) => {
//       const id = req.params.id;
//       const filter = { _id: ObjectId(id) };
//       const options = { upsert: true };
//       const data = {
//         $set: {
//           shipmentStatus: true,
//         },
//       };
//       const result = await ordersCollection.updateOne(filter, data, options);
//       res.send(result);
//     });
//     // updating payment information for my orders page in db
//     app.put("/order/payment/:id", async (req, res) => {
//       
//       res.send(result);
//     });



//     // posting orders from inventory page
//     app.post("/orders", async (req, res) => {
//       const orders = req.body;
//       const result = await ordersCollection.insertOne(orders);
//       res.send(result);
//     });
//     // add new product by admins
//     app.post("/tools", async (req, res) => {
//       const tools = req.body;
//       const result = await toolsCollection.insertOne(tools);
//       res.send(result);
//     });

//     // deleting data from my order page
//     app.delete("/order/:id", async (req, res) => {
//       const id = req.params.id;
//       const query = { _id: ObjectId(id) };
//       const result = await ordersCollection.deleteOne(query);
//       res.send(result);
//     });

//     // delete item from order list
//     app.delete("/order/:id", async (req, res) => {
//       const id = req.params.id;

//       const query = { _id: ObjectId(id) };
//       const result = await ordersCollection.deleteOne(query);
//       res.send(result);
//     });
//     // payment method added
//    
//     });
//   } finally {
//   }
// }
// run().catch(console.dir);



