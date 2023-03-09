const express            = require('express');
const router             = express.Router();
const mainController     = require('../controllers/mainController');
router.post('/', mainController.getWebHook);

module.exports = router;