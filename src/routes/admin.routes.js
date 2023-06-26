const express = require('express');
const { getInventories, getOneProduct } = require('../controllers/home.controllers');
const { addProduct, deleteProduct, getOrders, handleAdmin, makeShipment, getUsers } = require('../controllers/admin.controller');
const router = express.Router();


router.get("/orders", getOrders)
router.get("/users", getUsers)
router.post("/tools", addProduct)
router.put("/:email", handleAdmin)
router.delete("/tool/:id", deleteProduct)
router.put("/shipment/:id", makeShipment)


module.exports=router;