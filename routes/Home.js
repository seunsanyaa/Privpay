const path = require('path');
const express = require('express');
const { check, validationResult} = require("express-validator/check");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const homeController = require('../controllers/Home');

//for sessions in the dashboard
// const isAuth = require('../middleware/is-auth');

const router = express.Router();
const User = require("../models/User");

router.get('/', homeController.homePage);

router.get('/login', homeController.login);



router.get('/signup', homeController.signUp);

router.post(
    "/signup",
    [
        check("name", "Please Enter Your Full Name")
            .not()
            .isEmpty(),
        check("email", "Please enter a valid email").isEmail(),
        check("password", "Please enter a valid password").isLength({
            min: 7
        })
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            });
        }

        const {
            name,
            email,
            password
        } = req.body;
        try {
            let user = await User.findOne({
                email
            });
            if (user) {
                return res.status(400).json({
                    msg: "User Already Exists"
                });
            }

            user = new User({
                name,
                email,
                password
            });

            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);

            await user.save();

            const payload = {
                user: {
                    id: user.id
                }
            };

            jwt.sign(
                payload,
                "randomString", {
                    expiresIn: 10000
                },
                (err, token) => {
                    if (err) throw err;
                    res.status(200).json({
                        token
                    });

                }

            );
        } catch (err) {
            console.log(err.message);
            res.status(500).send("Error in Saving");
        }
    }
);









router.get('/Bank-Verification', homeController.bvn);

router.get('/Authenticate', homeController.authCode);

router.get('/forget', homeController.forget);


router.get('/Verify', homeController.mailConfirm);




module.exports = router;
