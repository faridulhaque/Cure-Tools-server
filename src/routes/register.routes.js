const express = require('express');
const registerUser = require('../controllers/register.controller');
const router = express.Router();

router.post("/new", registerUser)


module.exports=router;