const quizcontroller=require('../../controllers/quizcontroller')
const router= require("express").Router();

router.post('/create',quizcontroller.create)


module.exports=router