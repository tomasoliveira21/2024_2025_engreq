const express = require('express');
const authentication = require('../middlewares/authentication');
const { checkAMAPAccess, checkProducerRole } = require('../middlewares/permissions');
const { getProductsByAmap, getProductDetails, createProduct, getBasketsByAmap, getBasketDetails} = require('../controllers/productController');

const router = express.Router();

// Product Routes

/**
 * @swagger
 * tags:
 *   - name: "Products"
 *     description: "Endpoints related to product management"
 *
 * /products/amap/{amapId}:
 *   get:
 *     summary: "Get a list of AMAP products"
 *     description: "This endpoint retrieves a list of products available in selected AMAP."
 *     tags:
 *       - "Products"
 *     responses:
 *       200:
 *         description: "A list of products"
 *       404:
 *         description: "No products found"
 */
router.get('/amap/:amapId', authentication, checkAMAPAccess, getProductsByAmap);

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: "Get product details"
 *     description: Get a product details by ID
 *     responses:
 *       200:
 *         description: A product object
 *       404:
 *         description: Product not found
 *     tags:
 *      - "Products"
 */
router.get('/:id', authentication, getProductDetails);

/**
 * @swagger
 * tags:
 *   - name: "Products"
 *     description: "Endpoints related to product management"
 *
 * /products:
 *   post:
 *     summary: "Create a new product"
 *     description: "This endpoint allows users to create a new product."
 *     tags:
 *       - "Products"
 *     requestBody:
 *       description: "Product object that needs to be added"
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Apples"
 *                 description: "The name of the product"
 *               description:
 *                 type: string
 *                 example: "Fresh organic apples"
 *                 description: "A short description of the product"
 *               type:
 *                 type: string
 *                 example: "Fruit"
 *                 description: "The type of the product (e.g., Fruit, Vegetable)"
 *               price:
 *                 type: number
 *                 format: float
 *                 example: 2.5
 *                 description: "The price of the product in dollars"
 *               quantity:
 *                 type: number
 *                 format: float
 *                 example: 10
 *                 description: "The quantity of the product"
 *               producerId:
 *                 type: integer
 *                 example: 1
 *                 description: "The ID of the producer (linked to a producer)"
 *     responses:
 *       201:
 *         description: "Product created successfully"
 *       400:
 *         description: "Invalid input"
 *       500:
 *         description: "Internal server error"
 */
router.post('/', authentication, checkProducerRole, createProduct);

/**
 * BASKET
 */

/**
 * @swagger
 * tags:
 *   - name: "Products"
 *     description: "Endpoints related to products"
 *   - name: "Basket"
 *     description: "Endpoints related to Basket, a subsection of products"
 *
 * /products/basket/amap/{amapId}:
 *   get:
 *     summary: "Get a list of AMAP Basket"
 *     description: "This endpoint retrieves a list of Basket available in selected AMAP."
 *     tags:
 *       - "Basket"
 *     responses:
 *       200:
 *         description: "A list of Basket"
 *       404:
 *         description: "No products found"
 */
router.get('/basket/amap/:amapId', authentication, checkAMAPAccess, getBasketsByAmap);

/**
 * @swagger
 * /products/basket/{id}:
 *   get:
 *     summary: "Get basket details"
 *     description: Get a Basket details by ID
 *     responses:
 *       200:
 *         description: A Basket object
 *       404:
 *         description: Basket not found
 *     tags:
 *      - "Basket"
 */
router.get('/basket/:id', authentication, getBasketDetails);

module.exports = router;
