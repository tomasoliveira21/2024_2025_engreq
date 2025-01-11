const logger = require('../utils/logger');
const AMAPs = require('../domain/models/AMAP');
const User = require('../domain/models/User');
const Order = require('../domain/models/Order');
const SalePeriod = require('../domain/models/SalePeriod');
const DeliveryDate = require('../domain/models/DeliveryDate');
const { Sequelize } = require('sequelize');
const OrderDetails = require("../domain/models/OrderDetails");
const Producer = require("../domain/models/Producer");

/**
 * LIST
 */

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
 * KPIS
 */

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
                    where: { AMAPId: amapId },
                    required: true,
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
                    model: User,
                    attributes: [],
                    where: { AMAPId: amapId },
                    required: true,
                }
            ],
            group: [],
            raw: true,
        });

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

/**
 * SEASONS
 */

/**
 *
 * @param amapId
 * @returns {Promise<*|*[]>}
 */
const requestAmapSeason = async (amapId) => {

    logger.info(`Fetching AMAP season (AMAP: ${amapId})`);

    try {
        // Query data
        const amapSeason = await SalePeriod.findAll({
            attributes: ['id', 'name', 'startDate', 'endDate', 'season'],
            where: {
                AMAPId: amapId,
            },
            include: [
                {
                    model: DeliveryDate,
                    attributes: ['date'],
                    required: false,
                }
            ],
        });

        // Logger
        logger.info(`Retrieved AMAP season: ${JSON.stringify(amapSeason)}`);

        return amapSeason;
    } catch (error) {
        logger.error('Error fetching AMAP season:', error.message);
        return [];
    }
};

/**
 *
 * @param seasonData
 * @returns {Promise<*>}
 */
const insertNewSeason = async (seasonData) => {
    logger.info('Insert new Season');

    try {
        // Create a new season
        const newSeason = await SalePeriod.create({
            name: seasonData.name,
            season: seasonData.season,
            startDate: seasonData.startDate,
            endDate: seasonData.endDate,
            createdAt: new Date(),
            updatedAt: new Date(),
            AMAPId: seasonData.amapId,
        });

        logger.info('Season created successfully:', newSeason);
        return newSeason;
    } catch (error) {
        logger.error('Error creating new season:', error);
        throw error;
    }
};

/**
 *
 * @param seasonId
 * @returns {Promise<{message: string}>}
 */
const deleteSeason = async (seasonId) => {
    logger.info(`Delete season (Season: ${seasonId})`);

    try {
        // Find the season by ID
        const season = await SalePeriod.findByPk(seasonId);

        if (!season) {
            const errorMessage = `Season with ID ${seasonId} not found`;
            logger.warn(errorMessage);
            throw new Error(errorMessage);
        }

        // Delete the season
        await season.destroy();

        logger.info(`Season deleted successfully: ${seasonId} `);
        return season;
    } catch (error) {
        logger.error('Error deleting season:', error);
        throw error;
    }
};

/**
 *
 * @param seasonId
 * @param seasonData
 * @returns {Promise<*|null>}
 */
const updateSeason = async (seasonId, seasonData) => {
    try {
        // Find the season by ID
        const season = await SalePeriod.findByPk(seasonId);

        // Not found
        if (!season) {
            logger.warn(`Season with ID ${seasonId} not found`);
            return null;
        }

        // Update data
        const updatedSeason = await season.update({
            name: seasonData.name,
            startDate: seasonData.startDate,
            endDate: seasonData.endDate,
            season: seasonData.season,
            updatedAt: new Date(),
        });

        logger.info(`Season updated successfully: ${seasonId}`);
        return updatedSeason;
    } catch (error) {
        // Log the error and rethrow it
        logger.error(`Error updating season: `, error);
        throw error;
    }
};

/**
 *
 * @param amapId
 * @param name
 * @returns {Promise<boolean>}
 */
const checkSeasonName = async (amapId, name) => {
    logger.info(`Check if season name exist: ${name}`);

    try {
        // Find the season by name
        const season = await SalePeriod.findOne({
            where: {
                AMAPId: amapId,
                name: name,
            }
        });

        return !!season;
    } catch (error) {
        // Log the error and rethrow it
        logger.error(`Error checking if season name exist: `, error);
        throw error;
    }
};

/**
 *
 * @param seasonData
 * @returns {Promise<*>}
 */
const insertDeliveryDates = async (seasonData) => {
    logger.info('Insert Delivery dates');

    try {
        // Create a new season
        const newDeliveryDate = await DeliveryDate.create({
            date: seasonData.currentDate,
            longitude: seasonData.longitude,
            latitude: seasonData.latitude,
            location: seasonData.location,
            createdAt: new Date(),
            updatedAt: new Date(),
            SalePeriodId: seasonData.salesPeriodId,
        });

        logger.info('Delivery date created successfully:', newDeliveryDate);
        return newDeliveryDate;
    } catch (error) {
        logger.error('Error creating new delivery date:', error);
        throw error;
    }
};

/**
 *
 * @param amapId
 * @returns {Promise<*|null>}
 */
