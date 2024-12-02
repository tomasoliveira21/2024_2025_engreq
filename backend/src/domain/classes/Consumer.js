const { Model,DataTypes } = require('sequelize');
const sequelize = require('../../utils/db-connect');
const { User } = require('./User');
const { Order } = require('./Order');

class Consumer extends Model {}
Consumer.init({}, { sequelize, modelName: 'Consumer' });

module.exports = Consumer;
