const logger = require('../utils/logger');
const supabase = require('../utils/supabase');
const Product = require('../domain/classes/Product');
const Producer = require('../domain/classes/Producer');
const User = require('../domain/classes/User');

/**
 * Get user products
 * All the products related with AMAP's that user have access
 * @param userId
 * @returns {Promise<[{price: number, name: string, description: string, id: number},{price: number, name: string, description: string, id: number},{price: number, name: string, description: string, id: number}]|*|null>}
 */
const requestProductsByUser = async (userId) => {
    logger.info(`Fetching user products (User: ${userId})`);

    try {
        // TODO MOCK DATA
        return [
            { id: 1, name: "Batatas", description: "Batatas is a root vegetable", type: "Vegetable", price: 1.09, quantity: 20, producerId: 2 },
            { id: 2, name: "Cenouras", description: "Cenouras is a root vegetable", type: "Vegetable", price: 1.09, quantity: 20, producerId: 3 },
            { id: 3, name: "Carrot", description: "Carrot is a root vegetable", type: "Vegetable", price: 1.09, quantity: 20, producerId: 2 }
        ];

        // TODO FINISH QUERY
        // QUERY GET ALL APPROVE PRODUCTS AND RELATED WITH AMAP's THAT USER HAVE ACCESS
        const { data: userProducts, error } = await supabase
            .from('product')
            .select('product.*,  product_request(approve)')
            .eq('user_id', userId);

        if (error) {
            logger.error(`Error fetching user from Supabase: ${error.message}`);
            return null;
        }

        return userProducts;

    } catch (err) {
        logger.error(`Unexpected error fetching user info: ${err.message}`);
        return null;
    }
};

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
                    required: true,
                    include: [
                        {
                            model: User,
                            attributes: ['id', 'email', 'nif', 'AMAPId'],
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
                    required: true,
                    include: [
                        {
                            model: User,
                            attributes: ['id', 'email', 'nif', 'AMAPId'],
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
    logger.info(`insertNewProduct`);

    // Data to insert
    const { name, description, type, price, producerId } = productData;

    try {
        // Insert product
        const { data, error } = await supabase
            .from('products')
            .insert([
                {
                    name,
                    description,
                    type,
                    price,
                    producer_id: producerId
                }
            ])
            .single();

        if (error) {
            throw new Error(error.message);
        }

        // Return the created product
        return data;
    } catch (err) {
        throw new Error(`Failed to create product: ${err.message}`);
    }
};

module.exports = {
    requestProductsByUser,
    requestProductsByAmap,
    requestProductDetails,
    insertNewProduct
};
