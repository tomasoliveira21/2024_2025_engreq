const logger = require('../utils/logger');
const AMAPs = require('../domain/models/AMAP');
const User = require('../domain/models/User');
const Order = require('../domain/models/Order');
const { Sequelize } = require('sequelize');

/**
 * Get AMAPs List
 * @returns {Promise<*|*[]>}
 */
const requestAmapsList = async () => {
    logger.info('Requesting AMAPs list');

    try {
        // Fetch all AMAPs
        const amapList = await AMAPs.findAll({
            attributes: ['id', 'name', 'description', 'type', 'createdAt', 'updatedAt'], // Select relevant fields
        });

        // Empty AMAPs
        if (!amapList.length) {
            logger.warn('No AMAPs found');
            return [];
        }

        // Fetch all admin users
        const adminUsers = await User.findAll({
            attributes: ['id', 'email', 'name', 'AMAPId'],
            where: { role: 'AMAP Admin' },
        });

        // Empty users
        if (!adminUsers.length) {
            logger.warn('No admin users found');
        }

        // Combine data
        const result = amapList.map((amap) => {
            const adminsForThisAMAP = adminUsers.filter((user) => user.AMAPId === amap.id);

            return {
                ...amap.toJSON(),
                adminUsers: adminsForThisAMAP.map((user) => user.toJSON()),
            };
        });

        logger.info('Retrieve AMAPs list');
        return result;
    } catch (error) {
        // Detailed logging for better debugging
        logger.error('Error fetching AMAPs list', {message: error.message, stack: error.stack});
        return [];
    }
};

/**
 * AMAP Kpis
 * @param amapId
 * @returns {Promise<{orderCosts: {totalCostSum: number, paidCostSum: number}, orderCount: number}|{}>}
 */
const requestAmapsKpis = async (amapId) => {
    logger.info('Requesting AMAPs KPIs');
    let kpis = {}; // Initialize the kpis object

    try {
        // Fetch all AMAPs - Order Count
        const orderCount = await Order.count({
            include: [
                {
                    model: User,
                    include: [
                        {
                            model: User,
                            where: { AMAPId: amapId },
                            required: true,
                        },
                    ],
                },
            ]
        });
        kpis.orderCount = orderCount;

        // Order costs
        const orderCosts = await Order.findAll({
            attributes: [
                [Sequelize.fn('SUM', Sequelize.col('Order.totalCost')), 'totalCostSum'],
                [Sequelize.fn('SUM', Sequelize.col('Order.paidCost')), 'paidCostSum'],
            ],
            include: [
                {
                    model: Consumer,
                    attributes: [],
                    include: [
                        {
                            model: User,
                            attributes: [],
                            where: { AMAPId: amapId },
                            required: true,
                        }
                    ]
                }
            ],
            group: [],
            raw: true,
        });

        console.log("XXX orderCosts.>",orderCosts)

        // Extract sums from the orderCosts result
        if (orderCosts.length > 0) {
            const totalCostSum = parseFloat(orderCosts[0].totalCostSum.toFixed(2));
            const paidCostSum = parseFloat(orderCosts[0].paidCostSum.toFixed(2));
            kpis.orderCosts = {
                totalCostSum: totalCostSum || 0,
                paidCostSum: paidCostSum || 0
            };
        } else {
            kpis.orderCosts = { totalCostSum: 0, paidCostSum: 0 };
        }

        logger.info('Successfully retrieved AMAPs KPIs', { kpis });

        return kpis;
    } catch (error) {
        // Detailed logging for better debugging
        logger.error('Error fetching AMAPs KPIs', { message: error.message, stack: error.stack });
        return { orderCount: 0, orderCosts: { totalCostSum: 0, paidCostSum: 0 } }; // Return default values on error
    }
};


module.exports = {
    requestAmapsList,
    requestAmapsKpis
};
