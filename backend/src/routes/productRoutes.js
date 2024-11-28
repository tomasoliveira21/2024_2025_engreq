const logger = require('../utils/logger');
const express = require('express');
const { getProducts} = require('../controllers/productController');

const router = express.Router();

// Routes
// Product by amap ID
router.get('/list', getProducts);

// Product details by ID
router.get('/:id', getProducts);

module.exports = router;
