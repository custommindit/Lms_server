const studentcontroller=require('../../controllers/studentcontroller')
const router= require("express").Router();
const{checkToken}=require('../../auth/token_validation')

router.post('/sign_up',studentcontroller.signup)
router.post('/login',studentcontroller.login)
router.get('/personal',checkToken,studentcontroller.getdata)
router.get('/list',checkToken,studentcontroller.getall)
router.get('/enroll',checkToken,studentcontroller.buy_unit)

module.exports=router