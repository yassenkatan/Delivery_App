const express=require('express');
const Address_Controller=require('../controllers/address.controller');
const User_Controller=require('../controllers/user.controller');
const router=express.Router();

//Add New Address
router.post('/add_address',User_Controller.auth,Address_Controller.add_address);

//Get All Addresses By User
router.get('/all_addresses',User_Controller.auth,Address_Controller.get_all_addresses);

//Delete Address
router.post('/del_address',User_Controller.auth,Address_Controller.del_address);

module.exports=router;