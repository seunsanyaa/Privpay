
const User = require("../models/User");

exports.homePage=('/', (req, res) => {
    res.render('pages/index');

});


exports.login=('/login', (req, res) => {
    res.render('pages/login');
});

exports.signUp=('/signup', (req, res) => {
    res.render('pages/signup',);
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

exports.verified=('/verified', (req, res) => {
    res.render('pages/verified');
});

exports.error404=('*', (req, res) => {
    res.render('pages/404');
});




exports.mailConfirm=('/verify', async (req, res) => {
try {
    const user=await User.findOne({emailToken:req.query.token});
    if (!user){
        req.flash('error','Something went wrong');
        return res.redirect('/login')
    }
    user.emailToken=null;
    user.isVerified=true;
    await user.save();
    await req.login(user,async(err)=>{
        if (err) throw err;
        req.flash('success',`welcome ${user.email}`);
        const redirectUrl=req.session.redirectTo || '/';
        delete req.session.redirectTo;
        res.redirect(redirectUrl)
        res.render('pages/mailconfirm',
        );
    })
}

catch (err) {
    console.log(err.message);
    req.flash('error', 'Something went wrong');
    return res.redirect('/')
    // res.status(500).send("Error in Saving");
}





});






