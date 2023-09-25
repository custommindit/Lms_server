const { checkToken } = require('../../auth/token_validation');
const sectioncontroller=require('../../controllers/sectioncontroller')
const router= require("express").Router();

router.post('/create',sectioncontroller.create)
router.get('/id/:id',sectioncontroller.getone)
router.put('/updatereading/:id',sectioncontroller.updateone)
router.delete('/:id',checkToken,sectioncontroller.deleteone)


module.exports=router