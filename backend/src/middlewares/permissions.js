const logger = require('../utils/logger');
const { getProducerData, getCoproducerData} = require("../services/userService");

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
const checkProducerRole = async (req, res, next) => {
    // Variables
    const userRole = req.user?.role ?? 'errorRole';
    const userEmail = req.user?.email ?? 'errorMail';

    // Validate Producer Role
    if (userRole === "errorRole" || userRole !== "Producer") {
        logger.error(`Forbidden: User do not have access to Producer Endpoints (${userRole})`);
        return res.status(403).json({ message: 'Forbidden: User do not have access to Producer Endpoints.' });
    }

    // Request Producer Information
    const producerData = await getProducerData(userEmail);

    // Set producer session data
    req.user.producer = producerData.map((producer) => {
        const {id, businessName, description} = producer.dataValues;
        return {id, businessName, description};
    });

    next();
};

/**
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const checkCoproducerRole = async (req, res, next) => {
    // Variables
    const userRole = req.user?.role ?? 'errorRole';

    // Validate Producer Role
    if (userRole === "errorRole" || userRole !== "Co-Producer") {
        logger.error(`Forbidden: User do not have access to Co-producer Endpoints (${userRole})`);
        return res.status(403).json({ message: 'Forbidden: User do not have access to Co-producer Endpoints.' });
    }

    // Request Producer Information
    const coproducerData = await getCoproducerData(userEmail);

    // Set producer session data
    req.user.coproducer = coproducerData.map((coproducer) => {
        const {id, businessName, description} = coproducer.dataValues;
        return {id, businessName, description};
    });

    next();
};

module.exports = {
    checkAMAPAccess,
    checkProducerRole,
    checkCoproducerRole
};