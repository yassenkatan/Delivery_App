const express=require('express');
const bcrypt=require('bcryptjs');
const fs=require('fs');
const alert=require('alert');
const util=require('../utilites/util');
const User=require('../models/user.model');
const Audit_Action=require('../Audit/auditAction');
const Audit_Controller=require('../Audit/audit.controller');
const Logger=require('../loggers/logger.controller');
const logger=new Logger('user');

//Signup
const signup=async (req,res)=>{
    try {

        let user=await new User({
            fullname:req.body.fullname,
            email:req.body.email,
            password:req.body.password,
            passwordConfirm:req.body.passwordConfirm
        });
        
        //Check if User exist
        let userExist=await User.find({email:user.email});
        if(userExist!=null){
            logger.error('Signup : ',`User is exist | IP : ${req.socket.remoteAddress}`);
            alert('User Exist , Please Login ..')
            res.render('loginPage',{title:'Login'});
        }
        else{
            //Check password is same confirm password
            if(user.password==user.passwordConfirm){

                //Encrypt Password
                const salt= bcrypt.getSalt(10,function(){})
                let passwordEncrypted=await bcrypt.hash(user.password,salt);
                let passwordConfirmEncrypted=await bcrypt.hash(user.passwordConfirm,salt);

                //New User
                let new_user=await new User({
                    fullname:user.fullname,
                    email:user.email.toLowerCase(),
                    password:passwordEncrypted,
                    passwordConfirm:passwordConfirmEncrypted,
                    CreatedAt:util.DateNow()
                });

                const token=(await util.GenerateToken(new_user._id)).toString();
                new_user.token=token;
                new_user.save();
                Audit_Controller.prepareAudit(Audit_Action.auditAction.SIGNUP,fullname,200,null,email,req.socket.remoteAddress,util.DateNow());
                logger.info('Signup : ',`${email} New User | IP: ${req.socket.remoteAddress}`)
                alert(`Welcome ${user.fullname}, Please Login ...`)
                res.status(200).render('loginPage',{title:'Login'})
            }
            else if(password!=passwordConfirm){
                logger.error('Signup : ',`Password not confirmed | IP : ${req.socket.remoteAddress}`);
                alert('Password not confirmed ...');
            }
        }
    } catch (err) {
        Audit_Controller.prepareAudit(Audit_Action.auditAction.SIGNUP,null,404,err.message,req.socket.remoteAddress,util.DateNow());
        logger.error('Signup : ',`Error MSG : ${err.message} | IP : ${req.socket.remoteAddress}`);
        res.status(404).send(`Error MSG : ${err.message}`)
    }
}

//Login
const login=async(req,res)=>{
    try {
        let email=req.body.email;
        let password=req.body.password;
        let user_signedIn=await User.findOne({
            email:email
        });
        if(user_signedIn!=null&&user_signedIn.email==email)
        {
            let passwordEncrypted=user_signedIn.password;
            //Decrypte Password
            const passwordDecrypted=await bcrypt.compare(password,passwordEncrypted);
            if(passwordDecrypted==true)
            {
                //Check if user true
                const token=await util.GenerateToken(user_signedIn.id);
                Audit_Controller.prepareAudit(Audit_Action.auditAction.LOGIN,email,200,null,email,req.socket.remoteAddress,util.DateNow());  
                logger.info('Login : ',`Login ${email} | IP: ${req.socket.remoteAddress}`)
                res.cookie('Auth_token',token).status(200).redirect('/user_dashboard')
            }
            else{
                logger.error('Login : ',`Invalid Username or Password | IP : ${req.socket.remoteAddress}`);
                alert("Invalid Username or Password ...")

            }
        }
        else{
            logger.error('Login : ',`Invalid Username or Password | IP : ${req.socket.remoteAddress}`);
            alert("Invalid Username or Password ...")
        }
    } catch (err) {
        Audit_Controller.prepareAudit(Audit_Action.auditAction.LOGIN,null,404,err.message,req.socket.remoteAddress,util.DateNow());
        logger.error('Login : ',`Error MSG : ${err.message} | IP : ${req.socket.remoteAddress}`);
        res.status(404).send(`Error MSG : ${err.message}`)
    }
}

