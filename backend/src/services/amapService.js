const logger = require('../utils/logger');
const AMAPs = require('../domain/classes/AMAP');

/**
 * Get all AMAP's from the database
 * @returns {Promise<*|*[]>}
 */
const requestAllAmaps = async () => {
    logger.info(`Request AMAP data`);

    try {
        // Query data
        const amapData = await AMAPs.findAll();

        // Logger
        logger.info(`Retrieved AMAP data: ${JSON.stringify(amapData)}`);

        return amapData;
    } catch (error) {
        logger.error('Error fetching AMAP data:', error.message);
        return [];
    }
};

/**
 * Get user AMAPs
 * @returns {Promise<*|*[]>}
 */
const requestUserAmaps = async () => {
    logger.info(`Request user AMAP data`);

    try {
        // Query data
        const amapData = await AMAPs.findAll();

        // Logger
        logger.info(`Retrieved user AMAP data: ${JSON.stringify(amapData)}`);

        return amapData;
    } catch (error) {
        logger.error('Error fetching user AMAP data:', error.message);
        return [];
    }
};

module.exports = {
    requestAllAmaps,
    requestUserAmaps
};
