const { Model,DataTypes } = require('sequelize');
const sequelize = require('../../utils/db-connect');
const { Producer } = require('./Producer');

class Stock extends Model {}
Stock.init({}, { sequelize, modelName: 'Stock' });

module.exports = Stock;
