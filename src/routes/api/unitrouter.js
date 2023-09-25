const unitcontroller=require('../../controllers/unitcontroller')
const{checkToken}=require('../../auth/token_validation')
const router= require("express").Router();
const {upload} = require('./uploader')

router.post('/create', upload.single('media'),unitcontroller.create)
router.get('/my_level',checkToken,unitcontroller.my_level)
router.get('/info/:id',unitcontroller.get_info)
router.get('/',unitcontroller.get_all)
router.get('/level/:level',unitcontroller.get_level)
router.put('/',unitcontroller.update)
router.get('/buycount/:id',unitcontroller.get_std_number)
router.delete('/:id',checkToken,unitcontroller.delete)

module.exports=router