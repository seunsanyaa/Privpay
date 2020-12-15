


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




exports.mailConfirm=('/verify', (req, res) => {
    res.render('pages/mailconfirm',
        {
            message: req.flash('message'),

        });
});






