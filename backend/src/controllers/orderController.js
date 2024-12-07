const logger = require('../utils/logger');
const { requestProducerOrderHistory, requestCoproducerOrderHistory,
    requestProducerSubscriptionHistory, requestCoproducerSubscriptionHistory, requestCoproducerSubscriptionAtive} = require('../services/orderService');
const { requestProductDetails, requestBasketDetails } = require('../services/productService');

/**
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
const getOrderHistory = async (req, res, next) => {
    logger.info(`Request getOrderHistory`);
    try {
        const userRole = req.user.role;
        const userEmail = req.user.email;
        let orderList;

        // Consumer list
        if (userRole === 'Producer') {
            orderList = await requestProducerOrderHistory(userEmail);
        }
        // CoProducer list
        else {
            orderList = await requestCoproducerOrderHistory(userEmail);
        }

        // Iterate data
        if (orderList.length > 0) {
            for (const order of orderList) {
                // Iterate order details
                for (const orderDetail of order.OrderDetails) {
                    // Products details
                    if (orderDetail.itemType === 'product') {
                        const productData = await requestProductDetails(orderDetail.itemId);
                        if (productData && productData.length > 0) {
                            orderDetail.dataValues.Product = productData[0].get({ plain: true });
                        }
                        // Basket details
                    } else if (orderDetail.itemType === 'basket') {
                        const basketData = await requestBasketDetails(orderDetail.itemId);
                        if (basketData && basketData.length > 0) {
                            orderDetail.dataValues.Basket = basketData[0].get({ plain: true });
                        }
                    }
                }
            }
        }

        // Logger
        logger.info("Returning data -> getOrderHistory:", orderList);

        res.status(200).json({ order: orderList });
    } catch (error) {
        logger.error('Error in getOrderHistory:', error);
        next(error);
    }
};

/**
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
const getSubscriptionHistory = async (req, res, next) => {
    logger.info(`Request getSubscriptionHistory`);
    try {
        const userRole = req.user.role;
        const userEmail = req.user.email;
        let subscriptionList;

        // Consumer list
        if (userRole === 'Producer') {
            subscriptionList = await requestProducerSubscriptionHistory(userEmail);
        }
        // CoProducer list
        else {
            subscriptionList = await requestCoproducerSubscriptionHistory(userEmail);
        }

        // Iterate data
        if (subscriptionList.length > 0) {
            for (const subscription of subscriptionList) {
                // Iterate order details
                for (const orderDetail of subscription.OrderDetails) {
                    // Products details
                    if (orderDetail.itemType === 'product') {
                        const productData = await requestProductDetails(orderDetail.itemId);
                        if (productData && productData.length > 0) {
                            orderDetail.dataValues.Product = productData[0].get({ plain: true });
                        }
                        // Basket details
                    } else if (orderDetail.itemType === 'basket') {
                        const basketData = await requestBasketDetails(orderDetail.itemId);
                        if (basketData && basketData.length > 0) {
                            orderDetail.dataValues.Basket = basketData[0].get({ plain: true });
                        }
                    }
                }
            }
        }

        // Logger
        logger.info("Returning data -> getSubscriptionHistory:", subscriptionList);

        res.status(200).json({ subscription: subscriptionList });
    } catch (error) {
        logger.error('Error in getSubscriptionHistory:', error);
        next(error);
    }
};

/**
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
const getSubscriptionList = async (req, res, next) => {
    logger.info(`Request getSubscriptionList`);
    try {
        const userRole = req.user.role;
        const userEmail = req.user.email;
        let subscriptionList;

        // Consumer list
        if (userRole === 'Producer') {
            return res.status(403).json({ error: "You do not have permission to access this resource." });
        }

        subscriptionList = await requestCoproducerSubscriptionAtive(userEmail);

        // Iterate data
        if (subscriptionList.length > 0) {
            for (const subscription of subscriptionList) {
                // Iterate order details
                for (const orderDetail of subscription.OrderDetails) {
                    // Products details
                    if (orderDetail.itemType === 'product') {
                        const productData = await requestProductDetails(orderDetail.itemId);
                        if (productData && productData.length > 0) {
                            orderDetail.dataValues.Product = productData[0].get({ plain: true });
                        }
                        // Basket details
                    } else if (orderDetail.itemType === 'basket') {
                        const basketData = await requestBasketDetails(orderDetail.itemId);
                        if (basketData && basketData.length > 0) {
                            orderDetail.dataValues.Basket = basketData[0].get({ plain: true });
                        }
                    }
                }
            }
        }

        // Logger
        logger.info("Returning data -> getSubscriptionList:", subscriptionList);

        res.status(200).json({ subscription: subscriptionList });
    } catch (error) {
        logger.error('Error in getSubscriptionList:', error);
        next(error);
    }
};


module.exports = {
    getOrderHistory,
    getSubscriptionList,
    getSubscriptionHistory,
};
