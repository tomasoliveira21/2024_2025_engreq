const logger = require('../utils/logger');
const express = require('express');
const authentication = require('../middlewares/authentication');
const {
    getAmapsList,
    getAmapsKpis,
    getAmapSeason,
    createAmapSeason,
    updateAmapSeason,
    deleteAmapSeason,
    getSeasonDeliveryDates,
    getAmapProfile,
    updateAmapProfile,
    getProducerAccountBalance,
    getCoproducerAccountBalance,
    getProducerAccountValues,
    getProducerKpis,
    getCoproducerKpis
} = require('../controllers/amapController');

const {
    checkAMAPAccess,
    checkAMAPRole
} = require('../middlewares/permissions');

const router = express.Router();

// AMAP routes

/**
 * AMAP Profile
 */

/**
 * @swagger
 * tags:
 *   - name: "AMAP"
 *     description: "Endpoints related to AMAP management"
 *   - name: "Profile"
 *     description: "Endpoints AMAP profile"
 *
 * /amap/profile/{amapId}:
 *   get:
 *     summary: "Get AMAP profile details"
 *     description: "This endpoint retrieves AMAP profile details"
 *     tags:
 *       - "Profile"
 *     responses:
 *       200:
 *         description: "A AMAP profile"
 *       404:
 *         description: "No AMAPs found"
 */
router.get('/profile/:amapId', authentication, getAmapProfile);

/**
 * @swagger
 * /amap/profile/{amapId}:
 *   put:
 *     summary: Update AMAP profile
 *     description: Updates the AMAP profile information .
 *     tags:
 *       - "Profile"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the AMAP
 *                 example: "AMAP Porto"
 *               description:
 *                 type: string
 *                 description: Description of the AMAP
 *                 example: "A community-focused AMAP offering organic produce."

 *     responses:
 *       200:
 *         description: AMAP profile updated successfully
 *       400:
 *         description: Bad Request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: AMAP profile not found
 *       500:
 *         description: Internal Server Error
 */
router.put('/profile/:amapId', authentication, updateAmapProfile);
/**
 * LIST
 */

/**
 * @swagger
 * tags:
 *   - name: "AMAP"
 *     description: "Endpoints related to AMAP management"
 *
 * /amap/:
 *   get:
 *     summary: "Get a list of AMAPs available"
 *     description: "This endpoint retrieves a list of all AMAPs available"
 *     tags:
 *       - "AMAP"
 *     responses:
 *       200:
 *         description: "A list of AMAPs"
 *       404:
 *         description: "No AMAPs found"
 */
router.get('/', authentication, getAmapsList);

/**
 * KPIS
 */

/**
 * @swagger
 * tags:
 *   - name: "AMAP"
 *     description: "Endpoints related to AMAP management"
 *
 * /amap/kpis:
 *   get:
 *     summary: "Get AMAP kpis"
 *     description: "This endpoint retrieves AMAP KPIs"
 *     tags:
 *       - "AMAP"
 *     responses:
 *       200:
 *         description: "A list of AMAP KPIs"
 *       404:
 *         description: "No KPIs found"
 */
router.get('/kpis', authentication, getAmapsKpis);

/**
 * SEASON
 */

/**
 * @swagger
 * tags:
 *   - name: "AMAP"
 *     description: "Endpoints related to AMAP management"
 *   - name: "Season"
 *     description: "Endpoints related to Season, a subsection of AMAP"
 *
 * /amap/{amapId}/season:
 *   get:
 *     summary: "Get AMAP season"
 *     description: "This endpoint retrieves AMAP configured seasons"
 *     tags:
 *       - "Season"
 *     responses:
 *       200:
 *         description: "A list of AMAP season"
 *       404:
 *         description: "No seasons found"
 */
router.get('/:amapId/season', authentication, checkAMAPAccess, getAmapSeason);

/**
 * @swagger
 * /amap/{amapId}/season:
 *   post:
 *     summary: "Create a new season"
 *     description: "This endpoint allows to create a new season."
 *     tags:
 *       - "Season"
 *     requestBody:
 *       description: "Season object that needs to be added"
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Summer season"
 *                 description: "The name of the season"
 *               startDate:
 *                 type: date
 *                 example: "2024-06-21"
 *                 description: "The start date of the season"
 *               endDate:
 *                 type: date
 *                 example: "2024-09-21"
 *                 description: "The start date of the season"
 *               season:
 *                 type: string
 *                 example: "summer"
 *                 description: "The predefined season (summer, spring, winter, autumn)"
 *     responses:
 *       201:
 *         description: "Product created successfully"
 *       400:
 *         description: "Invalid input"
 *       500:
 *         description: "Internal server error"
 */
router.post('/:amapId/season', authentication, checkAMAPAccess, createAmapSeason);

