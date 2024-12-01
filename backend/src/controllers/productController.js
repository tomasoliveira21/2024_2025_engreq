const logger = require('../utils/logger');
const {requestUserProducts, requestProductDetails} = require("../services/productService");

/**
 * Get user products
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
const getUserProducts = async (req, res, next) => {
    logger.info(`Get getProducts`);

    // Session data
    const userId = req.user.id;

    // Request access products
    try {
        const products = await requestUserProducts(userId);
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

    // Variables
    const { productId } = req.params;

    // Logger
    logger.info(`Get getProductDetails`);

    // Request access products
    try {
        const productDetails = await requestProductDetails(productId);
        res.status(200).json({ productDetails: productDetails });
    } catch (error) {
        next(error);
    }
};

module.exports = { getUserProducts, getProductDetails};
