const { checkToken } = require('../../auth/token_validation');
const verifyAdminSecret = require('../../auth/verifyAdminSecret.js');
const sectioncontroller=require('../../controllers/sectioncontroller')
const router= require("express").Router();
const {upload} = require('./uploader')

router.post('/create',verifyAdminSecret ,checkToken,sectioncontroller.create)
router.post('/createupload',upload.single("media"),verifyAdminSecret ,checkToken,sectioncontroller.createwithupload)
router.get('/id/:id',sectioncontroller.getone)
router.post('/update/:id',upload.single("media"),verifyAdminSecret ,checkToken,sectioncontroller.updateone)
router.delete('/:id',verifyAdminSecret ,checkToken,sectioncontroller.deleteone)


module.exports=router