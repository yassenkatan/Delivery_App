const mongoose=require('mongoose');
const dotenv=require('dotenv');
dotenv.config();

const db_url=process.env.DB_URL || "mongodb://127.0.0.1:27017";
const db_name=process.env.DB_NAME;
const config=async()=>{
   return await mongoose.connect(db_url,{dbName:db_name,useNewUrlParser:true})
    .then(()=>{console.log("DB is Connected ...")})
    .catch(err=>console.log(`DB Error : ${err.message}`))
}

module.exports={
    config
}