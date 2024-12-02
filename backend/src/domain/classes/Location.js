const { Model,DataTypes } = require('sequelize');
const sequelize = require('../../utils/db-connect');
const { Delivery } = require('./Delivery');

class Location extends Model {}
Location.init({
    address: { type: DataTypes.STRING, allowNull: false },
    city: { type: DataTypes.STRING },
    country: { type: DataTypes.STRING },
    postalCode: { type: DataTypes.STRING },
    latitude: { type: DataTypes.FLOAT },
    longitude: { type: DataTypes.FLOAT },
}, { sequelize, modelName: 'Location' });

module.exports = Location;
