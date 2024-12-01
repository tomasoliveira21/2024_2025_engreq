const logger = require('../utils/logger');
const { requestAllAmaps } = require('../services/amapService');

/**
 * Get list Amps list
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
const getAllAmaps = async (req, res, next) => {
    logger.info(`Request getAllAmaps`);
    try {
        const amap = await requestAllAmaps();
        res.status(200).json({ amaps: amap });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllAmaps,
};
