const logger = require('../utils/logger');

// Mock data
const products = [
    { id: 1, name: "Batatas", description: "Batatas XPTO", price: 123 },
    { id: 2, name: "Cenouras", description: "Cenouras XPTO", price: 123 },
    { id: 3, name: "Laranja", description: "Laranja XPTO", price: 123 },
];

// Get AMAP product
const getProducts = (req, res) => {
    logger.info(`Request getProducts`);
    res.status(200).json({ success: true, data: products });
};

module.exports = { getProducts };
