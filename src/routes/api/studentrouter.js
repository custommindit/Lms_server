const studentcontroller=require('../../controllers/studentcontroller')
const router= require("express").Router();
const{checkToken}=require('../../auth/token_validation')

router.post('/sign_up',studentcontroller.signup)
router.post('/login',studentcontroller.login)
router.get('/personal',checkToken,studentcontroller.getdata)
router.get('/list',checkToken,studentcontroller.getall)
router.get('/list/:level',checkToken,studentcontroller.get_by_level)
router.post('/enroll',checkToken,studentcontroller.buy_unit)
router.post('/unenroll',checkToken,studentcontroller.deleteunit)

router.post('/progress',checkToken,studentcontroller.add_progress)

router.post('/all_my_units',checkToken,studentcontroller.getmyunitdata)

router.post('/all_my_quizes',checkToken,studentcontroller.getmyquizdata)

router.post('/all_my_exams',checkToken,studentcontroller.getmyexamdata)

router.patch('/myinfo',checkToken,studentcontroller.updateinfo)

router.patch('/updatepassword',checkToken,studentcontroller.updatepassword)
router.delete('/deleteme',checkToken,studentcontroller.deleteme)

router.delete('/clearsession/:email',checkToken,studentcontroller.clear_session)

module.exports=router