const unitcontroller=require('../../controllers/unitcontroller')
const{checkToken}=require('../../auth/token_validation')
const router= require("express").Router();

router.post('/create',unitcontroller.create)
router.get('/my_level',checkToken,unitcontroller.my_level)


module.exports=router