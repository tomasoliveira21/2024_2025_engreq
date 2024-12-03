const logger = require('../utils/logger');
const supabase = require('../utils/supabase');
const User = require('../domain/classes/User');

/**
 * Get all Users
 * @returns {Promise<*>}
 */
// TODO TO REMOVE
const getAllUsers = async () => {
    logger.info(`Request database getAllUsers`);
    const { data, error } = await supabase.from('user').select('*');
    if (error) {
        logger.error(`Error executing query:', error`);
        throw new Error(error.message);
    }
    return data;
};


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

module.exports = {
    getAllUsers,
    getUserData,
};
