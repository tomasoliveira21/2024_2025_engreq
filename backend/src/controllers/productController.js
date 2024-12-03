const logger = require('../utils/logger');
const {requestProductsByUser, requestProductsByAmap, requestProductDetails, insertNewProduct} = require("../services/productService");

/**
 * Get user products
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
const getProductsByUser = async (req, res, next) => {
    // Session data
    const userId = req.user.id;

    // Logger
    logger.info(`Get getProductsByUser (User: ${userId})`);

    // Request access products
    try {
        const products = await requestProductsByUser(userId);
        res.status(200).json({ products: products });
    } catch (error) {
        next(error);
    }
};

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

    // Validate User permi

    // Request access products
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
    logger.info(`createProduct`);

    try {
        // Arguments
        const { name, description, type, price, producerId } = req.body;

        // Validate data
        if (!name || !description || !type || !price || !producerId) {
            return res.status(400).json({
                success: false,
                message: 'Name, description, type, and price are required.'
            });
        }

        // Data
        const productData = { name, description, type, price, producerId };

        // Insert product
        const newProduct = await insertNewProduct(productData);

        // Insert new approval request
        // TODO

        // New notifications
        // TODO

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

module.exports = { getProductsByUser, getProductsByAmap, getProductDetails, createProduct};
