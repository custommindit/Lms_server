const verifyAdminSecret = require('../../auth/verifyAdminSecret.js');
const materialcontroller=require('../../controllers/materialcontroller')
const router= require("express").Router();
const {upload} = require('./uploader')

router.post('/create',verifyAdminSecret,upload.single('media'), materialcontroller.create)
router.delete('/one',verifyAdminSecret,materialcontroller.deleteone)


module.exports=router