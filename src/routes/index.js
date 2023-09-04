const router= require("express").Router();
const studentrouter=require('./api/studentrouter')


router.use('/student',studentrouter)



module.exports=router