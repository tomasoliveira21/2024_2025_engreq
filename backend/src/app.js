const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sequelize = require('./utils/db-connect');
require('./domain/index');

// Utils
const logger = require('./utils/logger');

// Middlewares
const errorHandler = require('./middlewares/errorHandler');

// Swagger
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const path = require('path');

// Routes
const productRoutes = require('./routes/productRoutes');
const amapRoutes = require('./routes/amapRoutes');
const orderRoutes = require('./routes/orderRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

// APP
const app = express();

// JSON
app.use(express.json());

// Sync models
sequelize.sync({ force: true }) // Use `force: true` to drop and recreate tables (only for development)
    .then(() => console.log('Database synced'))
    .catch(err => console.error('Error syncing the database:', err));

// Swagger definition
const swaggerOptions = {
    definition: {
        openapi: '3.0.0', // OpenAPI version
        info: {
            title: 'Eng-Req API',
            version: '1.0.0',
            description: 'This is the API documentation for the eng-req API',
        },
    },
    // Path to the API routes
    apis: [path.join(__dirname, 'routes', '*.js')],
};

// Swagger
const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

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

// AMAP
app.use('/amap', amapRoutes);

// Order
app.use('/order', orderRoutes);

// Payment
app.use('/payment', paymentRoutes);

// Not found routes
app.use((req, res, next) => {
    const error = new Error(`Cannot ${req.method} ${req.url}`);
    error.status = 404;
    next(error);
});

// Error Handling Middleware
app.use(errorHandler);

module.exports = app;
