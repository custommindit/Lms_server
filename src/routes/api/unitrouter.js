const unitcontroller=require('../../controllers/unitcontroller')
const{checkToken}=require('../../auth/token_validation')
const router= require("express").Router();
const {upload} = require('./uploader');
const verifyAdminSecret = require('../../auth/verifyAdminSecret.js');

router.post('/create',verifyAdminSecret ,upload.single('media'),unitcontroller.create)
router.get('/my_level',checkToken,unitcontroller.my_level)
router.get('/info/:id',unitcontroller.get_info)
router.get('/',unitcontroller.get_all)
router.get('/level/:level',unitcontroller.get_level)
router.put('/',verifyAdminSecret ,unitcontroller.update)
router.put('/image',upload.single('media'),verifyAdminSecret ,checkToken,unitcontroller.update)
router.get('/buycount/:id',unitcontroller.get_std_number)
router.delete('/:id',verifyAdminSecret ,checkToken,unitcontroller.delete)

module.exports=router