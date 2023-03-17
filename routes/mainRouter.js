const express            = require('express');
const router             = express.Router();
const mainController     = require('../controllers/mainController');
const validateShopifySignature = require('../middleware/validateShopifySignature');
router.post('/', validateShopifySignature(), mainController.getWebHook);
router.post('/sku', mainController.getProductSKU);

module.exports = router;