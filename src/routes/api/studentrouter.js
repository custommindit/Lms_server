const studentcontroller=require('../../controllers/studentcontroller')
const router= require("express").Router();
const{checkToken}=require('../../auth/token_validation')

router.post('/sign_up',studentcontroller.signup)
router.post('/login',studentcontroller.login)
router.get('/personal',checkToken,studentcontroller.getdata)
router.get('/list',checkToken,studentcontroller.getall)
router.post('/enroll',checkToken,studentcontroller.buy_unit)
router.post('/unenroll',checkToken,studentcontroller.deleteunit)

router.post('/progress',checkToken,studentcontroller.add_progress)

router.post('/progress',checkToken,studentcontroller.add_progress)

module.exports=router