const logger = require('../utils/logger');
const express = require('express');
const authentication = require('../middlewares/authentication');
const { getSubscriptionList, getSubscriptionHistory, createOrder } = require('../controllers/subscriptionController');
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

router.post('/', authentication, checkCoproducerRole, createOrder);

module.exports = router;
