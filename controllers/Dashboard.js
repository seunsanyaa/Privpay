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
    res.render('dashboard/crypto-index');
});

exports.dashExchange=('/exchange', (req, res) => {
    res.render('dashboard/crypto-exchange');
});

exports.dashWallet=('/wallet', (req, res) => {
    res.render('dashboard/crypto-wallet');
});

exports.dashSettings=('/settings', (req, res) => {
    res.render('dashboard/crypto-settings');
});