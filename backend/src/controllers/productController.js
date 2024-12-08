const logger = require('../utils/logger');
const {requestProductsByAmap, requestProductDetails, insertNewProduct,
    requestBasketsByAmap, requestBasketDetails, insertNewBasket} = require("../services/productService");

/**
 * Get Products by AMAP
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
const getProductsByAmap = async (req, res, next) => {
    // Arguments
    const { amapId } = req.params;

    // Logger
    logger.info(`Get getProductsByAmap (amapId: ${amapId})`);

    // Request products
    try {
        const products = await requestProductsByAmap(amapId);
        res.status(200).json({ products: products });
    } catch (error) {
        next(error);
    }
};

/**
 * Get Product details
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
const getProductDetails = async (req, res, next) => {

    // Arguments
    const { id } = req.params;

    // Logger
    logger.info(`Get getProductDetails (ID: ${id})`);

    // Request access products
    try {
        const productDetails = await requestProductDetails(id);
        res.status(200).json({ productDetails: productDetails });
    } catch (error) {
        next(error);
    }
};

/**
 * Controller function to create a new product.
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const createProduct = async (req, res, next) => {

    // Logger
    logger.info(`Create new Product`);

    try {
        // Arguments
        const { name, description, type, price, quantity, photoUrl } = req.body;
        const producerId = req.user.producer[0].id;

        // Validate data
        if (!name || !description || !type || !price || !quantity || !producerId) {
            return res.status(400).json({
                success: false,
                message: 'Name, description, type, price, quantity, and producerId are required.'
            });
        }

        // Data
        const productData = { name, description, type, price, quantity, producerId, photoUrl };

        // Insert product
        const newProduct = await insertNewProduct(productData);

        // Return response
        return res.status(201).json({
            success: true,
            message: 'Product created successfully',
            product: newProduct
        });
    } catch (err) {
        // Error
        logger.error(err);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
};

/**
 * BASKETS
 */

/**
 * Get basket by AMAP
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
const getBasketsByAmap = async (req, res, next) => {
    // Arguments
    const { amapId } = req.params;

    // Logger
    logger.info(`Get getBasketsByAmap (amapId: ${amapId})`);

    // Request baskets
    try {
        const baskets = await requestBasketsByAmap(amapId);
        res.status(200).json({ baskets: baskets });
    } catch (error) {
        next(error);
    }
};

/**
 * Get basket details
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
const getBasketDetails = async (req, res, next) => {

    // Arguments
    const { id } = req.params;

    // Logger
    logger.info(`Get getBasketDetails (ID: ${id})`);

    // Request access products
    try {
        const productDetails = await requestBasketDetails(id);
        res.status(200).json({ basketDetails: productDetails });
    } catch (error) {
        next(error);
    }
};

/**
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const createBasket = async (req, res, next) => {

    // Logger
    logger.info(`Create new Basket`);

    try {
        // Arguments
        const { name, description, price, weight, products, photoUrl } = req.body;
        const producerId = req.user.producer[0].id;

        // Validate data
        if (!name || !description || !price || !weight || !products || !producerId) {
            return res.status(400).json({
                success: false,
                message: 'Name, description, price, weight, products and producerId are required.'
            });
        }

        // Data
        const basketData = { name, description, price, weight, producerId, products, photoUrl };

        // Insert Basket
        const newBasket = await insertNewBasket(basketData);

        // Return response
        return res.status(201).json({
            success: true,
            message: 'Basket created successfully',
            basket: newBasket
        });
    } catch (err) {
        // Error
        logger.error(err);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
};

module.exports = {
    getProductsByAmap,
    getProductDetails,
    createProduct,
    getBasketsByAmap,
    getBasketDetails,
    createBasket
};
