const logger = require('../utils/logger');
const { getAllUsers } = require('../services/userService');


/**
 * TODO Supabase example
 * Get all register users
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
const getAllUsersController = async (req, res, next) => {
    logger.info(`Request getAllUsersController`);
    try {
        const users = await getAllUsers();
        res.status(200).json({ users: users });
    } catch (error) {
        next(error); // Pass to error-handling middleware
    }
};

module.exports = {
    getAllUsersController,
};
