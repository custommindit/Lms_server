const examcontroller=require('../../controllers/examcontroller')
const router= require("express").Router();
const{checkToken}=require('../../auth/token_validation');
const verifyAdminSecret = require('../../auth/verifyAdminSecret.js');

router.post('/create',verifyAdminSecret,examcontroller.create)
router.get('/',examcontroller.getall)
router.get('/mylevel',checkToken,examcontroller.by_my_level)
router.get('/level/:level',examcontroller.by_level)

router.post('/finish',checkToken ,examcontroller.finish)
router.delete('/:id',verifyAdminSecret,checkToken ,examcontroller.deleteone)
router.get('/getexam/:examId',checkToken ,examcontroller.getOneExam)

router.get('/grades/:id',checkToken,examcontroller.allgrades)
router.put('/:id',verifyAdminSecret,checkToken ,examcontroller.update_exam)
router.patch('/:id',verifyAdminSecret,checkToken ,examcontroller.update_exam_showgrade)


module.exports=router