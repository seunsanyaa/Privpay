
const User = require("../models/User");

function requireLogin (req, res, next) {
    if (!req.user) {
        res.redirect('/login');
    } else {
        next();
    }
};

exports.homePage=('/', (req, res) => {
    res.render('pages/index');

});


exports.login=('/login', (req, res) => {
    res.render('pages/login');
});

exports.signUp=('/signup', (req, res) => {
    res.render('pages/signup',{message: req.flash('message')});
});

exports.forget=('/forget', (req, res) => {
    res.render('pages/forget');
});


exports.bvn=('/bank-verification', (req, res) => {

    res.render('pages/bvn');
});

exports.authCode=('/authenticate', (req, res) => {
    res.render('pages/authcode');
});




exports.mailConfirm=('/verify',requireLogin ,(req, res) => {
    if (req.session && req.session.user) { // Check if session exists
        // lookup the user in the DB by pulling their email from the session
        User.findOne({ email: req.session.user.email }, function (err, user) {
            if (!user) {
                // if the user isn't found in the DB, reset the session info and
                // redirect the user to the login page
                req.session.reset();
                res.redirect('/signup');
            } else {
                // expose the user to the template
                req.user = user;
                delete req.user.password; // delete the password from the session
                req.session.user = user;  //refresh the session value
                res.locals.user = user;


                // render the dashboard page
                res.render('pages/mailconfirm',
                    {
                        message: req.flash('message'),

                    });
            }
        });
    } else {
        res.redirect('/signup');
    }




});






