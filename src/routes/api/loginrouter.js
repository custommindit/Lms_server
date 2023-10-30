const logincontroller=require('../../controllers/logincontroller')
const router= require("express").Router();
const{checkToken}=require('../../auth/token_validation')

router.post('/',logincontroller.login)
router.get('/',checkToken,logincontroller.data)

module.exports=router