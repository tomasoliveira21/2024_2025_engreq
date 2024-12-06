const logger = require('../utils/logger');
const express = require('express');
const authentication = require('../middlewares/authentication');
const { getOrderList } = require('../controllers/orderController');

const router = express.Router();

// Order routes

/**
 * @swagger
 * tags:
 *   - name: "Order"
 *     description: "Endpoints related to order management"
 *
 * /order/:
 *   get:
 *     summary: "Get a list of orders"
 *     description: "This endpoint retrieves a list of all orders available"
 *     tags:
 *       - "Order"
 *     responses:
 *       200:
 *         description: "A list of orders"
 *       404:
 *         description: "No orders found"
 */
router.get('/', authentication, getOrderList);

module.exports = router;
