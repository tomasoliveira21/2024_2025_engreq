const logger = require('../utils/logger');
const supabase = require('../utils/supabase');

// Fetch all users
const getAllUsers = async () => {
    logger.info(`Request database getAllUsers`);
    const { data, error } = await supabase.from('user').select('*');
    if (error) {
        logger.error(`Error executing query:', error`);
        throw new Error(error.message);
    }
    return data;
};

module.exports = {
    getAllUsers,
};