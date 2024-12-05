const logger = require('../utils/logger');
const express = require('express');
const authentication = require('../middlewares/authentication');
const { getAmapsList } = require('../controllers/amapController');

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

module.exports = router;
