const { Model,DataTypes } = require('sequelize');
const sequelize = require('../../utils/db-connect');

class Cart extends Model {}
Cart.init({
    itemId: { type: DataTypes.INTEGER, allowNull: false },
    itemType: {type: DataTypes.ENUM('product','basket'),allowNull: false },
    quantity: { type: DataTypes.INTEGER, allowNull: false },
}, { sequelize, modelName: 'Cart' });

module.exports = Cart;