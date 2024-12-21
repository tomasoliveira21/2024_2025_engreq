const express = require('express');
const authentication = require('../middlewares/authentication');
const { checkAMAPAccess, checkProducerRole } = require('../middlewares/permissions');
const { getProductsByAmap, getProductDetails, createProduct, updateProductData, getBasketsByAmap, getBasketDetails, createBasket} = require('../controllers/productController');

const router = express.Router();

// Product Routes

/**
 * PRODUCTS
 */

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
 *               photoUrl:
 *                 type: string
 *                 example: "/images/products/apple.jpg"
 *                 description: "The URL of the product's photo"
 *               salesPeriod:
 *                 type: number
 *                 example: "1"
 *                 description: "The id of the salesPeriod, can be empty"
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
 * @swagger
 * tags:
 *   - name: "Products"
 *     description: "Endpoints related to product management"
 *
 * /products:
 *   put:
 *     summary: "Update product information"
 *     description: "This endpoint update product data."
 *     tags:
 *       - "Products"
 *     requestBody:
 *       description: "Product object that needs to be updated"
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
 *               photoUrl:
 *                 type: string
 *                 example: "/images/products/apple.jpg"
 *                 description: "The URL of the product's photo"
 *               salesPeriod:
 *                 type: number
 *                 example: "1"
 *                 description: "The id of the salesPeriod, can be empty"
 *     responses:
 *       201:
 *         description: "Product updated successfully"
 *       400:
 *         description: "Invalid input"
 *       500:
 *         description: "Internal server error"
 */
router.put('/:productId', authentication, checkProducerRole, updateProductData);

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

/**
 * @swagger
 * /products/basket:
 *     post:
 *       summary: Create a new basket
 *       description: Creates a new basket and associates products with it.
 *       operationId: createBasket
 *       tags:
 *         - Basket
 *       requestBody:
 *         description: Basket data to be created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   description: The name of the basket
 *                   example: "Fruit basket"
 *                 description:
 *                   type: string
 *                   description: A description of the basket
 *                   example: "Fresh basket fruit"
 *                 price:
 *                   type: number
 *                   format: float
 *                   description: The price of the basket
 *                   example: 15
 *                 weight:
 *                   type: number
 *                   format: float
 *                   description: The weight of the basket
 *                   example: 123
 *                 photoUrl:
 *                   type: string
 *                   description: The path or URL of the basket's photo
 *                   example: "/images/baskets/fruit-basket.jpg"
 *                 products:
 *                   type: array
 *                   items:
 *                     type: integer
 *                     description: The IDs of products to associate with the basket
 *                     example: [{ "id": 10 },{ "id": 11 }]
 *       responses:
 *         '201':
 *           description: Basket created successfully
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: The unique ID of the newly created basket
 *                     example: 16
 *                   name:
 *                     type: string
 *                     description: The name of the basket
 *                     example: "Fruit basket"
 *                   description:
 *                     type: string
 *                     description: The description of the basket
 *                     example: "Fresh basket fruit"
 *                   price:
 *                     type: number
 *                     format: float
 *                     description: The price of the basket
 *                     example: 15
 *                   weight:
 *                     type: number
 *                     format: float
 *                     description: The weight of the basket
 *                     example: 123
 *                   photoUrl:
 *                     type: string
 *                     description: The path or URL of the basket's photo
 *                     example: "/images/baskets/fruit-basket.jpg"
 *                   products:
 *                     type: array
 *                     items:
 *                       type: integer
 *                       description: The IDs of products associated with the basket
 *                       example: [9, 10]
 *         '400':
 *           description: Invalid input data
 *         '500':
 *           description: Internal server error
 */
router.post('/basket', authentication, checkProducerRole, createBasket);

module.exports = router;
