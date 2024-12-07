const logger = require('../utils/logger');
const express = require('express');
const authentication = require('../middlewares/authentication');
const { getOrderHistory, getSubscriptionList, getSubscriptionHistory } = require('../controllers/orderController');

const router = express.Router();

// Order routes

/**
 * @swagger
 * tags:
 *   - name: "Order"
 *     description: "Endpoints related to order management"
 *
 * /order/history:
 *   get:
 *     summary: "Get a list of order history"
 *     description: "This endpoint retrieves a list of all orders available"
 *     tags:
 *       - "Order"
 *     responses:
 *       200:
 *         description: "A list of orders"
 *       404:
 *         description: "No orders found"
 */
router.get('/history', authentication, getOrderHistory);

/**
 * @swagger
 * tags:
 *   - name: "Order"
 *     description: "Endpoints related to order management"
 *
 * /order/subscription:
 *   get:
 *     summary: "Get a list of subscription active"
 *     description: "This endpoint retrieves a list of all subscription available"
 *     tags:
 *       - "Order"
 *     responses:
 *       200:
 *         description: "A list of subscription active"
 *       404:
 *         description: "No subscription found"
 */
router.get('/subscription', authentication, getSubscriptionList);

/**
 * @swagger
 * tags:
 *   - name: "Order"
 *     description: "Endpoints related to order management"
 *
 * /order/subscription/history:
 *   get:
 *     summary: "Get a list of subscription history"
 *     description: "This endpoint retrieves a list of all subscription available"
 *     tags:
 *       - "Order"
 *     responses:
 *       200:
 *         description: "A list of subscription"
 *       404:
 *         description: "No subscription found"
 */
router.get('/subscription/history', authentication, getSubscriptionHistory);

module.exports = router;