const requestAmapProfile = async (amapId) => {
    try {
        // GET AMAP
        const amapProfile = await AMAPs.findByPk(amapId);

        logger.info(`AMAP Profile successfully: ${amapId}`);
        return amapProfile;
    } catch (error) {
        // Log the error and rethrow it
        logger.error(`Error updating season: `, error);
        throw error;
    }
};

/**
 *
 * @param amapId
 * @param amapData
 * @returns {Promise<*|null>}
 */
const updateAmap = async (amapId, amapData) => {
    try {
        // Find the season by ID
        const amapProfile = await AMAPs.findByPk(amapId);

        // Not found
        if (!amapProfile) {
            logger.warn(`AMAP with ID ${amapId} not found`);
            return null;
        }

        // Build the update object dynamically
        const updateFields = {};
        if (amapData.name !== undefined) updateFields.name = amapData.name;
        if (amapData.description !== undefined) updateFields.description = amapData.description;

        // Update data
        const updatedAmap = await amapProfile.update(updateFields);

        logger.info(`AMAP Profile updated successfully: ${amapId}`);
        return updatedAmap;
    } catch (error) {
        // Log the error and rethrow it
        logger.error(`Error updating season: `, error);
        throw error;
    }
};

/**
 *
 * @param amapId
 * @returns {Promise<*>}
 */
const requestProducerAccountBalance = async (amapId) => {
    try {
        // GET Account Balance
        const producerAccount = await Order.findAll({
            attributes: [
                [Sequelize.fn('SUM', Sequelize.col('Order.totalCost')), 'totalCostSum'],
                [Sequelize.fn('SUM', Sequelize.col('Order.paidCost')), 'paidCostSum'],
                [Sequelize.fn('SUM', Sequelize.col('Order.paidCost')), 'pendingValue'],
            ],
            where: {
                status: 'in-progress',
                paidCost: { [Sequelize.Op.gt]: 0 }
            },
            include: [{
                model: OrderDetails,
                attributes: [],
                include: [{
                    model: Producer,
                    attributes: ['id', 'businessName', 'description'],
                    include: [{
                        model: User,
                        attributes: ['id', 'email', 'nif', 'name'],
                        where: {
                            AMAPId: amapId,
                        },
                    }],
                }],
            }],
            group: [
                'OrderDetails->Producer->User.id',
                'OrderDetails->Producer.id'
            ],
            order: [[Sequelize.col('OrderDetails->Producer->User.id'), 'ASC']],
            raw: true,
            nest: true,
        });

        // Adjust response
        const formattedResults = producerAccount.map(entry => ({
            totalCostSum        : entry.totalCostSum,
            paidCostSum         : entry.paidCostSum,
            pendingValue        : entry.pendingValue,
            User                : {
                id              : entry.OrderDetails.Producer.User.id,
                email           : entry.OrderDetails.Producer.User.email,
                nif             : entry.OrderDetails.Producer.User.nif,
                name            : entry.OrderDetails.Producer.User.name,
            },
            Producer            : {
                id              : entry.OrderDetails.Producer.id,
                businessName    : entry.OrderDetails.Producer.businessName,
                description     : entry.OrderDetails.Producer.description,
            }
        }));

        logger.info(`Request Producer Account Balance AMAP: ${amapId}`);
        return formattedResults;
    } catch (error) {
        // Log the error and rethrow it
        logger.error(`Error requesting Producer Account Balance AMAP: `, error);
        throw error;
    }
};

/**
 *
 * @param amapId
 * @returns {Promise<*>}
 */
const requestCoproducerAccountBalance = async (amapId) => {
    try {
        // GET Account Balance
        const coproducerAccount = await Order.findAll({
            attributes: [
                [Sequelize.fn('SUM', Sequelize.col('Order.totalCost')), 'totalCostSum'],
                [Sequelize.fn('SUM', Sequelize.col('Order.paidCost')), 'paidCostSum'],
                [Sequelize.literal('SUM("Order"."totalCost") - SUM("Order"."paidCost")'), 'pendingValue'],
            ],
            where: {
                status: 'in-progress',
            },
            include: [{
                model: User,
                attributes: ['id', 'email', 'nif', 'name'],
                where: {
                    AMAPId: amapId,
                },
            }],
            group: ['User.id'],
            having: Sequelize.literal('SUM("Order"."totalCost") - SUM("Order"."paidCost") > 0'),
            order: [[Sequelize.col('User.id'), 'ASC']],
        });

        logger.info(`Request CoProducer Account Balance AMAP: ${amapId}`);
        return coproducerAccount;
    } catch (error) {
        // Log the error and rethrow it
        logger.error(`Error requesting CoProducer Account Balance AMAP: `, error);
        throw error;
    }
};

module.exports = {
    requestAmapsList,
    requestAmapsKpis,
    requestAmapSeason,
    insertNewSeason,
    insertDeliveryDates,
    deleteSeason,
    updateSeason,
    checkSeasonName,
    requestAmapProfile,
    updateAmap,
    requestProducerAccountBalance,
    requestCoproducerAccountBalance
};
