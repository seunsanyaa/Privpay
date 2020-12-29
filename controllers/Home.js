const jwt = require("jsonwebtoken");
const User = require("../models/User");
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

exports.verified=('/verified', async (req, res) => {

// console.log(req.query)
//     try {
//         const user=await User.findOne({emailToken:req.query.token});
//         if (!user){
//             console.log('not found')
//             req.flash('error','Token is invalid. Contact us for assistance')
//             return res.redirect('/signup')
//         }
//         else {
//         user.emailToken=null;
//         user.isVerified=true;
//         await user.save();
//         res.render('pages/verified')
//         // await req.login(user,async(err)=>{
//         //     if (err) throw err;
//         //     console.log('its working')
//         //     req.flash('success',`welcome ${user.email}`);
//         //     const redirectUrl=req.session.redirectTo || '/';
//         //     delete req.session.redirectTo;
//         //     res.redirect(redirectUrl)
//         //
//         // })
//     }}
//
//     catch (err) {
//         console.log(err.message);
//         req.flash('error', 'Something went wrong');
//         return res.redirect('/login')
//         // res.status(500).send("Error in Saving");
//     }

    if(!req.session.context)
    {

        return res.redirect('/')
    }
    else{
        res.render('pages/verified',{




            user: req.session.context,
            isVerified: true
        });

    }});

    // res.render('pages/verified');





exports.confirm=('/confirm', async (req, res) => {
if(!req.session.context)
{

    return res.redirect('/login')
}
else{
    res.render('pages/confirm',{




        user: req.session.context

    });

}});

exports.error404=('*', (req, res) => {

    res.render('pages/404');
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






