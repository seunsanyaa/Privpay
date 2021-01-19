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
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bitcoin = require("bitcoinjs-lib");

const DashController = require('../controllers/Dashboard');


//for sessions in the dashboard
// const isAuth = require('../middleware/is-auth');

const router = express.Router();

const keyPair = bitcoin.ECPair.makeRandom();
// const { address } = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey })

const User = require("../models/User");
// const auth = require('../middleware/auth');

// router.use(flash());
router.get('/', homeController.homePage);


router.get('/verified', homeController.verified);

router.get('/confirm', homeController.confirm);

router.get('/login', homeController.login);

router.get('/changepassword', homeController.changepass);





// router.post('changepassword', async(req, res)=> {
//     async.waterfall([
//         function(done) {
//             User.findOne({ email: req.session.context }, function(err, user, next) {
//                 if (!user) {
//                     req.flash('error', 'Password reset token is invalid or has expired.');
//                     return res.redirect('back');
//                 }
//
//
//                 // user.password = req.body.password;
//                 const salt = await bcrypt.genSalt(10);
//                 user.password = await bcrypt.hash(req.body.password, salt);
//                 console.log('password' + user.password  + 'and the user is' + user)
//
//                 user.save(function(err) {
//                     if (err) {
//                         console.log('here')
//                         return res.redirect('back');
//                     } else {
//                         console.log('here2')
//                         req.logIn(user, function(err) {
//                             done(err, user);
//                         });
//
//                     }
//                 });
//             });
//         },
//
//
//
//
//
//         function(user, done) {
//             // console.log('got this far 4')
//             var smtpTrans = nodemailer.createTransport({
//                 service: 'Gmail',
//                 auth: {
//                     user: 'myemail',
//                     pass: 'mypass'
//                 }
//             });
//             var mailOptions = {
//                 to: user.email,
//                 from: 'myemail',
//                 subject: 'Your password has been changed',
//                 text: 'Hello,\n\n' +
//                     ' - This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
//             };
//             smtpTrans.sendMail(mailOptions, function(err) {
//                 // req.flash('success', 'Success! Your password has been changed.');
//                 done(err);
//             });
//         }
//     ], function(err) {
//         res.redirect('/');
//     });
// });






router.post(
    "/changepassword",

    [


        check("password", "Please enter a valid password").isLength({
            min: 8
        })
    ],
    async  (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            });
        }

        const {

            password
        } = req.body;
       const email=  req.session.context
        try {
            let user = await User.findOne({
                email: req.session.context
            })
            if (!user) {

                req.flash('error', '/');


                return res.redirect('/');
            } else {
                // const user =  User.updateOne({
                //
                //     password:password,
                //
                //
                // });

                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(password, salt);

                await user.save();

                const payload = {
                    user: {
                        id: user.id,

                    }
                };

                jwt.sign(
                    payload,
                    "randomString", {
                        expiresIn: 10000 * 60
                    },
                    //     User.register(user, req.body.password,
                    async (err, user) => {
                        if (err) throw err;

                        const msg = {
                            from: 'seunsanyaa@gmail.com',
                            to: email,
                            subject: 'Privpay - Changed password',
                            text: `Hello, your password has been successfully changed.
                         You can now login with the new password.
                        http://${req.headers.host}/login
                `,
                            html: `<h1>Hello,</h1>
                                <p>Thanks for registering on privpay.</p>
                        <p> Please click the link below to verify your account.</p>
                      <a href="http://${req.headers.host}/login}"> Verify your account </a>
                `


                        }

                        try {
                            // await sgMail.send(msg);
                            console.log('email sent', msg)
                            // req.session.user=req.body.user;
                            req.session.user=user
                            req.session.context= email
                            res.redirect('/login')

                        } catch (err) {
                            console.log(err.message);
                            req.flash('error', 'Something went wrong');
                            res.redirect('/signup')
                            // res.status(500).send("Error in Saving");
                        }


                    });
            }
        }
        catch (err) {
            console.log(err.message);
            req.flash('error', 'Something went wrong');
            return res.redirect('/login')
            // res.status(500).send("Error in Saving");
        }


    }

)










