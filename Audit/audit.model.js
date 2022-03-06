const mongoose=require('mongoose');
const dotenv=require('dotenv');
dotenv.config();

const schema=mongoose.Schema;
const AuditSchema=new schema({
    auditAction:{
        type:String
    },
    data:{
        type:Object
    },
    status:{
        type:String
    },
    error:{
        type:Object
    },
    auditBy:{
        type:String
    },
    auditIP:{
        type:Object
    },
    auditOn:{
        type:Date
    }
});

const audit=mongoose.model('audit',AuditSchema);
module.exports=audit;