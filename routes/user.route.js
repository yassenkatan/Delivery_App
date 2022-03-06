const express=require('express');
const User_Controller=require('../controllers/user.controller');
const router=express.Router();
const multer=require('multer');


//Media Uploader
let DateNow=new Date(Date.now());
let storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'Media/Users')
    },
    filename:(req,file,cb)=>{
        cb(null,file.fieldname+ '-' +DateNow.toDateString())
    }
});
let upload=multer({storage:storage});

//Signup
router.post('/signup',User_Controller.signup);

//Login
router.post('/login',User_Controller.login);

//Signout
router.get('/logout',User_Controller.logout);

//Get_User_Info
router.get('/user_info',User_Controller.get_user_info);

//Update User
router.post('/upd_usr',User_Controller.auth,upload.single('User'),User_Controller.Upd_USR);

module.exports=router;