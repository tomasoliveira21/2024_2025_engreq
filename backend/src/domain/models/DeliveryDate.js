const { Model,DataTypes } = require('sequelize');
const sequelize = require('../../utils/db-connect');

class DeliveryDate extends Model {}
DeliveryDate.init({
    date: { type: DataTypes.DATE, allowNull: false },
    longitude: { type: DataTypes.STRING, allowNull: true },
    latitude: { type: DataTypes.STRING, allowNull: true },
    location: { type: DataTypes.STRING, allowNull: true },
}, { sequelize, modelName: 'DeliveryDate' });

module.exports = DeliveryDate;