const express = require('express');
const { getReview, addReview } = require('../controllers/userReview.controller');
const router = express.Router();

router.get("/get/:email", getReview)
router.put("/update/:email", addReview)



module.exports=router;