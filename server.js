
const express = require('express');
const mongoose = require('mongoose');

const bodyParser= require('body-parser');
const { body, validationResult } = require('express-validator');
const flash = require('connect-flash');
const port = 3000;


mongoose.connect(
    'mongodb+srv://Enemy:Jextobam05@privpay.ffr52.mongodb.net/privpay_users?retryWrites=true&w=majority'
)
    .then((result) => {
        console.log('Connected');
        app.listen(3000);
    })
    .catch((err) => {
        console.log(err);
    });

const app = express();

// set the view engine to ejs
app.set('view engine', 'ejs');
//

// // to use assets
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));


const homeRoutes = require('./routes/Home');
app.use(homeRoutes);

//


app.listen(port, () => {
    console.log(`Web App Running At http://localhost:${port}`)
})
