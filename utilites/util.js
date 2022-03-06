const jwt=require('jsonwebtoken');
const dotenv=require('dotenv');
const User=require('../models/user.model');
dotenv.config();

//Date Now
const DateNow=function (){
    let Datenow=new Date(Date.now()).toLocaleString();
    return Datenow;
}
//Generate Token
const GenerateToken= async (id) =>{
    return jwt.sign({id},process.env.TOKEN_KEY,{expiresIn:process.env.EXPIRES_IN_KEY});
}
//Get Token SignedIn
const get_token_Email=async (req,data)=>{
    const token=req.cookies.Auth_token;
    const decoded=jwt.verify(token,process.env.TOKEN_KEY,{expiresIn:process.env.EXPIRES_IN_KEY});
        req.user_signedIn=decoded;
        if(req.user_signedIn=decoded)
        {
            let id=req.user_signedIn.id;
            let user=await User.findOne({_id:id})
            data=user.email;
        }
       return data;
}

const get_token_ID=(req,data)=>{
    let token=req.cookies.Auth_token;
    const decoded=jwt.verify(token,process.env.TOKEN_KEY,{expiresIn:process.env.EXPIRES_IN_KEY});
        req.user_signedIn=decoded;
        if(req.user_signedIn=decoded)
        {
            data=req.user_signedIn.id;
                   
        }
       return data;
}

module.exports={
    DateNow,
    GenerateToken,
    get_token_Email,
    get_token_ID
}