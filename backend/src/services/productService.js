const logger = require('../utils/logger');
const Basket = require('../domain/models/Basket');
const BasketProduct = require('../domain/models/BasketProducts');
const Product = require('../domain/models/Product');
const Producer = require('../domain/models/Producer');
const Certificate = require('../domain/models/Certificate');
const User = require('../domain/models/User');


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
            attributes: ['id', 'name', 'description', 'type', 'price', 'quantity', 'photoUrl'],
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
                        {
                            model: Certificate,
                            attributes: ['id', 'name', 'issuingAuthority', 'issueDate', 'expirationDate'],
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
            producerId: productData.producerId,
            photoUrl: productData.photoUrl || 'default-photo-url.jpg'
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
            attributes: ['id', 'name', 'description', 'type', 'photoUrl', 'price', 'weight'],
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

/**
 * Create new Basket
 * @param basketData
 * @returns {Promise<*>}
 */
const insertNewBasket = async (basketData) => {
    logger.info('Insert new basket');

    try {
        // Create a new basket
        const newBasket = await Basket.create({
            name: basketData.name,
            description: basketData.description,
            price: basketData.price,
            weight: basketData.weight,
            createdAt: new Date(),
            updatedAt: new Date(),
            ProducerId: basketData.producerId,
            photoUrl: basketData.photoUrl || 'default-photo-url.jpg'
        });

        logger.info('Basket created:', newBasket);

        // Prepare BasketProduct data
        const basketProducts = [];
        if (basketData.products && basketData.products.length > 0) {
            basketData.products.forEach(product => {
                basketProducts.push({
                    BasketId: newBasket.id,
                    ProductId: product.id,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                });
            });

            // Bulk insert BasketProducts
            await BasketProduct.bulkCreate(basketProducts);
            logger.info('Products added to the basket');
        }

        logger.info('Basket created successfully:', newBasket);
        return newBasket;
    } catch (error) {
        logger.error('Error creating new basket:', error);
        throw error;
    }
};

module.exports = {
    requestProductsByAmap,
    requestProductDetails,
    insertNewProduct,
    requestBasketsByAmap,
    requestBasketDetails,
    insertNewBasket
};
