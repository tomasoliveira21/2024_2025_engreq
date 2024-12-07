const logger = require('../utils/logger');
const Order = require('../domain/models/Order');
const OrderDetails = require('../domain/models/OrderDetails');
const User = require('../domain/models/User');
const Consumer = require('../domain/models/Consumer');
const Producer = require('../domain/models/Producer');
const Subscription = require('../domain/models/Subscription');
const { Op } = require('sequelize');

/**
 * Get Producer order List
 * @returns {Promise<*|*[]>}
 */
const requestProducerOrderHistory = async (userEmail) => {
    logger.info('Requesting Producer Order history');

    try {
        // Fetch orders
        // Query data
        const orderList = await Order.findAll({
            attributes: ['id', 'periodType', 'totalCost', 'paidCost', 'orderDate', 'status'],
            where: { periodType: "single purchase", status :"completed" },
            include: [
                {
                    model: OrderDetails,
                    include: [
                        {
                            model: Producer,
                            include: [
                                {
                                    model: User,
                                    where: { email: userEmail },
                                    required: true,
                                }
                            ]
                        }
                    ]
                }
            ]
        });

        logger.info('Retrieve Producer order history list');
        return orderList;
    } catch (error) {
        // Detailed logging for better debugging
        logger.error('Error fetching Producer order history list', {message: error.message, stack: error.stack});
        return [];
    }
};

/**
 * Get CoProducer order list
 * @returns {Promise<*|*[]>}
 */
const requestCoproducerOrderHistory = async (userEmail) => {
    logger.info('Requesting CoProducer Order history');

    try {
        // Fetch orders with order details, consumer, and user
        const orderList = await Order.findAll({
            attributes: ['id', 'periodType', 'totalCost', 'paidCost', 'orderDate', 'status'],
            where: { periodType: "single purchase", status :"completed" },
            include: [
                {
                    model: Consumer,
                    required: true,
                    attributes: [],
                    include: [
                        {
                            model: User,
                            required: true,
                            attributes: ['id', 'email', 'name', 'nif', 'role'],
                            where: { email: userEmail }
                        }
                    ]
                },
                {
                    model: OrderDetails,
                    required: true,
                    attributes: ['id', 'itemType', 'itemId'],
                }
            ]
        });

        logger.info('Retrieve CoProducer order history list');
        return orderList;
    } catch (error) {
        // Detailed logging for better debugging
        logger.error('Error fetching CoProducer order history list', { message: error.message, stack: error.stack });
        return [];
    }
};

/**
 *
 * @param userEmail
 * @returns {Promise<*|*[]>}
 */
const requestProducerSubscriptionHistory = async (userEmail) => {
    logger.info('Requesting Producer subscription history');

    try {
        // Fetch orders
        // Query data
        const orderList = await Order.findAll({
            attributes: ['id', 'periodType', 'totalCost', 'paidCost', 'orderDate', 'status'],
            where: {
                periodType: {
                    [Op.ne]: 'single purchase'
                },
                status: "completed"
            },
            include: [
                {
                    model: OrderDetails,
                    include: [
                        {
                            model: Producer,
                            include: [
                                {
                                    model: User,
                                    where: { email: userEmail },
                                    required: true,
                                }
                            ]
                        }
                    ]
                }
            ],
        });

        logger.info('Retrieve Producer subscription history list');
        return orderList;
    } catch (error) {
        // Detailed logging for better debugging
        logger.error('Error fetching Producer subscription history list', {message: error.message, stack: error.stack});
        return [];
    }
};

/**
 *
 * @param userEmail
 * @param status
 * @returns {Promise<*|*[]>}
 */
const requestCoproducerSubscriptionHistory = async (userEmail) => {
    logger.info('Requesting CoProducer subscription history');

    try {
        // Fetch orders with order details, consumer, and user
        const subscriptionList = await Order.findAll({
            attributes: ['id', 'periodType', 'totalCost', 'paidCost', 'orderDate', 'status'],
            where: {
                periodType: {
                    [Op.ne]: 'single purchase'
                },
                status: "completed"
            },
            include: [
                {
                    model: Consumer,
                    required: true,
                    attributes: [],
                    include: [
                        {
                            model: User,
                            required: true,
                            attributes: ['id', 'email', 'name', 'nif', 'role'],
                            where: { email: userEmail }
                        }
                    ]
                },
                {
                    model: OrderDetails,
                    required: true,
                    attributes: ['id', 'itemType', 'itemId'],
                }
            ]
        });

        logger.info('Retrieve CoProducer subscription history list');
        return subscriptionList;
    } catch (error) {
        // Detailed logging for better debugging
        logger.error('Error fetching CoProducer subscription history list', { message: error.message, stack: error.stack });
        return [];
    }
};

/**
 *
 * @param userEmail
 * @returns {Promise<*|*[]>}
 */
const requestCoproducerSubscriptionAtive = async (userEmail) => {
    logger.info('Requesting CoProducer subscription');

    try {
        // Fetch orders with order details, consumer, and user
        const subscriptionList = await Order.findAll({
            attributes: ['id', 'periodType', 'totalCost', 'paidCost', 'orderDate', 'status'],
            where: {
                periodType: {
                    [Op.ne]: 'single purchase'
                },
                status: "pending"
            },
            include: [
                {
                    model: Subscription,
                    required: false,
                },
                {
                    model: Consumer,
                    required: true,
                    attributes: [],
                    include: [
                        {
                            model: User,
                            required: true,
                            attributes: ['id', 'email', 'name', 'nif', 'role'],
                            where: { email: userEmail }
                        }
                    ]
                },
                {
                    model: OrderDetails,
                    required: true,
                    attributes: ['id', 'itemType', 'itemId'],
                }
            ]
        });

        logger.info('Retrieve CoProducer subscription list');
        return subscriptionList;
    } catch (error) {
        // Detailed logging for better debugging
        logger.error('Error fetching CoProducer subscription list', { message: error.message, stack: error.stack });
        return [];
    }
};

/**
 * Insert new order subscription
 * @param orderData
 * @returns {Promise<*>}
 */
const insertNewOrderSubscription = async (orderData) => {
    // Logger
    logger.info(`Insert new order subscription`);

    try {
        // Create subscription
        const newSubscription = await Order.create({
            periodType: orderData.periodType,
            totalCost: orderData.totalCost,
            paidCost: 0,
            status: 'pending',
            orderDate: new Date(),
            createdAt: new Date(),
            updatedAt: new Date(),
            consumerId: orderData.coproducerId,
        });

        // Create order details
        const newOrderDetails = await OrderDetails.create({
            orderId: newSubscription.id,
            itemId: orderData.itemId,
            itemType: orderData.itemType,
            quantity: orderData.quantity,
            price: orderData.quantity,
            producerId: orderData.producerId,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        logger.log('Order subscription created successfully:', newSubscription);
        return newSubscription;
    } catch (error) {
        logger.error('Error creating new order subscription:', error);
        throw error;
    }
};


module.exports = {
    requestProducerOrderHistory,
    requestCoproducerOrderHistory,
    requestProducerSubscriptionHistory,
    requestCoproducerSubscriptionHistory,
    requestCoproducerSubscriptionAtive,
    insertNewOrderSubscription
};
