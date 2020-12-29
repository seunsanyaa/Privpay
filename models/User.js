const mongoose = require('mongoose');
const Schema = mongoose.Schema

const passportLocalMongoose = require('passport-local-mongoose');


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
    },
    resetLink:{
        data:String,
        default:''
    }

},    {timestamp:true});


userSchema.plugin(passportLocalMongoose)
const User=mongoose.model('user',userSchema);
module.exports=User;