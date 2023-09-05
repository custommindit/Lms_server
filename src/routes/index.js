const router= require("express").Router();
const studentrouter=require('./api/studentrouter')
const unitrouter=require('./api/unitrouter')
const sectionrouter=require('./api/sectionrouter')
const examrouter=require('./api/examrouter')

router.use('/student',studentrouter)

router.use('/unit',unitrouter)

router.use('/section',sectionrouter)
router.use('/exam',examrouter)



module.exports=router