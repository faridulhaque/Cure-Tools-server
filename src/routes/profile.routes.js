const express = require('express');
const { getUserProfile, updateUserProfile } = require('../controllers/profile.controller');
const router = express.Router();

router.get("/me/:email", getUserProfile)
router.put("/update/:email", updateUserProfile)


module.exports=router;