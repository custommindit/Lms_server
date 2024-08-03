const multer = require('multer');

// Set up the multer storage configuration
const storage = multer.diskStorage({
    limits: { fileSize: 600 * 1024 * 1024 }, 
    destination: function (req, file, cb) {
        cb(null, './uploads'); // Specify the destination folder for uploaded images
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname); // Use the current timestamp to generate a unique filename
    }
});

const upload = multer({ 
    storage: storage
});
module.exports={upload}
