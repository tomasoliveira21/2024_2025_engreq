const express = require('express');
const authentication = require('../middlewares/authentication');  // Import the authentication middleware
const { getProductsByUser, getProductsByAmap, getProductDetails} = require('../controllers/productController');

const router = express.Router();

// Product Routes

/**
 * @swagger
 * tags:
 *   - name: "Products"
 *     description: "Endpoints related to product management"
 *
 * /products/:
 *   get:
 *     summary: "Get a list of user products"
 *     description: "This endpoint retrieves a list of all products associated with the authenticated user."
 *     tags:
 *       - "Products"
 *     responses:
 *       200:
 *         description: "A list of products"
 *       404:
 *         description: "No products found"
 */
router.get('/', authentication, getProductsByUser);

/**
 * @swagger
 * tags:
 *   - name: "Products"
 *     description: "Endpoints related to product management"
 *
 * /products:
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
router.get('/amap/:amapId', authentication, getProductsByAmap);

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

module.exports = router;
