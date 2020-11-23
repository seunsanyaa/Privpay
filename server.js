const express = require('express');
const app = express();
const port = 3000

// set the view engine to ejs
app.set('view engine', 'ejs');

// to use assets
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render('pages/index');
});

app.get('/login', (req, res) => {
    res.render('pages/login');
});

app.get('/signup', (req, res) => {
    res.render('pages/signup');
});

app.get('/forget', (req, res) => {
    res.render('pages/forget');
});

app.get('/bvn', (req, res) => {
    res.render('pages/bvn');
});

app.get('/authcode', (req, res) => {
    res.render('pages/authcode');
});

app.get('/mailconfirm', (req, res) => {
    res.render('pages/mailconfirm');
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})