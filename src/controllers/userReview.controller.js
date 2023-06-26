const { getDb } = require("../utilities/dbConnect");

const getReview = async (req, res) => {
    try {
        const email = req.params.email;
        const db = getDb()
        const collection = db.collection("reviews")
       
        const query = { email: email };
        const result = await collection.findOne(query);
        res.status(200).send(result);
    } catch (error) {
        res.status(400).json(error)
    }
}

const addReview = async (req, res) => {
    try {
        const db = getDb() 
        const collection = db.collection("reviews")
        const email = req.params.email;
        const data = req.body;
        const query = { email: email };
        const info = {
            $set: {
                email: data.email,
                name: data.name,
                img: data.img,
                ratingText: data.ratingText,
                ratingStar: data.ratingStar,
            },
        };
        const options = { upsert: true };

        const result = await collection.updateOne(query, info, options);
        res.status(200).json(result)

    } catch (error) {
        res.status(400).json(error)

    }
}

module.exports = { getReview, addReview }