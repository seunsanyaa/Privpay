
const express = require('express');



const bodyParser= require('body-parser');


const expressValidator = require('express-validator');
// const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');
const axios= require('axios');
const mailchimpClient = require("@mailchimp/mailchimp_transactional")("Dr5f1iglJGGZUZQUHEDEdQ");
const accountSid = 'AC2d957174edc41c3319145d8a935aca04';
const authToken = 'c586aef6d9838bf26d9c453eba92b449';
const twilioClient = require("twilio")(accountSid, authToken);

global.crypto = require('crypto')
const port = 3000
const mongoConnect= require('./util/database');

mongoConnect()

const app = express();

// set the view engine to ejs
app.set('view engine', 'ejs');
//

// // to use assets
app.use(express.static('public'));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));





// Express Session Middleware
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 90000 }
}));


// Express Messages Middleware
app.use(flash());
app.use(function(req, res, next){
    res.locals.success_messages = req.flash('success_messages');
    res.locals.error_messages = req.flash('error_messages');
    next();
})


// Express Validator Middleware
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        let namespace = param.split('.')
            , root    = namespace.shift()
            , formParam = root;

        while(namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param : formParam,
            msg   : msg,
            value : value
        };
    }
}));

const homeRoutes = require('./routes/Home');
const dashRoutes = require('./routes/Dashboard');
app.use(homeRoutes);
app.use(dashRoutes);


twilioClient.verify
    .services("VA2a8112631ea0d0d5557d8b36a8e4b15a") //Put the Verification service SID here
    .verifications.create({to: "sonofwavy05@gmail.com", channel: "email"})
    .then(verification => {
        console.log(verification.sid);
    });





app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);


})



