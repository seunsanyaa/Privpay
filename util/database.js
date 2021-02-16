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

// const mongoose = require("mongoose");
// const MONGOURI = "mongodb+srv://Enemy:nRDtaPio9RnntdUj@privpay.ffr52.mongodb.net/Privpay?retryWrites=true&w=majority";
//
// const mongoConnect = async () => {
//     try {
//         await mongoose.connect(MONGOURI, {
//             useNewUrlParser: true
//         });
//         console.log("Connected to DB !!");
//     } catch (e) {
//         console.log(e);
//         throw e;
//     }
// };
//
// module.exports = mongoConnect();