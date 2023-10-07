const quizcontroller=require('../../controllers/quizcontroller')
const router= require("express").Router();
const{checkToken}=require('../../auth/token_validation')


router.post('/create',quizcontroller.create)
router.post('/start',checkToken ,quizcontroller.start)
router.post('/finish',checkToken ,quizcontroller.finish)
router.get('/id/:id',checkToken ,quizcontroller.getone)
router.post('/my_grades',checkToken ,quizcontroller.my_grades)
router.delete('/:id',checkToken ,quizcontroller.deleteone)
router.get('/grades/:id',checkToken ,quizcontroller.allgrades)
router.put('/:id',checkToken ,quizcontroller.update)

module.exports=router