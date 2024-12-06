const logger = require('../utils/logger');
const { requestProducerPaymentList, requestCoproducerPaymentList } = require('../services/paymentService');

/**
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
const getPaymentList = async (req, res, next) => {
    logger.info(`Request getOrderList`);
    try {
        // Variables
        const userRole = req.user.role;
        const userEmail = req.user.email;
        const userAmpId = req.user.amapId;
        let paymentList;

        // Consumer list
        if (userRole === 'Producer') {
            paymentList = await requestProducerPaymentList(userAmpId);
        }
        // Producer list
        else {
            paymentList = await requestCoproducerPaymentList(userEmail);
        }

        res.status(200).json({ payment: paymentList });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getPaymentList
};
