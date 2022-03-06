const express=require('express');
const bodyParser=require('body-parser');
var cookies = require("cookie-parser");
const ejs=require('ejs')
const dotenv=require('dotenv');
const db=require('./db');
const User_Router=require('./routes/user.route');
const Address_Router=require('./routes/address.route');

//Server Config
dotenv.config();
const port=process.env.HOST_PORT;
const app=express();
app.listen(port,()=>{console.log('The Server is listening on URL: http://localhost:'+port)});
app.use(express.json());
app.use(cookies());

//DB Config
db.config();

//Template Config
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.set("view engine","ejs"); 
app.use(express.static('public'));
app.use(express.static('Media'));

//Routes
app.use('/API/auth',User_Router);
app.use('/API/address',Address_Router);

//Route Pages
app.get('/',(req,res)=>{res.render('homePage',{title:'Home'})});
app.get('/loginPage',(req,res)=>{res.render('loginPage',{title:'Login'})});
app.get('/signupPage',(req,res)=>{res.render('signupPage',{title:'Signup'})});
app.get('/user_dashboard',(req,res)=>{res.redirect('/API/auth/user_info')});

