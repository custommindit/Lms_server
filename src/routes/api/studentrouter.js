const studentcontroller=require('../../controllers/studentcontroller')
const router= require("express").Router();
const{checkToken}=require('../../auth/token_validation');
const verifyAdminSecret = require('../../auth/verifyAdminSecret.js');

router.post('/sign_up',studentcontroller.signup)
router.post('/login',studentcontroller.login)
router.get('/personal',checkToken,studentcontroller.getdata)
router.get('/list',checkToken,studentcontroller.getall)
router.get('/list/:level',checkToken,studentcontroller.get_by_level)
//router.post('/enroll',checkToken,studentcontroller.buy_unit)
router.post('/enroll',studentcontroller.buy_unit)
router.post('/unenroll',checkToken,studentcontroller.deleteunit)

router.post('/progress',checkToken,studentcontroller.add_progress)

router.post('/all_my_units',checkToken,studentcontroller.getmyunitdata)

router.post('/all_my_quizes',checkToken,studentcontroller.getmyquizdata)

router.post('/all_my_exams',checkToken,studentcontroller.getmyexamdata)
//get exams that 
router.post('/userexams',checkToken,studentcontroller.getmyexamdata_v2)
//usergrade
router.post('/getusergrades',checkToken,studentcontroller.getusergrades_v2)

router.patch('/myinfo',checkToken,studentcontroller.updateinfo)

router.patch('/updatepassword',checkToken,studentcontroller.updatepassword)
router.delete('/deleteme',checkToken,studentcontroller.deleteme)

router.delete('/clearsession/:email',verifyAdminSecret ,checkToken,studentcontroller.clear_session)

router.post('/enrollmany',verifyAdminSecret ,checkToken,studentcontroller.enroll_many_by_level)
router.post('/enrollall',verifyAdminSecret ,checkToken,studentcontroller.enroll_all)
router.post('/unenrollall',verifyAdminSecret ,checkToken,studentcontroller.deleteunit_all)

router.delete('/clearallsession',verifyAdminSecret ,checkToken,studentcontroller.clear_all_session)


router.post('/abd',checkToken,studentcontroller.abdullah)

router.get('/search/:query',checkToken,studentcontroller.getQuery)


router.post('/gauth',studentcontroller.gAuthed)

router.post('/gsign',studentcontroller.gsignup)

router.post('/all_my_quizes_new',checkToken,studentcontroller.getmyquizdatanew)

module.exports=router
