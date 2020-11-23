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


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})