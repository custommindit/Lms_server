const multer = require('multer');
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const path = require("path");
// Set up the multer storage configuration
const storage = multer.diskStorage({
  
    destination: function (req, file, cb) {
        cb(null, './uploads'); // Specify the destination folder for uploaded images
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname); // Use the current timestamp to generate a unique filename
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 * 1024 },
});
const chunkDir = path.join(__dirname, "../../uploads", "chunks");
if (!fs.existsSync(chunkDir)) {
  fs.mkdirSync(chunkDir, { recursive: true });
}

const storageChunk = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, chunkDir);
  },
  filename: function (req, file, cb) {
    const fileId = req.headers["x-file-id"] || uuidv4();
    const chunkIndex = req.headers["x-chunk-index"] || 0;
    
    // تخزين المعلومات في الطلب لاستخدامها لاحقاً
    req.fileId = fileId;
    req.chunkIndex = parseInt(chunkIndex);
    
    cb(null, `${fileId}-${chunkIndex}`);
  }
});

const uploadChunk = multer({ 
  storage: storageChunk,
  limits: { 
    fileSize: 2 * 1024 * 1024 * 1024, // 2GB كحد أقصى
    parts: 100, // زيادة عدد الأجزاء المسموح بها
    files: 1 // عدد الملفات المسموح بها
  }
});
module.exports={upload, uploadChunk};
