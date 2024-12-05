const { Model,DataTypes } = require('sequelize');
const sequelize = require('../../utils/db-connect');

class Basket extends Model {}
Basket.init({
    name: {type: DataTypes.STRING, allowNull: true},
    description: {type: DataTypes.STRING, allowNull: true},
    photoUrl: { type: DataTypes.STRING, allowNull: true },
    price: {type: DataTypes.FLOAT, allowNull: true},
    weight: {type: DataTypes.FLOAT, allowNull: true},
}, { sequelize, modelName: 'Basket' });

module.exports = Basket;