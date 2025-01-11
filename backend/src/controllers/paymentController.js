const logger = require('../utils/logger');
const {
    requestUserPaymentList,
    insertNewPayment
} = require('../services/paymentService');
const {
    updateSubscription,
    requestOrderDetails,
} = require('../services/subscriptionService');

/**
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
const getUserPaymentList = async (req, res, next) => {
    logger.info(`Request getUserPaymentList`);
    try {
        // Variables
        const userEmail = req.user.email;

        // Payment list
        const paymentList = await requestUserPaymentList(userEmail);

        res.status(200).json({ payment: paymentList });
    } catch (error) {
        next(error);
    }
};

/**
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const addUserPayment = async (req, res, next) => {
    logger.info(`Add user payment`);
    try {
        // Arguments
        const { amount, orderId } = req.body;
        const userId = req.user.user_id;
        const currency = 'EUR';
        const method = 'credit_card';
        const status = 'completed';
        const paidCost = amount;

        // Validate data
        if (!amount || !orderId ) {
            logger.warn(`Missing mandatory fields to insert payment`);
            return res.status(400).json({
                success: false,
                message: 'Ammount and orderId are required.'
            });
        }

        // Data
        const paymentData = { amount, orderId, currency, method, status, userId};

        // Insert Payment
        const newPayment = await insertNewPayment(paymentData);

        // Get order details
        //const orderDetails = await requestOrderDetails(orderId);
        // TODO GET actual paid value and add amount

        // Update order Paid value
        const subscriptionData = { paidCost };
        const updatedSubscription = await updateSubscription(orderId, subscriptionData);

        // Return response
        return res.status(201).json({
            success: true,
            message: 'Payment created successfully',
            payment: newPayment
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

module.exports = {
    getUserPaymentList,
    addUserPayment
};
