// exports.dashboard=('/dashboard', async (req, res) => {
//     if(!req.session.context)
//     {
//         return res.redirect('/login')
//     }
//     else{
//         res.render('dashboard/crypto-index',{
//             user: req.session.context
//     });
// }});


exports.dashboard=('/dashboard', (req, res) => {


    if(!req.session.user)
    {

        return res.redirect('/');

    }
    else{
        res.render('dashboard/crypto-index',{




            user: req.session.user
        });

    }



});

exports.dashExchange=('/exchange', (req, res) => {
    if(!req.user)
    {

        return res.redirect('/')
    }
    else{
        res.render('dashboard/crypto-exchange',{




            user: req.user
        });

    }
    //
    // res.render('dashboard/crypto-exchange');
});

exports.dashWallet=('/wallet', (req, res) => {
    if(!req.user)
    {

        return res.redirect('/')
    }
    else{
        res.render('dashboard/crypto-wallet',{




            user: req.user
        });

    }
    // res.render('dashboard/crypto-wallet');
});

exports.dashSettings=('/settings', (req, res) => {

    if(!req.user)
    {

        return res.redirect('/')
    }
    else{
        res.render('dashboard/crypto-settings',{




            user: req.user
        });

    }
    // res.render('dashboard/crypto-settings');
});