router.post(
    "/login",
    passport.authenticate('local', { successRedirect: '/dashboard',
        failureRedirect: '/login',
        failureFlash: true })
    // [
    //     check("email", "Please enter a valid email").isEmail(),
    //     check("password", "Please enter a valid password").isLength({
    //         min: 7
    //     })
    // ],
    // async (req, res) => {
    //     const errors = validationResult(req);
    //
    //     if (!errors.isEmpty()) {
    //         return res.status(400).json({
    //             errors: errors.array()
    //         });
    //     }
    //
    //     const { email, password } = req.body;
    //     try {
    //         let user = await User.findOne({
    //             email
    //         });
    //         if (!user || user.isVerified===false) {
    //             console.log('User does not exists\'');
    //             req.flash('error', 'User does not exists');
    //             return res.redirect('/login')
    //         }
    //         const isMatch = await bcrypt.compare(password, user.password);
    //         if (!isMatch) {
    //
    //             console.log('incorrect password');
    //             req.flash('error', 'Incorrect password');
    //             return res.redirect('/login');
    //
    //         }
    //         const payload = {
    //             user: {
    //                 id: user.id
    //             }
    //         };
    //
    //         jwt.sign(
    //             payload,
    //             "randomString",
    //             {
    //                 expiresIn: 3600
    //             },
    //             (err, token) => {
    //                 if (err) throw err;
    //                 res.redirect('/dashboard')
    //             }
    //         );
    //     } catch (e) {
    //         console.error(e);
    //         res.status(500).json({
    //             message: "Server Error"
    //         });
    //     }
    // }
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
     async  (req, res) => {
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
if(!email) {
    console.log('Error')
}
else {    try {
    let user = await User.findOne({
        email : email
    })
    if (user) {

        req.flash('error', 'User Already Exits');


        return res.redirect('/signup');
    } else {
        const user = new User({
            email:email,
            name:name,
            password:password,

            isVerified: false
        });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        const payload = {
            user: {
                id: user.id,

            }
        };

        jwt.sign(
            payload,
            "randomString", {
                expiresIn: 10000 * 60 * 60 * 2
            },
            //     User.register(user, req.body.password,
            async (err, user) => {
                if (err) throw err;

                const msg = {
                    from: 'seunsanyaa@gmail.com',
                    to: email,
                    subject: 'Privpay - verify your mail',
                    text: `Hello, thanks for registering on privpay.
                         Please copy and paste the link below to verify your account.
                        http://${req.headers.host}/verified?token=${user}
                `,
                    html: `<h1>Hello,</h1>
                                <p>Thanks for registering on privpay.</p>
                        <p> Please click the link below to verify your account.</p>
                      <a href="http://${req.headers.host}/verified?token=${user}"> Verify your account </a>
                `


                }

                try {
                    // await sgMail.send(msg);
                    console.log('email sent', msg)
                    console.log(keyPair.getPublicKey());
                    // req.session.user=req.body.user;
                    req.session.user=user
                    req.session.context= email
                    res.redirect('/confirm')

                } catch (err) {
                    console.log(err.message);
                    req.flash('error', 'Something went wrong');
                    res.redirect('/signup')
                    // res.status(500).send("Error in Saving");
                }


            });
    }
}
catch (err) {
    console.log(err.message);
    req.flash('error', 'User Already Exits');
    return res.redirect('/signup')
    // res.status(500).send("Error in Saving");
}
}

    }

)









router.get('/Bank-Verification', homeController.bvn);

router.get('/Authenticate', homeController.authCode);

router.get('/forget', homeController.forget);

router.post('/forget', [

        check("email", "Please enter a valid email").isEmail(),

    ],
    async  (req, res,next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            });
        }

        const {
            email
        } = req.body;

        try {
            let user = await User.findOne({
                email : email
            })
            if (!user) {

                req.flash('error', 'User does not exist');


                return   res.redirect('/forget');
            }


else {


            const payload = {
                user: {
                    id: user.id
                }
            };

   jwt.sign(
                payload,
                "randomPasswordRestString", {
                    expiresIn: 10000*60*60*20
                },
                // User.register(user,
                async (err, user) => {

                    if (err) throw err;

                    const msg={
                        from:'seunsanyaa@gmail.com',
                        to:email,
                        subject:'Privpay - Password Reset',
                        text:`
                         Please copy and paste the link below to reset your password.
                        http://${req.headers.host}/changepassword?token=${user}                                
                `,
                        html:`<h1>Hello,</h1> 
                                <p>Thanks for registering on privpay.</p>
                        <p> Please click the link below to reset your password.</p>
                      <a href="http://${req.headers.host}/changepassword?token=${user}"> Reset your password. </a>                                
                `


                    }

                    try {

                        // await sgMail.send(msg);
                        // req.session.user=req.body.user;
                        // return user.updateOne({ resetLink:token})
                        console.log('email sent', msg)
                        // req.session.user=req.body.user;
                        req.session.user=user
                        req.session.context= email
                        req.flash('success', 'Visit the link sent to yor email');
                        res.redirect('/forget')

                    }
                    catch (err) {
                        console.log(err.message);
                        req.flash('error', 'Something went wrong');
                        res.redirect('/forget')
                        // res.status(500).send("Error in Saving");
                    }









                });
        }}

        catch (err) {
            console.log(err.message);
            req.flash('error', 'User Already Exits');
            return res.redirect('/signup')
            // res.status(500).send("Error in Saving");
        }

    });


// verification code
// router.get('/verify', homeController.mailConfirm);
//
//
//
// router.post("/verify", (req, res) => {
//     const userCode = req.body.code;
//   const email = req.body.email;
//
//
//     console.log(`Code: ${userCode}`);
//     console.log(`Email: ${email}`);
//
//
// });

router.get('/dashboard', DashController.dashboard);

router.get('/exchange', DashController.dashExchange);

router.get('/wallet', DashController.dashWallet);

router.get('/settings', DashController.dashSettings);


router.get('*', homeController.error404);




// passport.use(new LocalStrategy(
//     function(email, password, done) {
//         User.getUserByUsername(email, function(err, user){
//             if(err) throw err;
//             if(!user){
//                 return done(null, false, {message: 'User does not exist!'});
//             }
//
//             User.comparePassword(password, user.password, function(err, isMatch){
//                 if(err) throw err;
//                 if(isMatch){
//                     return done(null, user);
//                 } else {
//                     return done(null, false, {message: 'Invalid password'});
//                 }
//             });
//         });
//     }));
//
// passport.serializeUser(function(user, done) {
//     done(null, user.id);
// });
//
// passport.deserializeUser(function(id, done) {
//     User.getUserById(id, function(err, user) {
//         done(err, user);
//     });
// });






module.exports = router;
