const logger = require('../utils/logger');
const {requestProductsByUser, requestProductsByAmap, requestProductDetails} = require("../services/productService");

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

module.exports = { getProductsByUser, getProductsByAmap, getProductDetails};
