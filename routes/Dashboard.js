const path = require('path');
const express = require('express');
const { check, validationResult} = require("express-validator/check");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const homeController = require('../controllers/Home');
const DashController = require('../controllers/Dashboard');

const router = express.Router();
const User = require("../models/User");

const auth = require('../middleware/auth');


router.get("/dashboard", auth, async (req, res) => {
    try {
        // request.user is getting fetched from Middleware after token authentication
        const user = await User.findById(req.user.id);
        res.json(user);
    } catch (e) {
        res.send({ message: "Error in Fetching user" });
    }
});

module.exports = router;