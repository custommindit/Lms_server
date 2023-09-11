const materialcontroller=require('../../controllers/materialcontroller')
const router= require("express").Router();
const {upload} = require('./uploader')

router.post('/create',upload.single('media'), materialcontroller.create)


module.exports=router