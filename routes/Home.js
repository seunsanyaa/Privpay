const path = require('path');
const express = require('express');
const flash = require('connect-flash');
const { check, validationResult} = require("express-validator/check");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mailchimpClient = require("@mailchimp/mailchimp_transactional")("Dr5f1iglJGGZUZQUHEDEdQ");
const homeController = require('../controllers/Home');

//for sessions in the dashboard
// const isAuth = require('../middleware/is-auth');

const router = express.Router();

const User = require("../models/User");
const auth = require('../middleware/auth');
// router.use(cookieParser('supersecret'))
// router.use(session({cookie: {maxAge: 300000*2}}))
router.use(flash());
router.get('/', homeController.homePage);


// router.use((req, res, next)=>{
//     res.locals.message = req.session.message;
//     delete req.session.message;
//     next();
// });








router.get('/login', homeController.login);


router.post(
    "/login",

    [
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

        const { email, password } = req.body;
        try {
            let user = await User.findOne({
                email
            });
            if (!user)
                return res.status(400).json({
                    message: "User Not Exist"
                });

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch)
                return res.status(400).json({
                    message: "Incorrect Password !"
                });

            const payload = {
                user: {
                    id: user.id
                }
            };

            jwt.sign(
                payload,
                "randomString",
                {
                    expiresIn: 3600
                },
                (err, token) => {
                    if (err) throw err;
                    res.status(200).json({
                        token
                    });
                }
            );
        } catch (e) {
            console.error(e);
            res.status(500).json({
                message: "Server Error"
            });
        }
    }
);











router.get('/signup', homeController.signUp);

router.post(
    "/signup",

    [

        check("email", "Please enter a valid email").isEmail(),
        check("name", "Please Enter Your Full Name").not().isEmpty(),
        check("password", "Please enter a valid password").isLength({
            min: 8
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
            email,
            name,
            password
        } = req.body;
        try {
            let user = await User.findOne({
                email
            })
            if (user) {

                req.flash('message', 'User Already Exits');


                res.redirect('/signup');
            }

            user = new User({
                email,
                name,
                password,
                emailToken: crypto.randomBytes(64).toString('hex'),
                isVerified:false
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
                async (err, token) => {
                    if (err) throw err;
                    res.redirect('/verify',);
//                     const msg={
//
//                         from:'noreply@email.com',
//                         to: user.email,
//                         subject:'Privpay - verify your email',
//                         text:'Hello, thanks for registering on Privpay.' +
//                             ' Please copy and paste the address below to verify your account.' +
//                             ' http://' +req.headers.host + '/verify-email?token='+user.emailToken,
//
//                         html:'<h1> Hello, </h1>' +
//                             '<p> thanks for registering on Privpay.</p>' +
//                             '<p>Please click on the link below to verify your account.</p>'  +
//                             '<a href="http://${req.headers.host}/verify-email?token=${user.emailToken}"> Verify your account </a>'
//
//
//
//                     }
//
//
// try {
//     await mailchimpClient.senders.verifyDomain(msg);
//     req.flash('message','Thanks for registering')
//     res.redirect('/login')
// }
// catch (error) {
//     console.error(error);
//     req.flash('message','error something went wrong')
//     res.redirect('/signup')
//     // expected output: ReferenceError: nonExistentFunction is not defined
//     // Note - error messages will vary depending on browser
// }


                });
        }

        catch (err) {
            console.log(err.message);
            req.flash('message','error something went wrong');
            res.redirect('/signup')
            // res.status(500).send("Error in Saving");
        }
    }
)









router.get('/Bank-Verification', homeController.bvn);

router.get('/Authenticate', homeController.authCode);

router.get('/forget', homeController.forget);


router.get('/Verify', homeController.mailConfirm);

router.get('/verify-email', async (req ,res,next)=>{
    try {
        const user=await User.findOne({emailToken:req.query.token});
        if (!user){
            req.flash('message','Token is invalid, contact us for assistance');
            return res.redirect('/')
        }
        user.emailToken=null;
        user.isVerified=true;
        await user.save();
        await req.login(user,async (err)=>{
            if (err) return next (err);
            req.flash('message', 'Welcome to Privpay ${user.name}');
            const redirectUrl=req.session.redirectTo || '/';
            delete req.session.redirectTo;
            res.redirect(redirectUrl);
        })
    }catch (error) {
        console.log(error);
        req.flash('message','something went wrong');
        res.redirect()
    }


} )





module.exports = router;
