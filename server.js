var express = require('express');
var app = express();
var port = 3000

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

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})