//Signout
const logout=async(req,res)=>{
    try {
        res.clearCookie('Auth_token')
        res.status(200).redirect('/');
    } catch (err) {
        logger.error('Logout : ',`Error MSG : ${err.message} | IP : ${req.socket.remoteAddress}`);
        res.status(404).send(`Error MSG : ${err.message}`)
    }
}
//Get User info
const get_user_info=async(req,res)=>{
    //Verify Token
    const Token_Email=await util.get_token_Email(req);
    try {
        let user_sel=await User.find({email:Token_Email})
        let fullname=[];
        user_sel.forEach(user=>{
            fullname=user.fullname;
        });
        res.status(200).render('user_dashboard',{title:`${fullname}`,userInfo:user_sel});
    } catch (err) {
        res.status(404).send(`Err MSG : ${err.message}`);
    }
}

//Update User
const Upd_USR=async (req,res)=>{
    //Verify Token
    const Token_Email=await util.get_token_Email(req);
    try {
        
        let fullname=req.body.fullname;
        let country=req.body.country;
        let gender=req.body.gender;
        let birthday=req.body.birthday;
        let phoneNumber=req.body.phoneNumber;
        let UpdatedAt=util.DateNow();
        let user=await User.findOneAndUpdate({email:Token_Email},{$set:{
            fullname:fullname.toUpperCase(),
            birthday:birthday,
            country:country,
            gender:gender,
            phoneNumber:phoneNumber,
            photo:req.file.path,
            UpdatedAt:UpdatedAt
        }});
        Audit_Controller.prepareAudit(Audit_Action.auditAction.Upd_USR,fullname,200,null,Token_Email,req.socket.remoteAddress,util.DateNow());
        logger.info('Update User : ',`${fullname} Updated | IP: ${req.socket.remoteAddress}`)
        let newUser= await User.findOne({email:Token_Email})
        alert(`${Token_Email} is updated successfully ...`);
        res.status(200).redirect('/user_dashboard')
        /*{
                data:fs.readFileSync('Media/Users/'+req.file.filename),
                contentType:'image/png'
            } */
    } catch (err) {
        Audit_Controller.prepareAudit(Audit_Action.auditAction.Upd_USR,null,404,err.message,Token_Email,req.socket.remoteAddress,util.DateNow());
        logger.error('Update User : ',`Error MSG : ${err.message} | IP : ${req.socket.remoteAddress}`);
        res.status(404).send(`Err MSG : ${err.message}`);
    }
}

const auth=async(req,res,next)=>{
    const token=req.cookies.Auth_token;
    if(!token)
    {
        alert("Access Rejected ...")
        logger.error('Authentication : ',`Access Rejected | IP : ${req.socket.remoteAddress}`);
        Audit_Controller.prepareAudit(Audit_Action.auditAction.AUTHENTICATION,null,401,'Access Rejected',null,req.socket.remoteAddress,util.DateNow());
        
    }
    try {
        const Token_ID=await util.get_token_ID(req);
        if(Token_ID)
        {
            next();
        }
        else{
            alert("You Don`t Have Permession ...")
            Audit_Controller.prepareAudit(Audit_Action.auditAction.AUTHENTICATION,null,401,'You Don`t Have Permession',Token_ID,req.socket.remoteAddress,util.DateNow());
            logger.error('Authentication : ',`You Don't Have Permession | IP : ${req.socket.remoteAddress}`);
        }
    } catch (err) {
        logger.error('Authentication : ',`Error MSG : ${err.message} | IP : ${req.socket.remoteAddress}`);
        Audit_Controller.prepareAudit(Audit_Action.auditAction.AUTHENTICATION,null,401,err.message,null,req.socket.remoteAddress,util.DateNow());
        res.status(404).send(`Err MSG : ${err.message}`);
        
    }
}
module.exports={
    signup,
    login,
    logout,
    get_user_info,
    Upd_USR,
    auth
}