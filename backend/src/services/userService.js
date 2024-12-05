const logger = require('../utils/logger');
const User = require('../domain/classes/User');
const Producer = require("../domain/classes/Producer");

/**
 * Get user data
 * @param userEmail
 * @returns {Promise<*|*[]>}
 */
const getUserData = async (userEmail) => {
    logger.info(`Fetching data user: `, userEmail);

    try {
        // Query data
        const userData = await User.findOne({
            attributes: ['email', 'role', 'AMAPId'], // Only select these columns
            where: {
                email: userEmail,
            },
        });

        // Logger
        logger.info(`Retrieved user data: ${JSON.stringify(userData)}`);

        return userData;
    } catch (error) {
        logger.error('Error fetching user data:', error.message);
        return [];
    }
};

/**
 * Get producer details
 * @param userEmail
 * @returns {Promise<*|*[]>}
 */
const getProducerData = async (userEmail) => {
    logger.info(`Fetching producer data: `, userEmail);

    try {
        // Query data
        const producerData = await Producer.findAll({
            attributes: ['id', 'businessName', 'description', 'photoUrl'],
            include: [
                {
                    model: User,
                    attributes: [],
                    where: {
                        email: userEmail,
                    },
                },
            ],
        });

        // Logger
        logger.info(`Retrieved producer data: ${JSON.stringify(producerData)}`);

        return producerData;
    } catch (error) {
        logger.error('Error fetching producer data:', error.message);
        return [];
    }
};

module.exports = {
    getUserData,
    getProducerData
};
