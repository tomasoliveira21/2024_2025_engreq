const logger = require('../utils/logger');
const { requestProducerOrderList, requestCoproducerOrderList} = require('../services/orderService');

/**
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
const getOrderList = async (req, res, next) => {
    logger.info(`Request getOrderList`);
    try {
        const userRole = req.user.role;
        const userEmail = req.user.email;
        let orderList;

        // Consumer list
        if (userRole === 'Producer') {
            orderList = await requestProducerOrderList();
        }
        // Producer list
        else {
            orderList = await requestCoproducerOrderList(userEmail);
        }

        res.status(200).json({ order: orderList });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getOrderList
};
