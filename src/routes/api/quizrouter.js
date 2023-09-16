const quizcontroller=require('../../controllers/quizcontroller')
const router= require("express").Router();
const{checkToken}=require('../../auth/token_validation')


router.post('/create',quizcontroller.create)

router.post('/start',checkToken ,quizcontroller.start)
router.post('/finish',checkToken ,quizcontroller.finish)


module.exports=router