
const express = require('express');



const bodyParser= require('body-parser');
const bitcoin = require("bitcoinjs-lib");

const expressValidator = require('express-validator');
// const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require("passport");
// const LocalStrategy  = require("passport-local").Strategy;
require("./config/passport")(passport);
require('dotenv').config();
const flash = require('connect-flash');
const axios= require('axios');
const sgMail = require('@sendgrid/mail');
// sgMail.setApiKey('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');
sgMail.setApiKey(process.env.SG_MAIL);

const accountSid = 'AC2d957174edc41c3319145d8a935aca04';
const authToken = 'c586aef6d9838bf26d9c453eba92b449';
const twilioClient = require("twilio")(accountSid, authToken);
const expressSanitizer = require('express-sanitizer');
global.crypto = require('crypto')
const User = require("./models/User");
const BTC = require("./models/User");

const bcrypt = require("bcryptjs");
const mongoConnect= require('./util/database');

mongoConnect()





port = process.env.PORT || 3000;

const {

    NODE_ENV= 'development',
    SESS_NAME= 'sid',
    SESS_SECRET='keyboard cat',
    SESS_LIFETIME= 1000*60*60*24
}=process.env

const IN_PROD = NODE_ENV === 'production'


const app = express();

// set the view engine to ejs
app.set('view engine', 'ejs');
//

// // to use assets
app.use(express.static('public'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(expressSanitizer());

// Express Session Middleware
app.use(session({
    name:SESS_NAME,
    secret: SESS_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: SESS_LIFETIME,
        sameSite: true,
        secure :IN_PROD

    }

}));


app.use(passport.initialize());
app.use(passport.session());

// Express Messages Middleware
app.use(flash());
app.use(function(req, res, next){
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");

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








app.listen(port, () => {
    console.log(`Web app listening at http://localhost:${port}`);


})



