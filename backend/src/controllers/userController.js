const logger = require('../utils/logger');
const { getAllUsers } = require('../services/userService');


// Controller to fetch all users
const getAllUsersController = async (req, res, next) => {
    logger.info(`Request getAllUsersController`);
    try {
        const users = await getAllUsers();
        res.status(200).json(users);
    } catch (error) {
        next(error); // Pass to error-handling middleware
    }
};

module.exports = {
    getAllUsersController,
};
