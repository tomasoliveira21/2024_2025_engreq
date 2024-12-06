const logger = require('../utils/logger');
const express = require('express');
const authentication = require('../middlewares/authentication');
const { getPaymentList } = require('../controllers/paymentController');

const router = express.Router();

// Payment routes

/**
 * @swagger
 * tags:
 *   - name: "Payment"
 *     description: "Endpoints related to Payment management"
 *
 * /payment/:
 *   get:
 *     summary: "Get a list of Payments"
 *     description: "This endpoint retrieves a list of all Payments"
 *     tags:
 *       - "Payment"
 *     responses:
 *       200:
 *         description: "A list of Payments"
 *       404:
 *         description: "No orders found"
 */
router.get('/', authentication, getPaymentList);

module.exports = router;
