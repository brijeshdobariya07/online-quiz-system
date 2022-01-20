const mongoose = require('mongoose');
const validator = require('validator');

const UserSchema = new mongoose.Schema({
    name:{
        type:'String',
        required:true,
        minlength:3
    },
    email:{
        type:'String',
        required:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid Email Id")
            }
        }
    },
    password:{
        type:String,
        required:true,
        min:4
    },
    date:{
        type:Date,
        default:Date.now
    }
    
})

const User = mongoose.model('User',UserSchema);

module.exports = User;