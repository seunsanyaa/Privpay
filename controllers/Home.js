


exports.homePage=('/', (req, res,next) => {
    res.render('pages/index');
});


exports.login=('/login', (req, res,next) => {
    res.render('pages/login');
});

exports.signUp=('/signup', (req, res,next) => {
    res.render('pages/signup');
});

exports.forget=('/forget', (req, res,next) => {
    res.render('pages/forget');
});

exports.bvn=('/Bank-Verification', (req, res, next) => {
    res.render('pages/bvn');
});

exports.authCode=('/authenticate', (req, res,next) => {
    res.render('pages/authcode');
});

exports.mailConfirm=('/Verify', (req, res,next) => {
    res.render('pages/mailconfirm');
});

exports.get404 = ('/Page-Not-Found',(req, res) => {
    res.status(404).render('pages/404');
});

