const { Model,DataTypes } = require('sequelize');
const sequelize = require('../../utils/db-connect');

class Producer extends Model {}
Producer.init({
    businessName: {type: DataTypes.STRING, allowNull: true},
}, { sequelize, modelName: 'Producer' });

module.exports = Producer;

