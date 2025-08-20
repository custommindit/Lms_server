const { checkToken } = require('../../auth/token_validation');
const verifyAdminSecret = require('../../auth/verifyAdminSecret.js');
const sectioncontroller=require('../../controllers/sectioncontroller')
const router= require("express").Router();
const {upload} = require('./uploader')
const logger = require('../../utils/logger');

const logRequest = (req, res, next) => {
  logger.info(`[REQUEST] ${req.method} ${req.originalUrl} | IP: ${req.ip} | User: ${req.user?.id || 'anonymous'}`);
  if (req.file) {
    logger.info(`[FILE UPLOAD] Field: ${req.file.fieldname} | Name: ${req.file.originalname} | Size: ${req.file.size} bytes`);
  }
  next();
};

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch((err) => {
    logger.error(`[ERROR] ${req.method} ${req.originalUrl} | ${err.stack}`);
    res.status(500).json({ 
      success: false,
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  });
};

router.post('/create',verifyAdminSecret ,checkToken,sectioncontroller.create)
router.post('/createupload',
	logRequest,
	upload.single("media"),
	(req, res, next) => {
    		if (!req.file) {
      			logger.warn('[UPLOAD] No file provided in createupload');
      			return res.status(400).json({ success: false, error: 'Media file is required' });
    		}
    		next();
  	},
	verifyAdminSecret,
	checkToken,
	asyncHandler(sectioncontroller.createwithupload))
router.get('/id/:id',sectioncontroller.getone)
router.post('/update/:id',upload.single("media"),verifyAdminSecret ,checkToken,sectioncontroller.updateone)
router.delete('/:id',verifyAdminSecret ,checkToken,sectioncontroller.deleteone)


module.exports=router
