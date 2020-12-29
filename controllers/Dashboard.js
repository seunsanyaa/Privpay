exports.dashboard=('/dashboard', async (req, res) => {
    if(!req.session.context)
    {

        return res.redirect('/login')
    }
    else{
        res.render('dashboard/crypto-index',{




            user: req.session.context
        });

    }});