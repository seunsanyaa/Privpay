const path = require('path');
const express = require('express');
const { check, validationResult} = require("express-validator/check");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const DashController = require('../controllers/Dashboard');

const router = express.Router();

const User = require("../models/User");
const BTC = require("../models/User");



router.get('/dashboard', DashController.dashboard);

module.exports = router;