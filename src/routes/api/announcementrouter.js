const announcementcontroller=require('../../controllers/announcementcontroller')
const router= require("express").Router();

const{checkToken}=require('../../auth/token_validation')

router.post('/create',checkToken,announcementcontroller.create)

router.get('/',announcementcontroller.all)

router.delete('/:id',checkToken,announcementcontroller.deleteone)

router.get('/:level',announcementcontroller.bylevel)

module.exports=router