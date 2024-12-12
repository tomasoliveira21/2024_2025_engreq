const { Model,DataTypes } = require('sequelize');
const sequelize = require('../../utils/db-connect');

class SalePeriod extends Model {}
SalePeriod.init({
    name: {type: DataTypes.STRING, allowNull: false},
    startDate: { type: DataTypes.DATE, allowNull: false },
    endDate: { type: DataTypes.DATE, allowNull: false },
    season: { type: DataTypes.ENUM('winter', 'autumn','spring','summer') },
}, { sequelize, modelName: 'SalePeriod' });

module.exports = SalePeriod;
