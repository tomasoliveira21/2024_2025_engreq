const logger = require('../utils/logger');
const Order = require('../domain/models/Order');
const OrderDetails = require('../domain/models/OrderDetails');
const User = require('../domain/models/User');
const Subscription = require('../domain/models/Subscription');
const { Op } = require('sequelize');

/**
 *
 * @param userEmail
 * @returns {Promise<*|*[]>}
 */
const requestSubscriptionHistory = async (userEmail) => {
    logger.info('Requesting subscription history');

    try {
        // Fetch orders with order details, consumer, and user
        const subscriptionList = await Order.findAll({
            attributes: ['id', 'periodType', 'totalCost', 'paidCost', 'orderDate', 'status'],
            where: {
                periodType: {
                    [Op.ne]: 'single purchase'
                },
                status: {
                    [Op.or]: ['completed', 'cancelled']
                }
            },
            include: [
                {
                    model: Subscription,
                    attributes: ['startDate', 'endDate'],
                    required: false,
                },
                {
                    model: User,
                    required: true,
                    attributes: [],
                    where: { email: userEmail }
                },
                {
                    model: OrderDetails,
                    required: true,
                    attributes: ['id', 'itemType', 'itemId', 'quantity', 'price'],
                }
            ]
        });

        logger.info('Retrieve subscription history list');
        return subscriptionList;
    } catch (error) {
        // Detailed logging for better debugging
        logger.error('Error fetching subscription history list', { message: error.message, stack: error.stack });
        return [];
    }
};

/**
 *
 * @param userEmail
 * @returns {Promise<*|*[]>}
 */
const requestSubscriptionList = async (userEmail) => {
    logger.info('Requesting subscription list');

    try {
        // Fetch subscription list
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
                    attributes: ['startDate', 'endDate'],
                    required: false,
                },
                {
                    model: User,
                    required: true,
                    attributes: [],
                    where: { email: userEmail }
                },
                {
                    model: OrderDetails,
                    required: true,
                    attributes: ['id', 'itemType', 'itemId', 'quantity', 'price'],
                }
            ]
        });

        logger.info('Retrieve subscription list');
        return subscriptionList;
    } catch (error) {
        // Detailed logging for better debugging
        logger.error('Error fetching subscription list', { message: error.message, stack: error.stack });
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

/**
 *
 * @param subscriptionId
 * @param subscriptionData
 * @returns {Promise<*|null>}
 */
const updateSubscription = async (subscriptionId, subscriptionData) => {
    try {
        // Find the basket by ID
        const subscription = await Order.findByPk(subscriptionId);

        // Not found
        if (!subscription) {
            logger.warn(`Order (Subscription) with ID ${subscriptionId} not found`);
            return null;
        }

        // Build the update object dynamically
        const updateFields = {};
        if (subscriptionData.status !== undefined) updateFields.status = subscriptionData.status;
        updateFields.updatedAt = new Date();

        // Update data
        const updatedSubscription = await subscription.update(updateFields);

        logger.info(`Order (Subscription) updated successfully: ${subscriptionId}`);
        return updatedSubscription;
    } catch (error) {
        // Log the error and rethrow it
        logger.error(`Error updating subscription: `, error);
        throw error;
    }
};

module.exports = {
    requestSubscriptionList,
    requestSubscriptionHistory,
    insertNewOrderSubscription,
    updateSubscription
};
