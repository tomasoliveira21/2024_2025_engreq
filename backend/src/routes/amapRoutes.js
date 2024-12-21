const logger = require('../utils/logger');
const express = require('express');
const authentication = require('../middlewares/authentication');
const { getAmapsList, getAmapsKpis, getAmapSeason, createAmapSeason, updateAmapSeason, deleteAmapSeason } = require('../controllers/amapController');
const { checkAMAPAccess } = require('../middlewares/permissions');

const router = express.Router();

// AMAP routes

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
 * /season/{seasonId}:
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

module.exports = router;
