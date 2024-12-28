const logger = require('../utils/logger');
const {
    requestAmapsList,
    requestAmapsKpis,
    requestAmapSeason,
    insertNewSeason,
    insertDeliveryDates,
    deleteSeason,
    updateSeason,
    checkSeasonName
} = require('../services/amapService');

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

/**
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
const getAmapSeason = async (req, res, next) => {
    logger.info(`Request getAmapSeason`);
    const { amapId } = req.params;
    try {
        const season = await requestAmapSeason(amapId);
        res.status(200).json({ season: season });
    } catch (error) {
        next(error);
    }
};

/**
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const createAmapSeason = async (req, res, next) => {

    // Logger
    logger.info(`Create new AMAP season`);

    // Configs
    let incrementDays = 7; // Delivery days to increment

    try {
        // Arguments
        const {amapId} = req.params;
        const {name, startDate, endDate, season} = req.body;
        const validSeasons = ['summer', 'spring', 'winter', 'autumn'];

        // Validate data
        if (!name || !startDate || !endDate || !season || !amapId) {
            logger.warn(`Missing mandatory fields to insert`);
            return res.status(400).json({
                success: false,
                message: 'name, startDate, endDate, season and amapId are required.'
            });
        }

        if (!validSeasons.includes(season)) {
            logger.warn(`Invalid seasons`);
            return res.status(400).json({
                success: false,
                message: 'Invalid season option! Valid options: summer, spring, winter, autumn'
            });
        }

        // Check if don't exist another season with same name
        if (await checkSeasonName(amapId, name)) {
            logger.warn('The name has already been used..');
            return res.status(400).json({
                success: false,
                message: 'Invalid: The name has already been used..'
            });
        }

        // Insert season
        const seasonData = {amapId, name, startDate, endDate, season};
        const newSeason = await insertNewSeason(seasonData);

        // Delivery dates
        const salesPeriodId = newSeason.id;
        const dates = [];
        let currentDate = new Date(startDate);

        // TODO - This data is necessary?
        const longitude = null;
        const latitude = null;
        const location = null;

        // Insert delivery
        while (currentDate <= new Date(endDate)) {
            // Date handle
            currentDate.setDate(currentDate.getDate() + incrementDays);
            dates.push(new Date(currentDate));

            // Insert delivery date
            const deliveryData = {currentDate, longitude, latitude, location, salesPeriodId};
            const newSeasonDeliveries = await insertDeliveryDates(deliveryData);
        }

        // Add dates to response
        newSeason.deliveryDate = dates;

        // Return response
        return res.status(201).json({
            success: true,
            message: 'Season created successfully',
            season: newSeason
        });
    } catch (err) {
        // Error
        logger.error(err);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
};

/**
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const deleteAmapSeason = async (req, res, next) => {
    // Logger
    logger.info(`Delete AMAP season`);

    try {
        // Arguments
        const { seasonId } = req.params;

        // Delete season
        const deletedSeason = await deleteSeason(seasonId);

        // Return response
        return res.status(201).json({
            success: true,
            message: 'Season deleted successfully',
            season: deletedSeason
        });
    } catch (err) {
        // Error
        logger.error(err);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
};

/**
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const updateAmapSeason = async (req, res, next) => {
    logger.info(`Update AMAP season`);

    try {
        // Arguments
        const { seasonId, name, startDate, endDate, season } = req.body;

        // Validations
        if (!name || !startDate || !endDate || !season) {
            logger.warn(`Missing mandatory fields to update`);
            return res.status(400).json({
                success: false,
                message: 'Validation error: All fields (name, startDate, endDate, season) are required',
            });
        }

        // Validate date formats
        const start = new Date(startDate);
        const end = new Date(endDate);
        if (isNaN(start) || isNaN(end) || start >= end) {
            logger.warn(`Invalid dates fields to update`);
            return res.status(400).json({
                success: false,
                message: 'Validation error: Invalid date range',
            });
        }

        // Update the season
        const updatedSeason = await updateSeason(seasonId, { name, startDate, endDate, season });

        // Return response
        return res.status(200).json({
            success: true,
            message: 'Season updated successfully',
            season: updatedSeason,
        });
    } catch (err) {
        // Error
        logger.error(err);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
        });
    }
};

module.exports = {
    getAmapsList,
    getAmapsKpis,
    getAmapSeason,
    createAmapSeason,
    deleteAmapSeason,
    updateAmapSeason
};
