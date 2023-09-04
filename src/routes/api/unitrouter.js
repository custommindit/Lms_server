const unitcontroller=require('../../controllers/unitcontroller')
const router= require("express").Router();

router.post('/create',unitcontroller.create)


module.exports=router