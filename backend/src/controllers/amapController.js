const logger = require('../utils/logger');
const { requestAmapsList, requestAmapsKpis } = require('../services/amapService');

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

/**
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
const getAmapsKpis = async (req, res, next) => {
    logger.info(`Request getAmapsKpis`);
    try {
        const userAmpId = req.user.amapId;
        const amapKpis = await requestAmapsKpis(userAmpId);
        res.status(200).json({ kpis: amapKpis });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAmapsList,
    getAmapsKpis
};
