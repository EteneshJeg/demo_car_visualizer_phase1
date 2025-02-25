const express = require('express');
const router = express.Router()

// user controllers 
const {register,login,check} = require('../controller/userController')
// register route 
router.post("/register",register)

// Login user
router.post("/login", login);

//check user
router.get("/check", check);


module.exports = router