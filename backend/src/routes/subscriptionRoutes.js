const logger = require('../utils/logger');
const express = require('express');
const authentication = require('../middlewares/authentication');
const { getSubscriptionList, getSubscriptionHistory, createOrderSubscription } = require('../controllers/subscriptionController');
const {checkCoproducerRole} = require("../middlewares/permissions");

const router = express.Router();

// Order routes

/**
 * @swagger
 * tags:
 *   - name: "Subscription"
 *     description: "Endpoints related to subscription management"
 *
 * /subscription:
 *   get:
 *     summary: "Get a list of subscription active"
 *     description: "This endpoint retrieves a list of all subscription available"
 *     tags:
 *       - "Subscription"
 *     responses:
 *       200:
 *         description: "A list of subscription active"
 *       404:
 *         description: "No subscription found"
 */
router.get('/', authentication, getSubscriptionList);

/**
 * @swagger
 * tags:
 *   - name: "Subscription"
 *     description: "Endpoints related to subscription management"
 *
 * /subscription/history:
 *   get:
 *     summary: "Get a list of subscription history"
 *     description: "This endpoint retrieves a list of all subscription available"
 *     tags:
 *       - "Subscription"
 *     responses:
 *       200:
 *         description: "A list of subscription"
 *       404:
 *         description: "No subscription found"
 */
router.get('/history', authentication, getSubscriptionHistory);


/**
 * @swagger
 * tags:
 *   - name: "Subscription"
 *     description: "Endpoints related to subscription management"
 *
 * /subscription:
 *   post:
 *     summary: "Create a new subscription"
 *     description: "This endpoint create a new subscription"
 *     tags:
 *       - "Subscription"
 *     requestBody:
 *       description: "Subscription data that needs to be created"
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               periodType:
 *                 type: string
 *                 description: "The period type for the subscription (weekly, monthly)"
 *                 example: "weekly"
 *               itemType:
 *                 type: string
 *                 description: "The type of the item subscribed (product, basket)"
 *                 example: "product"
 *               itemId:
 *                 type: integer
 *                 description: "The ID of the item subscribed (productId or basketId)"
 *                 example: 1
 *               quantity:
 *                 type: integer
 *                 description: "The quantity of the item subscribed"
 *                 example: 10
 *     responses:
 *       201:
 *         description: "Subscription created successfully"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: "The unique ID of the newly subscription"
 *                   example: 1
 *                 periodType:
 *                   type: string
 *                   description: "The period type for the subscription"
 *                   example: "weekly"
 *                 itemType:
 *                   type: string
 *                   description: "The type of the item subscribed"
 *                   example: "product"
 *                 itemId:
 *                   type: integer
 *                   description: "The ID of the item subscribed"
 *                   example: 1
 *                 quantity:
 *                   type: integer
 *                   description: "The quantity of the item subscribed"
 *                   example: 10
 *       400:
 *         description: "Invalid input data"
 *       500:
 *         description: "Internal server error"
 */
router.post('/', authentication, checkCoproducerRole, createOrderSubscription);

module.exports = router;
