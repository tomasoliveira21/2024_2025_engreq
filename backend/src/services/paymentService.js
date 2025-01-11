const logger = require('../utils/logger');
const Payment = require('../domain/models/Payment');
const User = require('../domain/models/User');

/**
 *
 * @param userEmail
 * @returns {Promise<*|*[]>}
 */
const requestUserPaymentList = async (userEmail) => {
    logger.info('Requesting User Payment list');

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

        logger.info('Retrieve User Payment list');
        return paymentList;
    } catch (error) {
        // Detailed logging for better debugging
        logger.error('Error fetching User Payment list', {message: error.message, stack: error.stack});
        return [];
    }
};

/**
 *
 * @param paymentData
 * @returns {Promise<*>}
 */
const insertNewPayment = async (paymentData) => {
    // Logger
    logger.info(`Insert new payment`);

    try {
        // Create a new payment
        const newPayment = await Payment.create({
            amount: paymentData.amount,
            currency: paymentData.currency,
            method: paymentData.method,
            status: paymentData.status,
            timestamp: new Date(),
            createdAt: new Date(),
            updatedAt: new Date(),
            userId: paymentData.userId,
            orderId: paymentData.orderId,
        });

        logger.log('Payment created successfully:', newPayment);
        return newPayment;
    } catch (error) {
        logger.error('Error creating new payment:', error);
        throw error;
    }
};

module.exports = {
    requestUserPaymentList,
    insertNewPayment
};
