const examcontroller=require('../../controllers/examcontroller')
const router= require("express").Router();
const{checkToken}=require('../../auth/token_validation')

router.post('/create',examcontroller.create)
router.get('/',examcontroller.getall)
router.get('/mylevel',checkToken,examcontroller.by_my_level)
router.get('/level/:level',examcontroller.by_level)

router.post('/finish',checkToken ,examcontroller.finish)
router.delete('/:id',checkToken ,examcontroller.deleteone)

router.get('/grades/:id',checkToken,examcontroller.allgrades)

router.put('/:id',checkToken ,examcontroller.update_exam)

module.exports=router