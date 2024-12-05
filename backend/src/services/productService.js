const logger = require('../utils/logger');
const Product = require('../domain/classes/Product');
const Basket = require('../domain/classes/Basket');
const Producer = require('../domain/classes/Producer');
const User = require('../domain/classes/User');


/**
 * Products by AMAP
 * @param amapId
 * @returns {Promise<*|[{quantity: number, price: number, name: string, description: string, id: number, type: string},{quantity: number, price: number, name: string, description: string, id: number, type: string},{quantity: number, price: number, name: string, description: string, id: number, type: string}]|null>}
 */
const requestProductsByAmap = async (amapId) => {
    logger.info(`Fetching products by AMAP (AMAP: ${amapId})`);

    try {
        // Query data
        const productList = await Product.findAll({
            attributes: ['id', 'name', 'description', 'type', 'price', 'quantity'],
            include: [
                {
                    model: Producer,
                    attributes: [],
                    required: true,
                    include: [
                        {
                            model: User,
                            attributes: [],
                            where: {
                                AMAPId: amapId,
                            },
                        },
                    ],
                },
            ],
        });

        // Logger
        logger.info(`Retrieved products data: ${JSON.stringify(productList)}`);

        return productList;
    } catch (error) {
        logger.error('Error fetching products data:', error.message);
        return [];
    }
};

/**
 * Product Details
 * @param productID
 * @returns {Promise<[{price: number, name: string, description: string, id: number},{price: number, name: string, description: string, id: number},{price: number, name: string, description: string, id: number}]|*|null>}
 */
const requestProductDetails = async (productID) => {

    logger.info(`Fetching product details (Product: ${productID})`);

    try {
        // Query data
        const productDetails = await Product.findAll({
            attributes: ['id', 'name', 'description', 'type', 'price', 'quantity'],
            where: {
                id: productID,
            },
            include: [
                {
                    model: Producer,
                    attributes: ['id', 'businessName'],
                    required: true,
                    include: [
                        {
                            model: User,
                            attributes: ['id', 'email', 'nif'],
                        },
                    ],
                },
            ],
        });

        // Logger
        logger.info(`Retrieved products details: ${JSON.stringify(productDetails)}`);

        return productDetails;
    } catch (error) {
        logger.error('Error fetching products details:', error.message);
        return [];
    }
};

/**
 * Create new product
 * @param productData
 * @returns {Promise<*>}
 */
const insertNewProduct = async (productData) => {
    // Logger
    logger.info(`Insert new product`);

    try {
        // Create a new product
        const newProduct = await Product.create({
            name: productData.name,
            description: productData.description,
            type: productData.type,
            price: productData.price,
            quantity: productData.quantity,
            createdAt: new Date(),
            updatedAt: new Date(),
            producerId: productData.producerId
        });

        logger.log('Product created successfully:', newProduct);
        return newProduct;
    } catch (error) {
        logger.error('Error creating new product:', error);
        throw error;
    }
};

/**
 * BASKETS
 */

/**
 * Basket list by AMAP
 * @param amapId
 * @returns {Promise<*|*[]>}
 */
const requestBasketsByAmap = async (amapId) => {
    logger.info(`Fetching baskets by AMAP (AMAP: ${amapId})`);

    try {
        // Query data
        const basketList = await Basket.findAll({
            attributes: ['id', 'name', 'description', 'photoUrl', 'price', 'weight'],
            include: [
                {
                    model: Producer,
                    attributes: [],
                    required: true,
                    include: [
                        {
                            model: User,
                            attributes: [],
                            where: {
                                AMAPId: amapId,
                            },
                        },
                    ],
                },
            ],
        });

        // Logger
        logger.info(`Retrieved baskets data: ${JSON.stringify(basketList)}`);

        return basketList;
    } catch (error) {
        logger.error('Error fetching baskets data:', error.message);
        return [];
    }
};

/**
 * Basket Details
 * @param basketId
 * @returns {Promise<*|*[]>}
 */
const requestBasketDetails = async (basketId) => {

    logger.info(`Fetching basket details (Basket: ${basketId})`);

    try {
        // Query data
        const basketDetails = await Basket.findAll({
            attributes: ['id', 'name', 'description', 'photoUrl', 'price', 'weight'],
            where: {
                id: basketId,
            },
            include: [
                {
                    model: Producer,
                    attributes: ['id', 'businessName'],
                    required: true,
                    include: [
                        {
                            model: User,
                            attributes: ['id', 'email', 'nif'],
                        },
                    ],
                },
                {
                    model: Product,
                    attributes: ['id', 'name', 'description', 'price'],
                    through: {
                        attributes: [],
                    },
                },
            ],
        });

        // Logger
        logger.info(`Retrieved basket details: ${JSON.stringify(basketDetails)}`);

        return basketDetails;
    } catch (error) {
        logger.error('Error fetching basket details:', error.message);
        return [];
    }
};

module.exports = {
    requestProductsByAmap,
    requestProductDetails,
    insertNewProduct,
    requestBasketsByAmap,
    requestBasketDetails
};
