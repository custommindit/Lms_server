const announcementcontroller=require('../../controllers/announcementcontroller')
const router= require("express").Router();

const{checkToken}=require('../../auth/token_validation');
const verifyAdminSecret = require('../../auth/verifyAdminSecret.js');

router.post('/create',verifyAdminSecret,checkToken,announcementcontroller.create)

router.get('/',announcementcontroller.all)

router.delete('/:id',checkToken,verifyAdminSecret,announcementcontroller.deleteone)

router.get('/:level',announcementcontroller.bylevel)

module.exports=router