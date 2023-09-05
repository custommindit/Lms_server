const router= require("express").Router();
const studentrouter=require('./api/studentrouter')
const unitrouter=require('./api/unitrouter')
const sectionrouter=require('./api/sectionrouter')
const quizrouter=require('./api/quizrouter')

router.use('/student',studentrouter)

router.use('/unit',unitrouter)

router.use('/section',sectionrouter)
router.use('/exam',quizrouter)



module.exports=router