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

    emailToken:{
        type:String
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



const User=mongoose.model('user',userSchema);
module.exports=User;