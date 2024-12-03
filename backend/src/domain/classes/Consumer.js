const { Model,DataTypes } = require('sequelize');
const sequelize = require('../../utils/db-connect');

class Consumer extends Model {}
Consumer.init(
{}, { sequelize, modelName: 'Consumer' });

module.exports = Consumer;
