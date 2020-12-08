const path = require('path');
const express = require('express');
const bcrypt=require('bcrypt');
const homeController = require('../controllers/Home');
const User=require('../models/User');
const passport = require('passport');
const { body, validationResult } = require('express-validator');

//for sessions in the dashboard
// const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.use(express.json)



router.get('/', homeController.homePage);

router.get('/login', homeController.login);

// router.post('/signup',[
//     // username must be an email
//     body('email').isEmail(),
//     // password must be at least 5 chars long
//     ,body('name').notEmpty(),body('password').isLength({ min: 5 })
// ] ,(req, res) => {
//
//
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         return res.status(400).json({errors: errors.array()});
//     }
//
//     User.create({
//         username: req.body.username,
//         password: req.body.password
//     }).then(user => res.json(user));
//
// });








//         bcrypt.genSalt(10, function(err, salt){
//             bcrypt.hash(newUser.password, salt, function(err, hash){
//                 if(err){
//                     console.log(err);
//                 }
//                 User.password = hash;
//                 User.save(function(err){
//                     if(err){
//                         console.log(err);
//                         return;
//                     } else {
//                         req.flash('success');
//                         res.redirect('/Verify');
//                     }
//                 });
//             });
//         });
//     }
// });






router.get('/signup', homeController.signUp);


router.get('/Bank-Verification', homeController.bvn);

router.get('/Authenticate', homeController.authCode);


router.get('/verify', homeController.mailConfirm);
router.get('/Page-Not-Found', homeController.get404)

router.get('/forget', homeController.forget);




module.exports = router;


//     const email = req.body.email;
//     const name = req.body.name;
//     const password = req.body.password;
//
//
//     req.checkBody('email', 'Email is required').notEmpty();
//     req.checkBody('email', 'Email is not valid').isEmail();
//     req.checkBody('name', 'Name is required').notEmpty();
//
//     req.checkBody('password', 'Password is required').notEmpty();
//
//
//     let errors = req.validationErrors();
//
//     if(errors){
//         res.render('signup', {
//             errors:errors
//         });
//     } else {
//         let newUser = new User({
//             name:name,
//             email:email,
//
//             password:password
// });