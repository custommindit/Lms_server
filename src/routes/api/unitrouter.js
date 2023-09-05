const unitcontroller=require('../../controllers/unitcontroller')
const{checkToken}=require('../../auth/token_validation')
const router= require("express").Router();

router.post('/create',unitcontroller.create)
router.get('/my_level',checkToken,unitcontroller.my_level)
router.get('/info/:id',unitcontroller.get_info)


module.exports=router