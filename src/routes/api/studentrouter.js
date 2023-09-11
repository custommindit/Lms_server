const studentcontroller=require('../../controllers/studentcontroller')
const router= require("express").Router();
const{checkToken}=require('../../auth/token_validation')

router.post('/sign_up',studentcontroller.signup)
router.post('/login',studentcontroller.login)
router.get('/personal',checkToken,studentcontroller.getdata)

module.exports=router