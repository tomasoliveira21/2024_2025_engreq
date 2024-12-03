const { Model,DataTypes } = require('sequelize');
const sequelize = require('../../utils/db-connect');

class Product extends Model {}
Product.init({
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.STRING },
    type: { type: DataTypes.ENUM('type1', 'type2') },
    price: { type: DataTypes.FLOAT, allowNull: false },
    quantity: { type: DataTypes.INTEGER },
}, { sequelize, modelName: 'Product' });

module.exports = Product;
