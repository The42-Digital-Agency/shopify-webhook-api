const express           = require('express');
const router            = express.Router();
const SkuController     = require('../controllers/skuController');
router.post('/sku', SkuController.getSku);

module.exports = router;