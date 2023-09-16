const sectioncontroller=require('../../controllers/sectioncontroller')
const router= require("express").Router();

router.post('/create',sectioncontroller.create)
router.get('/id/:id',sectioncontroller.getone)


module.exports=router