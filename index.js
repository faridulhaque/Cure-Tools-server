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




