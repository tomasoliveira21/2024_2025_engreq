const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

// Utils
const logger = require('./utils/logger');

// Middlewares
const errorHandler = require('./middlewares/errorHandler');

// Swagger
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const path = require('path');

// Routes
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');

const app = express();

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
