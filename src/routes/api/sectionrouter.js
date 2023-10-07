const { checkToken } = require('../../auth/token_validation');
const sectioncontroller=require('../../controllers/sectioncontroller')
const router= require("express").Router();
const {upload} = require('./uploader')

router.post('/create',checkToken,sectioncontroller.create)
router.post('/createupload',upload.single("media"),checkToken,sectioncontroller.createwithupload)
router.get('/id/:id',sectioncontroller.getone)
router.put('/update/:id',upload.single("media"),checkToken,sectioncontroller.updateone)
router.delete('/:id',checkToken,sectioncontroller.deleteone)


module.exports=router