const logger = require('../utils/logger');
const supabase = require('../utils/supabase');

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
    logger.info(`Fetching user products (AMAP: ${amapId})`);

    try {
        // TODO MOCK DATA
        return [
            { id: 101, name: "Batatas AMAP", description: "Batatas is a root vegetable", type: "Vegetable", price: 1.09, quantity: 20, producerId: 2 },
            { id: 102, name: "Cenouras AMAP", description: "Cenouras is a root vegetable", type: "Vegetable", price: 1.09, quantity: 20, producerId: 2 },
            { id: 103, name: "Carrot AMAP", description: "Carrot is a root vegetable", type: "Vegetable", price: 1.09, quantity: 20, producerId: 2 }
        ];

        // TODO FINISH QUERY
        // QUERY GET ALL APPROVE PRODUCTS AND RELATED WITH AMAP's THAT USER HAVE ACCESS
        const { data: userProducts, error } = await supabase
            .from('product')
            .select('product.*,  product_request(approve)')
            .eq('amap_id', amapId);

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
 * Product Details
 * @param productID
 * @returns {Promise<[{price: number, name: string, description: string, id: number},{price: number, name: string, description: string, id: number},{price: number, name: string, description: string, id: number}]|*|null>}
 */
const requestProductDetails = async (productID) => {
    logger.info(`Fetching product details (Product: ${productID})`);
    try {
        // TODO MOCK DATA
        return [
            { name: "Carrot", description: "Carrot is a root vegetable", type: "Vegetable", price: "1.09", quantity:"20" },
        ];

        // TODO FINISH QUERY
        // QUERY GET ALL APPROVE PRODUCTS AND RELATED WITH AMAP's THAT USER HAVE ACCESS
        const { data: userProducts, error } = await supabase
            .from('product')
            .select('product.*,  product_request(approva)')
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

module.exports = {
    requestProductsByUser,
    requestProductsByAmap,
    requestProductDetails
};
