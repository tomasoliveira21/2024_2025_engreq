const logger = require('../utils/logger');
const { requestProducerOrderHistory, requestCoproducerOrderHistory,
    requestProducerSubscriptionHistory, requestCoproducerSubscriptionHistory,
    requestCoproducerSubscriptionAtive, insertNewSubscription} = require('../services/subscriptionService');
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


/**
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const createOrder = async (req, res, next) => {

    // Logger
    logger.info(`Create new Order`);

    try {
        // Arguments
        const validPeriods = ['weekly', 'monthly', 'single purchase'];
        const { periodType, itemType, itemId, quantity, startDate, endDate} = req.body;
        const coproducerId = req.user.coproducer[0].id;
        let newSubscription;

        // Validate data
        if (!periodType || !itemType || !itemId || !quantity) {
            logger.error('periodType, itemType, itemId and quantity are required.');
            return res.status(400).json({success: false, message: 'periodType, itemType, itemId and quantity are required.'});
        }

        // Validate periodType
        if (!validPeriods.includes(periodType)) {
            return res.status(400).json({error: `Invalid periodType: '${periodType}'!!}.`});
        }

        // Subscription
        if (periodType !== 'single purchase')
        {
            // Validate startDate and endDate
            if (!startDate || !endDate || !isValidDate(startDate) || !isValidDate(endDate)) {
                logger.error('startDate and endDate are invalid! check value!');
                return res.status(400).json({error: 'startDate and endDate are invalid! check value!'});
            }

            // Insert new subscription
            const newSubscription = await insertNewSubscription(startDate, endDate);
        }

        // Data
        const orderData = { periodType, coproducerId };

        // Insert Order
        const newOrder = await insertNewOrder(orderData);

        // Return response
        return res.status(201).json({
            success: true,
            message: 'Order created successfully',
            product: newOrder
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
    getOrderHistory,
    getSubscriptionList,
    getSubscriptionHistory,
    createOrder
};
