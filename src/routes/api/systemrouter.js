const systemRouter = require('../../controllers/SystemController')
const { checkToken } = require('../../auth/token_validation')
const router = require("express").Router();

router.get('/get_system', systemRouter.getSystem)

module.exports = router