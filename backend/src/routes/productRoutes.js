const express = require('express');
const authentication = require('../middlewares/authentication');
const checkAMAPAccess = require('../middlewares/permissions');
const { getProductsByProducer, getProductsByAmap, getProductDetails, createProduct} = require('../controllers/productController');

const router = express.Router();

// Product Routes

/**
 * @swagger
 * tags:
 *   - name: "Products"
 *     description: "Endpoints related to product management"
 *
 * /products/producer/{producerId}:
 *   get:
 *     summary: "Get a list of producer products"
 *     description: "This endpoint retrieves a list of products by producer."
 *     tags:
 *       - "Products"
 *     responses:
 *       200:
 *         description: "A list of products"
 *       404:
 *         description: "No products found"
 */
router.get('/producer/:producerId', authentication, getProductsByProducer);

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
router.post('/', authentication, createProduct);

module.exports = router;
