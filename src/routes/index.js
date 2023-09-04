const router= require("express").Router();
const studentrouter=require('./api/studentrouter')
const unitrouter=require('./api/unitrouter')
const sectionrouter=require('./api/sectionrouter')


router.use('/student',studentrouter)

router.use('/unit',unitrouter)

router.use('/section',sectionrouter)



module.exports=router