const { Model,DataTypes } = require('sequelize');
const sequelize = require('../../utils/db-connect');

class Order extends Model {}
Order.init({
    periodType: { type: DataTypes.ENUM('weekly', 'monthly', 'single purchase'), allowNull: false },
    totalCost: { type: DataTypes.FLOAT, allowNull: false },
    paidCost: { type: DataTypes.FLOAT, allowNull: false },
    orderDate: { type: DataTypes.DATE, allowNull: false },
    status: { type: DataTypes.ENUM('pending', 'completed', 'cancelled','in-progress') },
}, { sequelize, modelName: 'Order' });

module.exports = Order;