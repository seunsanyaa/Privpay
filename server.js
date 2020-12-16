
const express = require('express');



const bodyParser= require('body-parser');


const expressValidator = require('express-validator');
// const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');
const axios= require('axios');
const accountSid = 'AC2d957174edc41c3319145d8a935aca04';
const authToken = 'c586aef6d9838bf26d9c453eba92b449';
const twilioClient = require("twilio")(accountSid, authToken);

global.crypto = require('crypto')

const mongoConnect= require('./util/database');

mongoConnect()




const two_hours = 1000*60*60*2;


const {
    port = 3000,
    NODE_ENV= 'development',
    SESS_NAME= 'sid',
    SESS_SECRET='keyboard cat',
    SESS_LIFETIME= two_hours
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








app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);


})



