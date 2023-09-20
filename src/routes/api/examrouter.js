const examcontroller=require('../../controllers/examcontroller')
const router= require("express").Router();

router.post('/create',examcontroller.create)
router.get('/',examcontroller.getall)


module.exports=router