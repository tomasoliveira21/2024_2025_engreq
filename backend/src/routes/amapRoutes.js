const logger = require('../utils/logger');
const express = require('express');
const authentication = require('../middlewares/authentication');
const { getAmapsList, getAmapsKpis } = require('../controllers/amapController');

const router = express.Router();

// AMAP routes

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
 *         description: "No products found"
 */
router.get('/', authentication, getAmapsList);

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

module.exports = router;
