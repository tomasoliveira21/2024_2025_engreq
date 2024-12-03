const { Model,DataTypes } = require('sequelize');
const sequelize = require('../../utils/db-connect');

class Producer extends Model {}
Producer.init({}, { sequelize, modelName: 'Producer' });

module.exports = Producer;

