const logger = require('../utils/logger');
const express = require('express');
const { getAllUsersController } = require('../controllers/userController');

const router = express.Router();

// User routes

// Route to get all users
router.get('/', getAllUsersController);

module.exports = router;
