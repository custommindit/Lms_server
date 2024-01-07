const admincontroller=require('../../controllers/admincontroller')
const router= require("express").Router();
const{checkToken}=require('../../auth/token_validation')

// router.post('/create',admincontroller.signup)
router.post('/login',admincontroller.login)



module.exports=router