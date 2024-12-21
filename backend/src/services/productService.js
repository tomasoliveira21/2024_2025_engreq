const logger = require('../utils/logger');
const Basket = require('../domain/models/Basket');
const BasketProduct = require('../domain/models/BasketProducts');
const Product = require('../domain/models/Product');
const Producer = require('../domain/models/Producer');
const Certificate = require('../domain/models/Certificate');
const User = require('../domain/models/User');
const SalePeriod = require('../domain/models/SalePeriod');
const ProductSalePeriod = require('../domain/models/ProductSalePeriod');
const BasketSalePeriod = require('../domain/models/BasketSalePeriod');

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
                {
                    model: SalePeriod,
                    attributes: ['id', 'name', 'season', 'startDate', 'endDate'],
                    through: {
                        attributes: []
                    },
                    required: false,
                }
            ],
        });

        // Logger
        logger.info(`Retrieved products data: ${JSON.stringify(productList)}`);

        return productList;
    } catch (error) {
        logger.error('Error fetching products data:', error);
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
                {
                    model: SalePeriod,
                    attributes: ['id', 'name', 'season', 'startDate', 'endDate'],
                    through: {
                        attributes: []
                    },
                    required: false,
                }
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
 *
 * @param productId
 * @param productData
 * @returns {Promise<*|null>}
 */
const updateProduct = async (productId, productData) => {
    try {
        // Find the product by ID
        const product = await Product.findByPk(productId);

        // Not found
        if (!product) {
            logger.warn(`Product with ID ${productId} not found`);
            return null;
        }

        // Update data
        const updatedProduct = await product.update({
            name: productData.name,
            description: productData.description,
            type: productData.type,
            price: productData.price,
            quantity: productData.quantity,
            photoUrl: productData.photoUrl,
            updatedAt: new Date(),
        });

        logger.info(`Product updated successfully: ${productId}`);
        return updatedProduct;
    } catch (error) {
        // Log the error and rethrow it
        logger.error(`Error updating product: `, error);
        throw error;
    }
};

/**
 *
 * @param productId
 * @param salesPeriodId
 * @returns {Promise<*|null>}
 */
const upsertProductSalesPeriod = async (productId, salesPeriodId) => {
    logger.info(`Updating ProductSalesPeriod productID ${productId}`);

    let newsRows = [];
    try {

        let productSalePeriod = await ProductSalePeriod.findOne({
            where: {
                ProductId: productId,
            },
        });

        if (productSalePeriod)
        {
            [newsRows] = await ProductSalePeriod.update(
                {
                    SalePeriodId: salesPeriodId,
                    updatedAt: new Date(),
                },
                {
                    where: {
                        ProductId: productId,
                    },
                }
            );
            logger.info(`ProductSalesPeriod updated successfully.`);
        } else {
            // Insert new line
            newsRows = await ProductSalePeriod.create({
                ProductId: productId,
                SalePeriodId: salesPeriodId,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            logger.info(`ProductSalesPeriod inserted successfully.`);
        }

        logger.info(`ProductSalesPeriod updsert successfully.`);
        return newsRows;
    } catch (error) {
        // Log the error and rethrow it
        logger.error(`Error updating ProductSalesPeriod for productID ${productId}: `, error);
        throw error;
    }
};

/**
 *
 * @param productId
 * @returns {Promise<*>}
 */
const deleteProductSalesPeriod = async (productId) => {
    try {
        // Find the product by ID
        const deletedProductSalesPeriod = await ProductSalePeriod.destroy({
            where: {
                ProductId: productId,
            },
        });

        logger.info(`ProductSalesPeriod deleted successfully: ${productId}`);
        return deletedProductSalesPeriod;
    } catch (error) {
        // Log the error and rethrow it
        logger.error(`Error deleting ProductSalesPeriod: `, error);
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
                {
                    model: SalePeriod,
                    attributes: ['id', 'name', 'season', 'startDate', 'endDate'],
                    through: {
                        attributes: []
                    },
                    required: false,
                }
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
                {
                    model: SalePeriod,
                    attributes: ['id', 'name', 'season', 'startDate', 'endDate'],
                    through: {
                        attributes: []
                    },
                    required: false,
                }
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

/**
 *
 * @param basketId
 * @param basketData
 * @returns {Promise<*|null>}
 */
const updateBasket = async (basketId, basketData) => {
    try {
        // Find the basket by ID
        const basket = await Basket.findByPk(basketId);

        // Not found
        if (!basket) {
            logger.warn(`Basket with ID ${basketId} not found`);
            return null;
        }

        // Update data
        const updatedBasket = await basket.update({
            name: basketData.name,
            description: basketData.description,
            price: basketData.price,
            weight: basketData.weight,
            createdAt: new Date(),
            updatedAt: new Date(),
            ProducerId: basketData.producerId,
            photoUrl: basketData.photoUrl || 'default-photo-url.jpg'
        });

        logger.info(`Basket updated successfully: ${basketId}`);
        return updatedBasket;
    } catch (error) {
        // Log the error and rethrow it
        logger.error(`Error updating product: `, error);
        throw error;
    }
};

/**
 *
 * @param basketId
 * @param salesPeriodId
 * @returns {Promise<*>}
 */
const upsertBasketSalesPeriod = async (basketId, salesPeriodId) => {
    logger.info(`Updating BasketSalesPeriod basketId ${basketId}`);

    let newsRows = [];
    try {

        let basketSalePeriod = await BasketSalePeriod.findOne({
            where: {
                BasketId: basketId,
            },
        });

        if (basketSalePeriod)
        {
            [newsRows] = await BasketSalePeriod.update(
                {
                    SalePeriodId: salesPeriodId,
                    updatedAt: new Date(),
                },
                {
                    where: {
                        BasketId: basketId,
                    },
                }
            );
            logger.info(`BasketSalesPeriod updated successfully.`);
        } else {
            // Insert new line
            newsRows = await BasketSalePeriod.create({
                BasketId: basketId,
                SalePeriodId: salesPeriodId,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            logger.info(`BasketSalesPeriod inserted successfully.`);
        }

        logger.info(`BasketSalesPeriod updsert successfully.`);
        return newsRows;
    } catch (error) {
        // Log the error and rethrow it
        logger.error(`Error updating BasketSalesPeriod for basketID ${basketId}: `, error);
        throw error;
    }
};

/**
 *
 * @param basketId
 * @returns {Promise<*>}
 */
const deleteBasketSalesPeriod = async (basketId) => {
    try {
        // Find the basket by ID
        const deletedBasketSalesPeriod = await BasketSalePeriod.destroy({
            where: {
                BasketId: basketId,
            },
        });

        logger.info(`BasketSalesPeriod deleted successfully: ${basketId}`);
        return deletedBasketSalesPeriod;
    } catch (error) {
        // Log the error and rethrow it
        logger.error(`Error deleting BasketSalesPeriod: `, error);
        throw error;
    }
};

module.exports = {
    requestProductsByAmap,
    requestProductDetails,
    insertNewProduct,
    updateProduct,
    upsertProductSalesPeriod,
    deleteProductSalesPeriod,
    requestBasketsByAmap,
    requestBasketDetails,
    insertNewBasket,
    updateBasket,
    upsertBasketSalesPeriod,
    deleteBasketSalesPeriod
};
