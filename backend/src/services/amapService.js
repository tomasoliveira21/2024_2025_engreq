const logger = require('../utils/logger');
const AMAPs = require('../domain/classes/AMAP');
const User = require('../domain/classes/User');

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


module.exports = {
    requestAmapsList
};
