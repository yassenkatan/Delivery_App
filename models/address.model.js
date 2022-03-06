const mongoose=require('mongoose');

const AddressSchema=new mongoose.Schema({

    name:{
        type:String,
        required:true,
        maxlength:20,
        minlength:2
    },
    city:{
        type:String,
        required:true,
        maxlength:20,
        minlength:2,
    },
    street:{
        type:String,
        maxlength:100,
        minlength:2,
        required:true
    },
    locationDetails:{
        type:String,
        maxlength:512,
        minlength:8,
        required:true
        },
        User:{
            type:[mongoose.Schema.Types.ObjectId],
            ref:'user'
        },
        CreatedAt:{
            type:Date
        },
        UpdatedAt:{
            type:Date
        }
});

const address=mongoose.model('address',AddressSchema);
module.exports=address;