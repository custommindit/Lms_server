const sectioncontroller=require('../../controllers/sectioncontroller')
const router= require("express").Router();

router.post('/create',sectioncontroller.create)


module.exports=router