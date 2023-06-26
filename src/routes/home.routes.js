const express = require('express');
const { getInventories, getOneProduct, getAllReviews, makeContact } = require('../controllers/home.controllers');
const router = express.Router();

router.get("/tools", getInventories)
router.get("/tool/:id", getOneProduct)
router.get("/reviews", getAllReviews)
router.post("/contact", makeContact)


module.exports=router;