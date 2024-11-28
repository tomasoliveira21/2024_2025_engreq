const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const logger = require('./utils/logger');

const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const errorHandler = require('./middlewares/errorHandler');
const app = express();

// Logger
app.use((req, res, next) => {
    logger.info(`Incoming request: ${req.method} ${req.url}`);
    next();
});

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Static page
app.use(express.static('public'));

// Routes
// Product
app.use('/products', productRoutes);

// Users TODO
app.use('/users', userRoutes);

// Not found routes
app.use((req, res, next) => {
    const error = new Error(`Cannot ${req.method} ${req.url}`);
    error.status = 404;
    next(error);
});

// Error Handling Middleware
app.use(errorHandler);

module.exports = app;
