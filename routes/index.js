const express = require('express');
const router = express.Router();
const mainRouter = require('./mainRouter');
const skuRouter = require('./skuRouter');

router.use('/', mainRouter);
router.use('/', skuRouter);

module.exports = router;

