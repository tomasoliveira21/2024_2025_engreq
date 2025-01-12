const logger = require('../utils/logger');
const {requestProductsByAmap, requestProductDetails, insertNewProduct, updateProduct, upsertProductSalesPeriod, deleteProductSalesPeriod,
    requestBasketsByAmap, requestBasketDetails, insertNewBasket, updateBasket, upsertBasketSalesPeriod, deleteBasketSalesPeriod,
    requestAllProducerProducts,
    requestProducerBaskets,
    requestDeleteBasketData,
    requestDeleteProductData,
    getProductSalePeriods, getBasketSalePeriods
} = require("../services/productService");

/**
 * PRODUCTS
 */

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
 * Controller function to update product data.
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const updateProductData = async (req, res, next) => {
    logger.info(`Update product data`);

    try {
        // Arguments
        const { productId } = req.params;
        const { name, description, type, price, quantity, photoUrl, salesPeriod } = req.body;
        const producerId = req.user.producer[0]?.id;

        // Validate `productId`
        if (!productId) {
            logger.warn(`Missing mandatory field: productId`);
            return res.status(400).json({
                success: false,
                message: 'Validation error: productId is required.',
            });
        }

        // Data
        const productData = { name, description, type, price, quantity, producerId, photoUrl };

        logger.info(`Update product data (productId: ${productId})`);
        logger.info("salesPeriod " + salesPeriod);

        // Update Product
        const updatedProduct = await updateProduct(productId, productData);

        // Update/Insert SalesPeriod
        if (salesPeriod) {
            await upsertProductSalesPeriod(productId, salesPeriod);
        }
        // Delete SalesPeriod
        else {
            await deleteProductSalesPeriod(productId);
        }

        // Return response
        return res.status(201).json({
            success: true,
            message: 'Product updated successfully',
            product: updatedProduct,
        });
    } catch (err) {
        // Error
        logger.error(err);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
        });
    }
};

/**
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
const getProductSalePeriodsData = async (req, res, next) => {
    logger.info(`Get product sale periods`);
    // Arguments
    const { productId } = req.params;

    // Logger
    logger.info(`Get getProductSalePeriods (productId: ${productId})`);

    // Request products
    try {
        const salePeriods = await getProductSalePeriods(productId);
        res.status(200).json({ salePeriods: salePeriods });
    } catch (error) {
        next(error);
    }
}


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
        const { name, description, type, price, quantity, photoUrl, salesPeriod } = req.body;
        const producerId = req.user.producer[0].id;

        // Validate data
        if (!name || !description || !type || !price || !quantity || !producerId) {
            logger.warn(`Missing mandatory fields to insert`);
            return res.status(400).json({
                success: false,
                message: 'Name, description, type, price, quantity, and producerId are required.'
            });
        }

        // Data
        const productData = { name, description, type, price, quantity, producerId, photoUrl };

        // Insert product
        const newProduct = await insertNewProduct(productData);

        // Relate SalesPeriod
        if (salesPeriod)
        {
            const productId = newProduct.id;
            await upsertProductSalesPeriod(productId, salesPeriod);
        }

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
 * @returns {Promise<void>}
 */
const getBasketSalePeriodsData = async (req, res, next) => {
    // Arguments
    const { basketId } = req.params;

    // Logger
    logger.info(`Get getBasketSalePeriods (basketId: ${basketId})`);

    // Request products
    try {
        const salePeriods = await getBasketSalePeriods(basketId);
        res.status(200).json({ salePeriods: salePeriods });
    } catch (error) {
        next(error);
    }
}

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
        const { name, description, price, weight, products, photoUrl, salesPeriod } = req.body;
        const producerId = req.user.producer[0].id;

        // Validate data
        if (!name || !description || !price || !weight || !products || !producerId) {
            logger.warn(`Missing mandatory fields to insert`);
            return res.status(400).json({
                success: false,
                message: 'Name, description, price, weight, products and producerId are required.'
            });
        }

        // Data
        const basketData = { name, description, price, weight, producerId, products, photoUrl };

        // Insert Basket
        const newBasket = await insertNewBasket(basketData);

        // Relate SalesPeriod
        if (salesPeriod)
        {
            const basketId = newBasket.id;
            await upsertBasketSalesPeriod(basketId, salesPeriod);
        }

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

/**
 * Controller function to update basket data.
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const updateBasketData = async (req, res, next) => {
    logger.info(`Update basket data`);

    try {
        // Arguments
        const { id } = req.params;
        const { name, description, price, weight, products, photoUrl, salesPeriod } = req.body;
        const producerId = req.user.producer[0]?.id;

        if (!producerId) {
            logger.warn(`Producer ID is missing`);
            return res.status(400).json({
                success: false,
                message: 'Producer ID is required.'
            });
        }

        // Filter out undefined or null fields
        const basketData = {name, description, price, weight, products, photoUrl, salesPeriod};
        basketData.producerId = producerId; // Always include producerId as it's mandatory

        // Update Basket
        const updatedBasket = await updateBasket(id, basketData);

        // Handle SalesPeriod
        if (salesPeriod !== undefined && salesPeriod !== null) {
            await upsertBasketSalesPeriod(id, salesPeriod);
        } else {
            await deleteBasketSalesPeriod(id);
        }

        // Return response
        return res.status(201).json({
            success: true,
            message: 'Basket updated successfully',
            basket: updatedBasket,
        });
    } catch (err) {
        // Error handling
        logger.error(err);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
        });
    }
};


/**
 * PRODUCTS
 */

/**
 * Get All Producer Products
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
const getAllProducerProducts = async (req, res, next) => {
    // Arguments
    const { producerId } = req.params;

    // Logger
    logger.info(`Get getAllProducerProducts (producerId: ${producerId})`);

    // Request products
    try {
        const products = await requestAllProducerProducts(producerId);
        res.status(200).json({ products: products });
    } catch (error) {
        next(error);
    }
};

/**
 * Get All Producer Baskets
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
const getAllProducerBaskets = async (req, res, next) => {
    // Arguments
    const { producerId } = req.params;

    // Logger
    logger.info(`Get getAllProducerBaskets (producerId: ${producerId})`);

    // Request baskets
    try {
        const baskets = await requestProducerBaskets(producerId);
        res.status(200).json({ baskets: baskets });
    } catch (error) {
        next(error);
    }
};

/**
 * Delete Product by ID
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
const deleteProductData = async (req, res, next) => {
    // Arguments
    const { productId } = req.params;

    // Logger
    logger.info(`Delete deleteProductData (productId: ${productId})`);

    // Request baskets
    try {
        const product = await requestDeleteProductData(productId);
        res.status(200).json({ product: product });
    } catch (error) {
        next(error);
    }
};

/**
 * Delete Basket by ID
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
const deleteBasketData = async (req, res, next) => {
    // Arguments
    const { basketId } = req.params;

    // Logger
    logger.info(`Delete deleteBasketData (basketId: ${basketId})`);

    // Request baskets
    try {
        const basket = await requestDeleteBasketData(basketId);
        res.status(200).json({ basket: basket });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getProductsByAmap,
    getProductDetails,
    createProduct,
    updateProductData,
    getBasketsByAmap,
    getBasketDetails,
    createBasket,
    updateBasketData,
    getAllProducerProducts,
    getAllProducerBaskets,
    deleteBasketData,
    deleteProductData,
    getProductSalePeriodsData,
    getBasketSalePeriodsData
};
