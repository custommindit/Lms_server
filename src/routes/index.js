const router= require("express").Router();
const studentrouter=require('./api/studentrouter')
const unitrouter=require('./api/unitrouter')
const sectionrouter=require('./api/sectionrouter')
const quizrouter=require('./api/quizrouter')
const examrouter=require('./api/examrouter')
const adminrouter=require('./api/adminrouter')
const materialrouter=require('./api/materialrouter')


router.use('/student',studentrouter)

router.use('/unit',unitrouter)

router.use('/section',sectionrouter)

router.use('/quiz',quizrouter)

router.use('/exam',examrouter)

router.use('/admin',adminrouter)

router.use('/material',materialrouter)

module.exports=router