const { Model,DataTypes } = require('sequelize');
const sequelize = require('../../utils/db-connect');
const { User } = require('./User');
const { Stock } = require('./Stock');
const { Certificate } = require('./Certificate');

class Producer extends Model {}
Producer.init({}, { sequelize, modelName: 'Producer' });

module.exports = Producer;

