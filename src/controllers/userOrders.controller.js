const { ObjectId } = require("mongodb");
const { getDb } = require("../utilities/dbConnect");
const dotenv = require("dotenv");
const stripe = require("stripe")(process.env.STRIPE_KEY);
dotenv.config();

const getUserOrders = async (req, res, next) => {
    try {
        const db = getDb();
        const ordersCollection = db.collection("orders");
        const email = req.params.email;

        const query = { email: email };
        const cursor = ordersCollection.find(query);
        const result = await cursor.toArray();
        res.status(200).json(result);
    } catch (error) {
        res.status(400).send(error);
    }

}
const saveOrder = async (req, res, next) => {
    try {
        const db = getDb()
        const collection = db.collection("orders")
        const orders = req.body;
        const result = await collection.insertOne(orders);
        res.status(200).send(result);
    } catch (error) {
        res.status(400).send(error);
    }
}
const makePayment = async (req, res, next) => {
    try {
        const { totalPrice } = req.body;
        const amount = parseFloat(totalPrice) * 100;
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: "usd",
            payment_method_types: ["card"],
        });

        res.send({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        res.status(400).send(error);
    }
}

const cancelOrder = async (req, res, next) => {
    try {
        const db = getDb();
        const collection = await db.collection("orders");
        const id = req.params.id;
        const query = { _id: ObjectId(id) }; // Corrected the query format
        const result = await collection.deleteOne(query);
        res.status(200).json(result);
    } catch (error) {
        res.status(404).send(error);
    }

}
const updatePayment = async (req, res, next) => {
    try {
        const db = getDb()
        const collection = db.collection("orders")
        const data = req.body;
        const id = data.id;
        const query = { _id: ObjectId(id) };
        const options = { upsert: true };
        const info = {
            $set: {
                trId: data.trId,
                payment: true,
            },
        };

        const result = await collection.updateOne(query, info, options);
        res.status(200).send(result);
    } catch (error) {
        res.status(400).send(error);
    }
}


module.exports = { getUserOrders, saveOrder, makePayment, updatePayment, cancelOrder }