const adminpostcontroller=require('../../controllers/adminpostcontroller')
const router= require("express").Router();

const{checkToken}=require('../../auth/token_validation')

router.post('/create',checkToken,adminpostcontroller.create)

router.get('/',adminpostcontroller.all)

router.delete('/deleteone/:id',checkToken,adminpostcontroller.deleteone)

module.exports=router