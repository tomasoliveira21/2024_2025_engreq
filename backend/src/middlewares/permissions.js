const logger = require('../utils/logger');

// Middleware Permissions

/**
 * Check User AMAP permissions
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
const checkAMAPAccess = (req, res, next) => {
    // Variables
    const requestedAMAPId = req.params.amapId;
    const userAMAPId = req.user.amapId;

    // Validate AMAP relation
    if (requestedAMAPId !== userAMAPId.toString()) {
        logger.error(`Forbidden: User do not have access to this AMAP ${requestedAMAPId})`);
        return res.status(403).json({ message: 'Forbidden: User do not have access to this AMAP.' });
    }

    next();
};

module.exports = checkAMAPAccess;