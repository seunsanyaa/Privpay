const mongoose = require('mongoose');
// const uniqueValidator=require('mongoose-unique-validator');
const Schema = mongoose.Schema

const userSchema = new  Schema({
    email:{
        type: String,
        required:true,
        unique:true
    },

    name:{
        type: String,
        required:true
    },

    password:{
        type: String,
        required:true
    }

},    {timestamp:true});

// userSchema.plugin(uniqueValidator);

const User=mongoose.model('User',userSchema);
module.exports=User;