const { Model,DataTypes } = require('sequelize');
const sequelize = require('../../utils/db-connect');

class Delivery extends Model {}
Delivery.init({
    deliveryDate: { type: DataTypes.DATE, allowNull: false },
    cost: { type: DataTypes.FLOAT, allowNull: false },
}, { sequelize, modelName: 'Delivery' });

module.exports = Delivery;