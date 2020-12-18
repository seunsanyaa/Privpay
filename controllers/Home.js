
function loggedIn(req, res, next) {
    if (req.user) {
        next();
    } else {
        res.redirect('/login');
    }
}

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




exports.mailConfirm=('/verify',loggedIn, async (req, res) => {
try {
    const user= req.user;
    if (!user){
        console.log('not found')
        req.flash('error','Something went wrong');

        return res.redirect('/signup')
    }
    user.emailToken=null;
    user.isVerified=true;
    await user.save();
    await req.login(user,async(err)=>{
        if (err) throw err;
        console.log('its working')
        req.flash('success',`welcome ${user.email}`);
        const redirectUrl=req.session.redirectTo || '/';
        delete req.session.redirectTo;
        res.redirect(redirectUrl)

    })
}

catch (err) {
    console.log(err.message);
    req.flash('error', 'Something went wrong');
    return res.redirect('/login')
    // res.status(500).send("Error in Saving");
}





});






