const mongodb= require('mongodb');
const mongoose = require("mongoose");
const MongoClient = mongodb.MongoClient;

function mongoConnect(){


mongoose.connect(process.env.MONGODB_URI )
    .then(client => {
        console.log('Connected!');


    }).catch(err => {
        console.log(err);
});
};

module.exports=mongoConnect;

