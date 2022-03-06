const events=require('events');
const Audit=require('./audit.model');
const emitter=new events.EventEmitter();
const auditEvent='audit';
emitter.on(auditEvent,function(audit){
    let newAudit=new Audit({
        auditAction:audit.auditAction,
        data:audit.data,
        status:audit.status,
        error:audit.error,
        auditBy:audit.auditBy,
        auditIP:audit.auditIP,
        auditOn:audit.auditOn
    });
    newAudit.save();
});
const prepareAudit= (auditAction,data,status,error,auditBy,auditIP,auditOn)=>{
     status=200;
    if(error){status=500;}
    let auditObj= {auditAction,data,status,error,auditBy,auditIP,auditOn};
    emitter.emit(auditEvent,auditObj)
};
module.exports={prepareAudit};