/**
 * @swagger
 * /amap/season/{seasonId}:
 *   put:
 *     summary: Update a specific season
 *     description: Updates the details of a season by its ID.
 *     tags:
 *       - Season
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the season
 *                 example: "Season test"
 *               startDate:
 *                 type: string
 *                 format: date
 *                 description: Start date of the season
 *                 example: "2024-11-05"
 *               endDate:
 *                 type: string
 *                 format: date
 *                 description: End date of the season
 *                 example: "2025-02-05"
 *               season:
 *                 type: string
 *                 description: Season name (e.g., summer, spring, winter, autumn)
 *                 example: "summer"
 *     responses:
 *       200:
 *         description: Season updated successfully
 *       400:
 *         description: Bad Request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Season not found
 *       500:
 *         description: Internal Server Error
 */
router.put('/season/:seasonId', authentication, updateAmapSeason);

/**
 * @swagger
 * /amap/season/{seasonId}:
 *   delete:
 *     summary: Delete a specific season
 *     description: Deletes a season by its ID.
 *     tags:
 *       - "Season"
 *     parameters:
 *       - in: path
 *         name: seasonId
 *         required: true
 *         description: ID of the season to delete
 *     responses:
 *       200:
 *         description: Season successfully deleted
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Season not found
 */
router.delete('/season/:seasonId', authentication, deleteAmapSeason);

/**
 * @swagger
 * tags:
 *   - name: "AMAP"
 *     description: "Endpoints related to AMAP management"
 *   - name: "Season"
 *     description: "Endpoints related to Season, a subsection of AMAP"
 *
 * /amap/season/{seasonId}/dates:
 *   get:
 *     summary: "Get season delivery dates"
 *     description: "This endpoint retrieves season delivery dates"
 *     tags:
 *       - "Season"
 *     responses:
 *       200:
 *         description: "A list of AMAP season"
 *       404:
 *         description: "No seasons found"
 */
router.get('/season/:seasonId/dates', authentication, getSeasonDeliveryDates);

/**
 * Balance account
 */

/**
 * @swagger
 * tags:
 *   - name: "AMAP"
 *     description: "Endpoints related to AMAP management"
 *   - name: "Account Balance"
 *     description: "Get account balance"
 *
 * /amap/balance/producer:
 *   get:
 *     summary: "Get producer account balance"
 *     description: "This endpoint retrieves producer account balance"
 *     tags:
 *       - "Account Balance"
 *     responses:
 *       200:
 *         description: "A list of AMAP producers account balance"
 *       404:
 *         description: "No account found"
 */
router.get('/balance/producer', authentication, checkAMAPRole, getProducerAccountBalance);

/**
 * @swagger
 * tags:
 *   - name: "AMAP"
 *     description: "Endpoints related to AMAP management"
 *   - name: "Account Balance"
 *     description: "Get account balance"
 *
 * /amap/balance/coproducer:
 *   get:
 *     summary: "Get co-producer account balance"
 *     description: "This endpoint retrieves co-producer account balance"
 *     tags:
 *       - "Account Balance"
 *     responses:
 *       200:
 *         description: "A list of AMAP co-producers account balance"
 *       404:
 *         description: "No account found"
 */
router.get('/balance/coproducer', authentication, checkAMAPRole, getCoproducerAccountBalance);

/**
 * @swagger
 * tags:
 *   - name: "AMAP"
 *     description: "Endpoints related to AMAP management"
 *   - name: "Account Balance"
 *     description: "Get account balance"
 *
 * /amap/account/producer:
 *   get:
 *     summary: "Get producer account"
 *     description: "This endpoint retrieves producer account"
 *     tags:
 *       - "Account Balance"
 *     responses:
 *       200:
 *         description: "A list of AMAP producers account"
 *       404:
 *         description: "No account found"
 */
router.get('/account/producer', authentication, checkAMAPRole, getProducerAccountValues);

/**
 * KPIS
 */

/**
 * @swagger
 * tags:
 *   - name: "AMAP"
 *     description: "Endpoints related to AMAP management"
 *
 * /amap/producer/kpis:
 *   get:
 *     summary: "Get producer kpis"
 *     description: "This endpoint retrieves producer KPIs"
 *     tags:
 *       - "AMAP"
 *     responses:
 *       200:
 *         description: "A list of producer KPIs"
 *       404:
 *         description: "No KPIs found"
 */
router.get('/producer/kpis', authentication, getProducerKpis);

/**
 * @swagger
 * tags:
 *   - name: "AMAP"
 *     description: "Endpoints related to AMAP management"
 *
 * /amap/coproducer/kpis:
 *   get:
 *     summary: "Get co-producer kpis"
 *     description: "This endpoint retrieves co-producer KPIs"
 *     tags:
 *       - "AMAP"
 *     responses:
 *       200:
 *         description: "A list of co-producer KPIs"
 *       404:
 *         description: "No KPIs found"
 */
router.get('/coproducer/kpis', authentication, getCoproducerKpis);

module.exports = router;
