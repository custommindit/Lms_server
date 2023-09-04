const studentcontroller=require('../../controllers/studentcontroller')
const router= require("express").Router();

router.post('/sign_up',studentcontroller.signup)

module.exports=router