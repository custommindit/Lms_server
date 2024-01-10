const adminpostcontroller=require('../../controllers/adminpostcontroller')
const router= require("express").Router();

const{checkToken}=require('../../auth/token_validation');
const verifyAdminSecret = require('../../auth/verifyAdminSecret.js');

router.post('/create',verifyAdminSecret,checkToken,adminpostcontroller.create)

router.get('/',adminpostcontroller.all)

router.delete('/deleteone/:id',verifyAdminSecret,checkToken,adminpostcontroller.deleteone)

module.exports=router