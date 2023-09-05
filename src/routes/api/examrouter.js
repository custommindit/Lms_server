const examcontroller=require('../../controllers/examcontroller')
const router= require("express").Router();

router.post('/create',examcontroller.create)


module.exports=router