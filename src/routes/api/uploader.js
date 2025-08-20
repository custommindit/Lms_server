const multer = require('multer');
const path = require('path');
// Set up the multer storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
	console.log(`[UPLOAD START] ${new Date().toISOString()} | File: ${file.originalname} | Size: ${file.size} bytes`);
        cb(null, './uploads'); // Specify the destination folder for uploaded images
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname); // Use the current timestamp to generate a unique filename
    }
});
const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|gif|mp4|mov|pdf|docx/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    console.error(`[UPLOAD REJECTED] ${new Date().toISOString()} | Invalid file type: ${file.mimetype}`);
    return cb(new Error('Only images, videos, PDFs and documents are allowed'), false);
  }
};
const upload = multer({ 
    storage: storage,
    limits: {
	 fileSize: 2 * 1024 * 1024 * 1024,
	 files: 1,
	 fieldSize: 2 * 1024 * 1024 * 1024,
	 parts: Infinity, // Important for large files
         headerPairs: 2000 // Increase if needed
    },
  //  fileFilter: fileFilter  
});
const uploadWithLogging = (req, res, next) => {
  const startTime = Date.now();
  
  upload(req, res, function(err) {
    if (err) {
      // Handle Multer errors
      let errorMessage = 'Upload failed';
      
      if (err.code === 'LIMIT_FILE_SIZE') {
        errorMessage = `File too large (max ${600}MB)`;
      } else if (err.code === 'LIMIT_FILE_TYPE') {
        errorMessage = 'Invalid file type';
      }

      console.error(`[UPLOAD FAILED] ${new Date().toISOString()} | Duration: ${Date.now() - startTime}ms | Error: ${err.message} | Code: ${err.code || 'N/A'}`);
      return res.status(400).json({ success: false, error: errorMessage });
    }

    if (!req.file) {
      console.error(`[UPLOAD FAILED] ${new Date().toISOString()} | No file provided`);
      return res.status(400).json({ success: false, error: 'No file provided' });
    }

    console.log(`[UPLOAD SUCCESS] ${new Date().toISOString()} | File: ${req.file.originalname} | Size: ${req.file.size} bytes | Duration: ${Date.now() - startTime}ms | Path: ${req.file.path}`);
    next();
  });
};
module.exports={upload};
