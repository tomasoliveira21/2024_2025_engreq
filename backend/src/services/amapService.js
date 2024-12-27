const logger = require('../utils/logger');
const AMAPs = require('../domain/models/AMAP');
const User = require('../domain/models/User');
const Order = require('../domain/models/Order');
const SalePeriod = require('../domain/models/SalePeriod');
const { Sequelize } = require('sequelize');

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
            }
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

module.exports = {
    requestAmapsList,
    requestAmapsKpis,
    requestAmapSeason,
    insertNewSeason,
    deleteSeason,
    updateSeason,
    checkSeasonName
};
