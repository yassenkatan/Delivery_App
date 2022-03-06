const mongoose=require('mongoose');

const UserSchema=new mongoose.Schema({

    fullname:{
        type:String,
        maxlength:20,
        minlength:3,
        required:true
    },
    email:{
        type:String,
        maxlength:50,
        minlength:3,
        required:true,
        unique:true
    },
    password:{
        type:String,
        maxlength:512,
        minlength:8,
        required:true
    },
    passwordConfirm:{
        type:String,
        maxlength:512,
        minlength:8,
        required:true
        },
    birthday:{
        type:Date.UTC()
    },
    country:{
        type:String
    },
    gender:{
        type:String
    },
    phoneNumber:{
        type:Number
    },
    photo:{
        type:String
    },
    CreatedAt:{
        type:Date
    },
    UpdatedAt:{
        type:Date
    },
    token:{
        type:String
        },
        CreatedAt:{
            type:Date,
            default:Date.now()
        }
});

const user=mongoose.model('users',UserSchema);
module.exports=user;