'use strict';
const {
  Model, DataTypes
} = require('sequelize');
const sequelize = require("../src/utils/db-connect");
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Order.init({
    periodType: { type: DataTypes.ENUM('weekly', 'monthly', 'single purchase'), allowNull: false },
    totalCost: { type: DataTypes.FLOAT, allowNull: false },
    paidCost: { type: DataTypes.FLOAT, allowNull: false },
    orderDate: { type: DataTypes.DATE, allowNull: false },
    status: { type: DataTypes.ENUM('pending', 'completed', 'cancelled') },
  }, { sequelize, modelName: 'Order' });
  return Order;
};