const mongodb= require('mongodb');
const mongoose = require("mongoose");
const MongoClient = mongodb.MongoClient;
// process.env.MONGODB_URI ='mongodb+srv://Enemy:xpNvrwRkdkF1tz5n@privpay.ffr52.mongodb.net/privpay_users?retryWrites=true&w=majority'
function mongoConnect(){

    mongoose.connect(process.env.MONGODB_URI )
    .then(client => {
        console.log('Connected!');


    }).catch(err => {
        console.log(err);
});
};

module.exports=mongoConnect;

