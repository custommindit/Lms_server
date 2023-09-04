const studentcontroller=require('../../controllers/studentcontroller')
const router= require("express").Router();

router.post('/sign_up',studentcontroller.signup)
router.post('/login',studentcontroller.login)

module.exports=router