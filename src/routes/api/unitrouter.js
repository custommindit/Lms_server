const unitcontroller=require('../../controllers/unitcontroller')
const{checkToken}=require('../../auth/token_validation')
const router= require("express").Router();
const multer = require('multer');

// Set up the multer storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads'); // Specify the destination folder for uploaded images
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname); // Use the current timestamp to generate a unique filename
    }
});

const upload = multer({ storage: storage });

router.post('/create', upload.single('media'),unitcontroller.create)
router.get('/my_level',checkToken,unitcontroller.my_level)
router.get('/info/:id',unitcontroller.get_info)
router.get('/',unitcontroller.get_all)
router.get('/level/:level',unitcontroller.get_level)
router.put('/',unitcontroller.update)

module.exports=router