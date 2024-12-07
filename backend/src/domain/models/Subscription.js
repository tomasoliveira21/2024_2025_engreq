const { Model,DataTypes } = require('sequelize');
const sequelize = require('../../utils/db-connect');

class Subscription extends Model {}
Subscription.init({
    startDate: { type: DataTypes.DATE, allowNull: false },
    endDate: { type: DataTypes.DATE, allowNull: false },
}, { sequelize, modelName: 'Subscription' });

module.exports = Subscription;