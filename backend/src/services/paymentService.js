const logger = require('../utils/logger');
const Payment = require('../domain/models/Payment');
const User = require('../domain/models/User');

/**
 * Get Producer order List
 * @returns {Promise<*|*[]>}
 */
const requestProducerPaymentList = async (amapId) => {
    logger.info('Requesting Producer Payment list');

    try {
        // Fetch payments
        // Query data
        const paymentList = await Payment.findAll({
            include: [
                {
                    model: User,
                    required: true,
                    attributes: ['id', 'email', 'name','role','AMAPId'],
                    where: { AMAPId: amapId }
                }
            ]
        });

        logger.info('Retrieve CoProducer Payment list');
        return paymentList;
    } catch (error) {
        // Detailed logging for better debugging
        logger.error('Error fetching CoProducer Payment list', {message: error.message, stack: error.stack});
        return [];
    }
};

/**
 *
 * @param userEmail
 * @returns {Promise<*|*[]>}
 */
const requestCoproducerPaymentList = async (userEmail) => {
    logger.info('Requesting CoProducer Payment list');

    try {
        // Fetch payments
        // Query data
        const paymentList = await Payment.findAll({
            include: [
                {
                    model: User,
                    required: true,
                    attributes: ['id', 'email', 'name','role','AMAPId'],
                    where: { email: userEmail }
                }
            ]
        });

        logger.info('Retrieve CoProducer Payment list');
        return paymentList;
    } catch (error) {
        // Detailed logging for better debugging
        logger.error('Error fetching CoProducer Payment list', {message: error.message, stack: error.stack});
        return [];
    }
};

module.exports = {
    requestProducerPaymentList,
    requestCoproducerPaymentList
};
