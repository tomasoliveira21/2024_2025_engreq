const logger = require('../utils/logger');
const {
    requestSubscriptionList,
    requestSubscriptionHistory,
    insertNewOrderSubscription,
    updateSubscription,
    requestCartList,
    requestCartHistory,
    deleteCartItem,
    insertCartItem,
    updateCart,
    requestProducerKpis,
    requestCoproducerKpis
} = require('../services/subscriptionService');

const {
    requestProductDetails,
    requestBasketDetails, updateBasket, upsertBasketSalesPeriod, deleteBasketSalesPeriod
} = require('../services/productService');

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
        subscriptionList = await requestSubscriptionHistory(userEmail);

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

        subscriptionList = await requestSubscriptionList(userEmail);

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
const createOrderSubscription = async (req, res, next) => {

    // Logger
    logger.info(`Create new Order`);

    try {
        // Arguments
        const validPeriods = ['weekly', 'monthly', 'single purchase'];
        const validType = ['product', 'basket'];
        const { periodType, itemType, itemId, quantity} = req.body;
        const userId = req.user.user_id;
        let producerId;
        let price;
        let totalCost;

        // Validate data
        if (!periodType || !itemType || !itemId || !quantity) {
            logger.error('periodType, itemType, itemId and quantity are required.');
            return res.status(400).json({success: false, message: 'periodType, itemType, itemId and quantity are required.'});
        }

        // Validate periodType
        if (!validPeriods.includes(periodType)) {
            logger.error('Invalid periodType');
            return res.status(400).json({error: `Invalid periodType: '${periodType}'!!}.`});
        }

        // Validate periodType
        if (!validType.includes(itemType)) {
            logger.error('Invalid itemType');
            return res.status(400).json({error: `Invalid itemType: '${itemType}'!!}.`});
        }

        // Get product or basket details
        if (itemType === 'product') {
            const productData = await requestProductDetails(itemId);
            if (productData && productData.length > 0) {
                const productDetails = productData[0].get({ plain: true });
                price = productDetails.price;
                producerId = productDetails.Producer.id;
            }
            // Basket details
        } else if (itemType === 'basket') {
            const basketData = await requestBasketDetails(itemId);
            if (basketData && basketData.length > 0) {
                const basketDetails = basketData[0].get({ plain: true });
                price = basketDetails.price;
                producerId = basketDetails.Producer.id;
            }
        }

        if (!price || isNaN(price) || price <= 0) {
            logger.error('Invalid item price');
            return res.status(400).json({ error: "Invalid item price" });
        }

        if (!producerId || isNaN(producerId) || !Number.isInteger(Number(producerId))) {
            logger.error('Invalid item price');
            return res.status(400).json({ error: "Producer ID invalid, check the data!" });
        }

        // Calculate cost
        totalCost = quantity * price;

        // Insert order
        const orderData = { periodType, userId, totalCost, itemId, itemType, quantity, price, producerId};
        const newSubscription = await insertNewOrderSubscription(orderData);

        // Return response
        return res.status(201).json({
            success: true,
            message: 'Subscription order created successfully',
            subscription: newSubscription
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

/**
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const updateOrderSubscription = async (req, res, next) => {
    logger.info(`Update subscription data`);

    try {
        // Arguments
        const { id } = req.params;
        const { status } = req.body;
        const validStatus = ['pending', 'completed', 'cancelled'];

        if (!id) {
            logger.warn(`Subscription ID is missing`);
            return res.status(400).json({
                success: false,
                message: 'Subscription ID is required.'
            });
        }

        if (!validStatus.includes(status)) {
            logger.warn(`Invalid status`);
            return res.status(400).json({
                success: false,
                message: 'Invalid status option! Valid options: [pending, completed, cancelled]'
            });
        }

        // Filter out undefined or null fields
        const subscriptionData = {status};

        // Update subscription
        const updatedSubscription = await updateSubscription(id, subscriptionData);

        // Return response
        return res.status(201).json({
            success: true,
            message: 'Subscription updated successfully',
            basket: updatedSubscription,
        });
    } catch (err) {
        // Error handling
        logger.error(err);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
        });
    }
};

/**
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
const getCartList = async (req, res, next) => {
    logger.info(`Request getCartList`);

    try {
        const userEmail = req.user.email;
        let cartList;

        cartList = await requestCartList(userEmail);

        // Iterate data
        if (cartList.length > 0) {
            for (const cart of cartList) {
                // Products details
                if (cart.itemType === 'product') {
                    const productData = await requestProductDetails(cart.itemId);
                    if (productData && productData.length > 0) {
                        cart.dataValues.Product = productData[0].get({ plain: true });
                    }
                    // Basket details
                } else if (cart.itemType === 'basket') {
                    const basketData = await requestBasketDetails(cart.itemId);
                    if (basketData && basketData.length > 0) {
                        cart.dataValues.Basket = basketData[0].get({ plain: true });
                    }
                }
            }
        }

        // Logger
        logger.info("Returning data -> getCartList:", cartList);

        res.status(200).json({ Cart: cartList });
    } catch (error) {
        logger.error('Error in getCartList:', error);
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
const getCartHistory = async (req, res, next) => {
    logger.info(`Request getCartHistory`);
    try {
        const userEmail = req.user.email;
        let subscriptionList;

        // Consumer list
        subscriptionList = await requestCartHistory(userEmail);

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
        logger.info("Returning data -> getCartHistory:", subscriptionList);

        res.status(200).json({ cartHistory: subscriptionList });
    } catch (error) {
        logger.error('Error in getCartHistory:', error);
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
const deleteCartItemAction = async (req, res, next) => {
    // Logger
    logger.info(`Delete Cart Item`);

    try {
        // Arguments
        const { itemId } = req.params;

        // Delete Cart item
        const deletedCart = await deleteCartItem(itemId);

        // Return response
        return res.status(201).json({
            success: true,
            message: 'Cart item deleted successfully',
            cartItem: deletedCart
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

/**
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const addItemToCart = async (req, res, next) => {
    logger.info(`Add Item to Cart`);

    try {
        // Arguments
        const userId = req.user.user_id;
        const validType = ['product', 'basket'];
        const { itemType, itemId, quantity} = req.body;

        // Validate data
        if (!itemType || !itemId || !quantity) {
            logger.error('Missing mandatory fields to process! (itemType, itemId, quantity)');
            return res.status(400).json({success: false, message: 'Missing mandatory fields to process! (itemType, itemId, quantity)'});
        }

        // Validate periodType
        if (!validType.includes(itemType)) {
            logger.error('Invalid itemType');
            return res.status(400).json({error: `Invalid itemType: '${itemType}'!!}.`});
        }

        // Insert order
        const cartData = { itemType, itemId, quantity, userId};
        const newCartItem = await insertCartItem(cartData);

        // Return response
        return res.status(201).json({
            success: true,
            message: 'Cart item added successfully',
            subscription: newCartItem
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

/**
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const cartCheckout = async (req, res, next) => {
    logger.info(`Request cartCheckout`);

    try {
        const userEmail = req.user.email;
        const userId = req.user.user_id;
        let cartList;

        // Request cart list
        cartList = await requestCartList(userEmail);

        // Check cart
        if (cartList.length <= 0) {
            logger.error('Invalid checkout! Cart is empty.');
            return res.status(400).json({success: false, message: 'Invalid checkout! Cart is empty'});
        }

        // Let iterate cartList
        for (const cart of cartList) {
            // Variables
            let producerId;
            let price;
            let quantity = cart.quantity;
            let periodType = "single purchase";
            let itemId = cart.itemId;
            let itemType = cart.itemType;
            let cartId = cart.id;

            // Products details
            if (itemType === 'product') {
                const productData = await requestProductDetails(itemId);
                if (productData && productData.length > 0) {
                    const productDetails = productData[0].get({ plain: true });
                    price = productDetails.price;
                    producerId = productDetails.Producer.id;
                }
                // Basket details
            } else if (itemType === 'basket') {
                const basketData = await requestBasketDetails(itemId);
                if (basketData && basketData.length > 0) {
                    const basketDetails = basketData[0].get({ plain: true });
                    price = basketDetails.price;
                    producerId = basketDetails.Producer.id;
                }
            }

            // Calculate cost
            const totalCost = quantity * price;

            // Insert order
            const orderData = { periodType, userId , totalCost, itemId, itemType, quantity, price, producerId};
            const newOrderSubscription = await insertNewOrderSubscription(orderData);

            // Delete Cart item
            const deletedCart = await deleteCartItem(cartId);
        }

        return res.status(201).json({
            success: true,
            message: 'Cart checkout successfully',
        });
    } catch (error) {
        logger.error('Error in getCartList:', error);
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
const updateItemCart = async (req, res, next) => {
    logger.info(`Update cart item`);

    try {
        // Arguments
        const { itemId } = req.params;
        const { quantity } = req.body;

        if (!itemId) {
            logger.warn(`Cart item ID is missing`);
            return res.status(400).json({
                success: false,
                message: 'Cart item ID is required.'
            });
        }

        // Filter
        const cartData = {quantity};

        // Update cart
        const updatedCart = await updateCart(itemId, cartData);

        // Return response
        return res.status(201).json({
            success: true,
            message: 'Cart item updated successfully',
            basket: updatedCart,
        });
    } catch (err) {
        // Error handling
        logger.error(err);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
        });
    }
};

const getUserKpis = async (req, res, next) => {
    logger.info(`Request getUserKpis`);
    try {
        const userRole = req.user.role;
        const userEmail = req.user.email;
        let userKpis;

        // Producer KPIs
        if (userRole === 'Producer') {
            userKpis = await requestProducerKpis(userEmail);
        }
        // Coproducer KPIs
        else {
            userKpis = await requestCoproducerKpis(userEmail);
        }

        res.status(200).json({ kpis: userKpis });
    } catch (error) {
        next(error);
    }



};

module.exports = {
    getSubscriptionList,
    getSubscriptionHistory,
    createOrderSubscription,
    updateOrderSubscription,
    getCartList,
    deleteCartItemAction,
    getCartHistory,
    addItemToCart,
    cartCheckout,
    updateItemCart,
    getUserKpis
};
