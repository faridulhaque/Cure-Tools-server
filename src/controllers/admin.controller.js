const { ObjectId } = require("mongodb");
const { getDb } = require("../utilities/dbConnect")

const getOrders = async (req, res, next) => {
    try {
        const db = getDb();
        const collection = db.collection("orders");
        const query = {};
        const cursor = collection.find(query);
        const orders = await cursor.toArray();
        res.status(200).json(orders);
    } catch (error) {
        res.status(404).json(error)
    }
}
const getUsers = async (req, res, next) => {
    try {
        const db = getDb();
        const collection = db.collection("users");
        const query = {};
        const cursor = collection.find(query);
        const users = await cursor.toArray();
        res.status(200).json(users);
    } catch (error) {
        res.status(404).json(error)
    }
}

const addProduct = async (req, res, next) => {
    try {
        const db = getDb();
        const collection = db.collection("tools");
        const tools = req.body;
        const result = await collection.insertOne(tools);
        res.status(200).json(result)
    } catch (error) {
        res.status(400).send(error)
    }
}

const handleAdmin = async (req, res, next) => {
    try {
        const db = getDb();
        const collection = db.collection("users");
        const email = req.params.email;
        const data = req.body;
        const filter = { email: email };
        const options = { upsert: true };
        const info = {
            $set: {
                role: data.role,
            },
        };
        const result = await collection.updateOne(filter, info, options);
        res.status(200).json(result);

    } catch (error) {
        res.status(400).send(error)
    }
}


const deleteProduct = async (req, res) => {
    try {
        const db = getDb()
        const collection = db.collection("tools");

        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const result = await collection.deleteOne(query);
        res.status(204).json(result);
    } catch (error) {
        res.status(400).json(error)
    }
}


const makeShipment = async (req, res, next) => {
    try {
        const db = getDb()
        const collection = db.collection("orders")
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const options = { upsert: true };
        const info = {
            $set: {

                shipment: true,
            },
        };

        const result = await collection.updateOne(query, info, options);
        res.status(200).send(result);
    } catch (error) {
        res.status(400).send(error);
    }
}

module.exports = { addProduct, deleteProduct, getOrders, getUsers, handleAdmin, makeShipment }