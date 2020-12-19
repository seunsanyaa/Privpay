const path = require('path');
const express = require('express');
const flash = require('connect-flash');
const { check, validationResult} = require("express-validator/check");
const bcrypt = require("bcryptjs");
const session = require('express-session');
const jwt = require("jsonwebtoken");
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey('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');
const homeController = require('../controllers/Home');
const accountSid = 'AC2d957174edc41c3319145d8a935aca04';
const authToken = 'c586aef6d9838bf26d9c453eba92b449';
const twilioClient = require("twilio")(accountSid, authToken);
const verificationSID= 'VA2a8112631ea0d0d5557d8b36a8e4b15a';
//for sessions in the dashboard
// const isAuth = require('../middleware/is-auth');

const router = express.Router();

const User = require("../models/User");
const auth = require('../middleware/auth');

// router.use(flash());
router.get('/', homeController.homePage);
// router.use(session({
//     secret: 'keyboard cat',
//     resave: false,
//     saveUninitialized: false,
//     cookie: { maxAge: 90000 }
// }));

router.get('/verified', homeController.verified);

router.get('/confirm', homeController.confirm);

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
     async  (req, res,next) => {
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

                req.flash('error', 'User Already Exits');


              return   res.redirect('/signup');
            }

          user = new User({
                email,
                name,
                password,
              emailToken:crypto.randomBytes(64).toString('hex'),
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
                async (err, user) => {
                    if (err) throw err;

                    const msg={
                        from:'seunsanyaa@gmail.com',
                        to:email,
                        subject:'Privpay - verify your mail',
                        text:`Hello, thanks for registering on privpay.
                         Please copy and paste the link below to verify your account.
                        http://${req.headers.host}/verify?token=${user.emailToken}                                
                `,
                        html:`<h1>Hello,</h1> 
                                <p>Thanks for registering on privpay.</p>
                        <p> Please click the link below to verify your account.</p>
                      <a href="http://${req.headers.host}/verify?token=${user.emailToken}"> Verify your account </a>                                
                `


                    }

                    try {
                       await sgMail.send(msg);
                        req.flash('success', 'Please check your mail to verify your account.')
                        res.redirect('/')
                    }
                    catch (err) {
                        console.log(err.message);
                        req.flash('error', 'Something went wrong');
                         res.redirect('/signup')
                        // res.status(500).send("Error in Saving");
                    }


// res.redirect('/verify')
                    // twilioClient.verify
                    //     .services(verificationSID)
                    //     .verifications.create({ to: email, channel: "email" })
                    //     .then(verification => {
                    //         console.log("Verification email sent");
                    //
                    //         res.redirect(`/verify?email=${email}`);
                    //     })
                    //     .catch(error => {
                    //         console.log(error);
                    //         req.flash('message', 'Something went wrong');
                    //        return  res.redirect('/signup');
                    //
                    //     });






                });
        }

        catch (err) {
            console.log(err.message);
            req.flash('error', 'User Already Exits');
            return res.redirect('/signup')
            // res.status(500).send("Error in Saving");
        }

    }

)









router.get('/Bank-Verification', homeController.bvn);

router.get('/Authenticate', homeController.authCode);

router.get('/forget', homeController.forget);


router.get('/verify', homeController.mailConfirm);

router.post("/verify", (req, res) => {
    const userCode = req.body.code;
  const email = req.body.email;


    console.log(`Code: ${userCode}`);
    console.log(`Email: ${email}`);

    //CHECK YOUR VERIFICATION CODE HERE

    // twilioClient.verify
    //     .services('VA2a8112631ea0d0d5557d8b36a8e4b15a')
    //     .verificationChecks.create({ to: email, code: userCode })
    //     .then(verification_check => {
    //         if (verification_check.status === "approved") {
    //             User.isVerified=true;
    //
    //             res.redirect("/");
    //         } else {
    //
    //             req.flash('message','wrong code');
    //            return  res.redirect(`/verify?email=`+email);
    //
    //         }
    //     })
    //     .catch(error => {
    //
    //         console.log(error);
    //         req.flash('message','sommething went wrong');
    //       return   res.redirect(`/verify?email=`+email);
    //     });
});

router.get('*', homeController.error404);






module.exports = router;
