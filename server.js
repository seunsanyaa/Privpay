
const express = require('express');

const app = express();
const bodyParser= require('body-parser');
const port = 3000
const mongoConnect= require('./util/database');

mongoConnect()



// set the view engine to ejs
app.set('view engine', 'ejs');
//


// // to use assets
app.use(express.static('public'));
// app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
    res.json({ message: "API Working" });
});


const homeRoutes = require('./routes/Home');

app.use(homeRoutes)





app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);


})



