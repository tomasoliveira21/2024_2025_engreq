const { Model,DataTypes } = require('sequelize');
const sequelize = require('../../utils/db-connect');
const { User } = require('./User');

class AMAP extends Model {}
AMAP.init({
    name: { type: DataTypes.STRING, allowNull: false },
    type: { type: DataTypes.ENUM('type1', 'type2'), allowNull: false },
}, { sequelize, modelName: 'AMAP' });

module.exports = AMAP;
