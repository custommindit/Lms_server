const router = require("express").Router();
const studentrouter = require('./api/studentrouter')
const unitrouter = require('./api/unitrouter')
const sectionrouter = require('./api/sectionrouter')
const quizrouter = require('./api/quizrouter')
const examrouter = require('./api/examrouter')
const adminrouter = require('./api/adminrouter')
const materialrouter = require('./api/materialrouter')
const postrouter = require('./api/postrouter')
const adminpostrouter = require('./api/adminpostrouter')
const announcementrouter = require('./api/announcementrouter')
const systemrouter = require('./api/systemrouter')
const loginrouter = require('./api/loginrouter')


router.use('/student', studentrouter)

router.use('/unit', unitrouter)

router.use('/section', sectionrouter)

router.use('/quiz', quizrouter)

router.use('/exam', examrouter)

router.use('/admin', adminrouter)

router.use('/material', materialrouter)

router.use('/post', postrouter)

router.use('/adminpost', adminpostrouter)

router.use('/announcement', announcementrouter)

router.use('/system', systemrouter)

router.use('/login', loginrouter)

module.exports = router