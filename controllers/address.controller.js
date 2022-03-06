const alert=require('alert');
const util=require('../utilites/util');
const Address=require('../models/address.model');
const User=require('../models/user.model');
const Audit_Action=require('../Audit/auditAction');
const Audit_Controller=require('../Audit/audit.controller');
const Logger=require('../loggers/logger.controller');
const logger=new Logger('address');

//Add New Address
const add_address=async (req,res)=>{
    //Verify Token
    const Token_ID=await util.get_token_ID(req);
    const Token_Email=await util.get_token_Email(req);
try {
        //Add Address Details
        let user=await User.findOne({id:Token_ID})
        let name=req.body.name;
        let city=req.body.city;
        let street=req.body.street;
        let locationDetails=req.body.locationDetails;
        let address=await new Address({
            name:name,
            city:city,
            street:street,
            locationDetails:locationDetails,
            User:Token_ID,
            CreatedAt:util.DateNow()
        });
        address.save();
        Audit_Controller.prepareAudit(Audit_Action.auditAction.ADD_ADDRESS,address,200,null,Token_Email,req.socket.remoteAddress,util.DateNow());
        logger.error('Add Address : ',`${address} New Added | IP : ${req.socket.remoteAddress}`);
        alert(`New Address Added Successfully`);
        res.status(200).redirect('/API/address/all_addresses')
    } catch (err) {
        Audit_Controller.prepareAudit(Audit_Action.auditAction.ADD_ADDRESS,null,404,err.message,Token_Email,req.socket.remoteAddress,util.DateNow());
        logger.error('Add Address : ',`Error MSG : ${err.message} | IP : ${req.socket.remoteAddress}`);
        res.status(404).send(`Error MSG : ${err.message}`);
        }
}

//Get Address By User
const get_all_addresses=async(req,res)=>{

    //Verify Token
    const Token_ID=await util.get_token_ID(req);
    const Token_Email=await util.get_token_Email(req);
    try {
        //Get Address Details
        let user=await User.findOne({email:Token_Email})
        let all_addresses=await Address.find({User:Token_ID});
        if(all_addresses!=null&&user!=null){

            Audit_Controller.prepareAudit(Audit_Action.auditAction.ALL_ADDRESSES,all_addresses,200,null,Token_Email,req.socket.remoteAddress,util.DateNow());
            logger.info('All Addresses : ',`Get All Addresses for ${Token_Email} | IP : ${req.socket.remoteAddress}`);
            res.status(200).render('all_address',{title:user.fullname,all_addresses:all_addresses,user:user});

        }
        else if(all_addresses==null&&user!=null)
        {
            logger.error('All Addresses : ',`${Token_Email} Don't have any address | IP : ${req.socket.remoteAddress}`);
            alert(`${user.fullname} don't have any address`);
            res.status(200).redirect('/user_dashboard');
        }
        else{
            logger.error('All Addresses : ',`Don't found any address | IP : ${req.socket.remoteAddress}`);
            alert('Don`t found any address ...');
            res.status(200).render('loginPage',{title:'Login'});
        }
    } catch (err) {
        Audit_Controller.prepareAudit(Audit_Action.auditAction.ALL_ADDRESSES,null,404,err.message,Token_Email,req.socket.remoteAddress,util.DateNow());
        logger.error('All Addresses : ',`Error MSG : ${err.message} | IP : ${req.socket.remoteAddress}`);
        res.status(404).send(`Error MSG : ${err.message}`);
    }
}

//Delete Address By User
const del_address=async(req,res)=>{
    //Verify Token
    const Token_ID=await util.get_token_ID(req);
    const Token_Email=await util.get_token_Email(req);
    try {
        //Delete Address
        let id=req.body.id;
        await Address.findOneAndDelete({id:id});
        Audit_Controller.prepareAudit(Audit_Action.auditAction.DEL_ADDRESS,id,200,null,Token_Email,req.socket.remoteAddress,util.DateNow());
        logger.info('Delete Address : ',`${Token_Email} Delete Address  | IP : ${req.socket.remoteAddress}`);
        res.status(200).redirect('/API/address/all_addresses');
    
    } catch (err) {
        Audit_Controller.prepareAudit(Audit_Action.auditAction.DEL_ADDRESS,null,404,err.message,Token_Email,req.socket.remoteAddress,util.DateNow());
        logger.error('Delete Address : ',`Error MSG : ${err.message} | IP : ${req.socket.remoteAddress}`);
        res.status(404).send(`Error MSG : ${err.message}`);
    }
}

module.exports={
    add_address,
    get_all_addresses,
    del_address
}
