const { ObjectId } = require("mongodb");
const { getDb } = require("../utilities/dbConnect")

const getInventories = async (req, res, next) => {
    try {
        const db = getDb();
        const collection = db.collection("tools");
        const query = {};
        const cursor = collection.find(query);
        const tools = await cursor.toArray();
        res.status(200).json(tools);

    } catch (error) {
        res.status(400).json(error)

    }
}


const getOneProduct = async (req, res) => {
    try {

        const db = getDb();
        const collection = db.collection("tools");
        const id = req.params.id;



        if (id != "[product]") {
            const query = { _id: ObjectId(id) };
            const tool = await collection.findOne(query);
            res.status(200).json(tool);
        }

    } catch (error) {
        res.status(400).json(error)

    }
}


const getAllReviews = async (req, res) => {
    try {

        const db = getDb(); 
        const collection = db.collection("reviews"); 
        const query = {};
        const result = await collection.find(query).toArray(); 
        res.status(200).json(result);

    } catch (error) {
        res.status(400).json(error);
    }
}


const makeContact = async (req, res) => {
    try {
      const db = getDb();
      const collection = db.collection("messages");
      const data = req.body;
      const result = await collection.insertOne(data);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json(error);
    }
  };
  




module.exports = { getInventories, getOneProduct, getAllReviews, makeContact }