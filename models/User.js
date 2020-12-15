const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new  Schema({
    email:{
        type: String,
        required:true
    },

    name:{
        type: String,
        required:true
    },


    isVerified:{
        type:Boolean
    },

    password:{
        type: String,
        required:true
    }

},    {timestamp:true});



const User=mongoose.model('user',userSchema);
module.exports=User;