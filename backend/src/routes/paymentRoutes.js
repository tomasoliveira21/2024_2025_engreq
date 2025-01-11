const logger = require('../utils/logger');
const express = require('express');
const authentication = require('../middlewares/authentication');
const {
    getUserPaymentList,
    addUserPayment
} = require('../controllers/paymentController');

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
router.get('/', authentication, getUserPaymentList);

/**
 * @swagger
 * tags:
 *   - name: "Payment"
 *     description: "Endpoints related to Payment management"
 *
 * /payment/:
 *   post:
 *     summary: "Create a new payment"
 *     description: "This endpoint allows users to create a new payment."
 *     tags:
 *       - "Payment"
 *     requestBody:
 *       description: "Payment object that needs to be added"
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *                 example: 40
 *                 description: "The amount to pay"
 *               orderId:
 *                 type: number
 *                 example: 45
 *                 description: "The orderId related to the payment"
 *     responses:
 *       201:
 *         description: "Payment created successfully"
 *       400:
 *         description: "Invalid input"
 *       500:
 *         description: "Internal server error"
 */
router.post('/', authentication, addUserPayment);

module.exports = router;
