const logger = require('../utils/logger');
const express = require('express');
const authentication = require('../middlewares/authentication');
const {
    getSubscriptionList,
    getSubscriptionHistory,
    createOrderSubscription,
    updateOrderSubscription,
    getCartList,
    getCartHistory,
    deleteCartItemAction,
    addItemToCart,
    cartCheckout,
    updateItemCart
} = require('../controllers/subscriptionController');
const { checkCoproducerRole, checkProducerRole} = require("../middlewares/permissions");
const {updateBasketData} = require("../controllers/productController");

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
 *     summary: "Get a list of subscription order (pending status)"
 *     description: "This endpoint retrieves a list of all subscription (weekly or monthly) in status pending"
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
 *     description: "This endpoint retrieves a list of all subscription (weekly or monthly) in status completed or cancelled"
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
 *       400:
 *         description: "Invalid input data"
 *       500:
 *         description: "Internal server error"
 */
router.post('/', authentication, checkCoproducerRole, createOrderSubscription);

/**
 * @swagger
 * tags:
 *   - name: "Subscription"
 *     description: "Endpoints related to subscription management"
 *
 * /subscription/{id}:
 *   put:
 *     summary: "Update the subscription data"
 *     description: "This endpoint create a new subscription"
 *     tags:
 *       - "Subscription"
 *     requestBody:
 *       description: "Endpoint to update the subscription status"
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 description: "Status of the subscription"
 *                 example: "completed"
 *     responses:
 *       201:
 *         description: "Subscription created successfully"
 *       400:
 *         description: "Invalid input data"
 *       500:
 *         description: "Internal server error"
 */
router.put('/:id', authentication, checkProducerRole, updateOrderSubscription);


/**
 * CART
 */

/**
 * @swagger
 * tags:
 *   - name: "Cart"
 *     description: "Endpoints related with user cart"
 *
 * /subscription/cart:
 *   get:
 *     summary: "Products list of the user cart."
 *     description: "This endpoint retrieves a list of user cart list"
 *     tags:
 *       - "Cart"
 *     responses:
 *       200:
 *         description: "A list of products in cart"
 *       404:
 *         description: "No cart found"
 */
router.get('/cart', authentication, getCartList);

/**
 * @swagger
 * /subscription/cart:
 *   post:
 *     summary: "Add item to cart"
 *     description: "This endpoint add a item to cart"
 *     tags:
 *       - "Cart"
 *     requestBody:
 *       description: "Cart data that needs to be created"
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
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
 *                 description: "The quantity of the item to add to cart"
 *                 example: 10
 *     responses:
 *       201:
 *         description: "Added to cart successfully"
 *       400:
 *         description: "Invalid input data"
 *       500:
 *         description: "Internal server error"
 */
router.post('/cart', authentication, addItemToCart);

/**
 * @swagger
 * /subscription/cart/{itemId}:
 *   put:
 *     summary: "Update cart item"
 *     description: "This endpoint update a item cart quantity"
 *     tags:
 *       - "Cart"
 *     requestBody:
 *       description: "Cart data that needs to be updated"
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantity:
 *                 type: integer
 *                 description: "The quantity of the item to add to cart"
 *                 example: 10
 *     responses:
 *       201:
 *         description: "Cart item updated"
 *       400:
 *         description: "Invalid input data"
 *       500:
 *         description: "Internal server error"
 */
router.put('/cart/:itemId', authentication, updateItemCart);

/**
 * @swagger
 * /subscription/cart/checkout:
 *   post:
 *     summary: "Checkout the cart (convert to a order)"
 *     description: "This endpoint convert the cart in order"
 *     tags:
 *       - "Cart"
 *     responses:
 *       201:
 *         description: "Cart checkout successfully"
 *       400:
 *         description: "Invalid input data"
 *       500:
 *         description: "Internal server error"
 */
router.post('/cart/checkout', authentication, cartCheckout);

/**
 * @swagger
 * /subscription/cart/history:
 *   get:
 *     summary: "Get a list of single purchase history"
 *     description: "This endpoint retrieves a list of all purchase history (single purchase) in status completed"
 *     tags:
 *       - "Cart"
 *     responses:
 *       200:
 *         description: "A list of single purchase history"
 *       404:
 *         description: "No purchase found"
 */
router.get('/cart/history', authentication, getCartHistory);

/**
 * @swagger
 * /subscription/cart/{itemId}:
 *   delete:
 *     summary: Delete a specific cart item
 *     description: Deletes a cart item by its ID.
 *     tags:
 *       - "Cart"
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         description: ID of the item to delete
 *     responses:
 *       200:
 *         description: Cart item successfully deleted
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Cart item not found
 */
router.delete('/cart/:itemId', authentication, deleteCartItemAction);

module.exports = router;
