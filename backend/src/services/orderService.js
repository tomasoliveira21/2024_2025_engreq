const logger = require('../utils/logger');
const Order = require('../domain/models/Order');
const User = require('../domain/models/User');
const Consumer = require('../domain/models/Consumer');

/**
 * Get Producer order List
 * @returns {Promise<*|*[]>}
 */
const requestProducerOrderList = async () => {
    logger.info('Requesting Producer Order list');

    try {
        // Fetch orders
        // Query data
        // TODO Producer orders
        const orderList = await Order.findAll({

        });

        logger.info('Retrieve Producer order list');
        return orderList;
    } catch (error) {
        // Detailed logging for better debugging
        logger.error('Error fetching Producer order list', {message: error.message, stack: error.stack});
        return [];
    }
};

/**
 * Get CoProducer order list
 * @returns {Promise<*|*[]>}
 */
const requestCoproducerOrderList = async (userEmail) => {
    logger.info('Requesting CoProducer Order list');

    try {
        // Fetch orders
        // Query data
        // TODO CoProducer orders
        const orderList = await Order.findAll({
            include: [
                {
                    model: Consumer,
                    required: true,
                    attributes: ['id'],
                    include: [
                        {
                            model: User,
                            required: true,
                            attributes: ['id','email','name','nif','role'],
                            where: { email: userEmail }
                        }
                    ]
                }
            ]
        });

        logger.info('Retrieve CoProducer order list');
        return orderList;
    } catch (error) {
        // Detailed logging for better debugging
        logger.error('Error fetching CoProducer order list', {message: error.message, stack: error.stack});
        return [];
    }
};

module.exports = {
    requestProducerOrderList,
    requestCoproducerOrderList
};
