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
    if (typeof userAMAPId == "undefined" || requestedAMAPId !== userAMAPId.toString()) {
        logger.error(`Forbidden: User do not have access to this AMAP (${requestedAMAPId})`);
        return res.status(403).json({ message: 'Forbidden: User do not have access to this AMAP.' });
    }

    next();
};

/**
 * Check Producer Role
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
const checkProducerRole = (req, res, next) => {
    // Variables
    const userRole = req.user.role;

    // Validate Producer Role
    if (typeof userRole == "undefined" || userRole !== "Producer") {
        logger.error(`Forbidden: User do not have access to Producer Endpoints (${userRole})`);
        return res.status(403).json({ message: 'Forbidden: User do not have access to Producer Endpoints.' });
    }

    next();
};

module.exports = {
    checkAMAPAccess,
    checkProducerRole
};