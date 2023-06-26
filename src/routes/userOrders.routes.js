const express = require('express');
const { getUserOrders, saveOrder, makePayment, updatePayment, cancelOrder } = require('../controllers/userOrders.controller');
const router = express.Router();

router.get("/:email", getUserOrders)
router.post("/save", saveOrder)
router.post("/payment-intent", makePayment)
router.delete("/del/:id", cancelOrder)
router.put("/payment", updatePayment)

module.exports=router;