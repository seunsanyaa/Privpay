const path = require('path');
const express = require('express');

const homeController = require('../controllers/Home');

//for sessions in the dashboard
// const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/', homeController.homePage);

router.get('/login', homeController.login);

router.get('/signup', homeController.signUp);

router.get('/bank-verification', homeController.bvn);

router.get('/authenticate', homeController.authCode);

router.get('/forget', homeController.forget);

router.get('/verify', homeController.mailConfirm);





module.exports = router;
