const logger = require('../utils/logger');
const { requestAmapsList } = require('../services/amapService');

/**
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
const getAmapsList = async (req, res, next) => {
    logger.info(`Request getAmapsList`);
    try {
        const amap = await requestAmapsList();
        res.status(200).json({ amaps: amap });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAmapsList
};
