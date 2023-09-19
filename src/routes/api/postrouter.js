const postcontroller=require('../../controllers/postcontroller')
const router= require("express").Router();
const {upload} = require('./uploader')
const{checkToken}=require('../../auth/token_validation')

router.post('/create',upload.single('media'),checkToken,postcontroller.create)
router.post('/comment/:id',checkToken,postcontroller.comment)
router.get('/all',postcontroller.all)


module.exports=router