const postcontroller=require('../../controllers/postcontroller')
const router= require("express").Router();
const {upload} = require('./uploader')
const{checkToken}=require('../../auth/token_validation');
const verifyAdminSecret = require('../../auth/verifyAdminSecret.js');

router.post('/create',upload.single('media'),checkToken,postcontroller.create)
router.post('/comment/:id',checkToken,postcontroller.comment)
router.get('/all',postcontroller.all)
router.get('/level/:level',postcontroller.by_level)
router.get('/myposts',checkToken,postcontroller.myposts)
router.delete('/:id',verifyAdminSecret,checkToken,postcontroller.deleteone)

module.exports=router