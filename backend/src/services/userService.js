const logger = require('../utils/logger');
const supabase = require('../utils/supabase');

/**
 * Get all Users
 * @returns {Promise<*>}
 */
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
 * Check user token
 * @param token
 * @returns {Promise<*|null>}
 */
const userAuthentication = async (token) => {
    logger.info(`Fetching user info for token: `, token);
    try {
        const { data: user, error } = await supabase
            .from('user')
            .select('*')
            .eq('bearer_token', token)
            .single(); // Fetch a single user record

        if (error) {
            logger.error(`Error fetching user from Supabase: ${error.message}`);
            return null;
        }

        return user;

    } catch (err) {
        logger.error(`Unexpected error fetching user info: ${err.message}`);
        return null;
    }
};

module.exports = {
    getAllUsers,
    userAuthentication,
};
