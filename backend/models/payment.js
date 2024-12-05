'use strict';
const {
  Model, DataTypes
} = require('sequelize');
const sequelize = require("../src/utils/db-connect");
module.exports = (sequelize, DataTypes) => {
  class Payment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Payment.init({
    amount: { type: DataTypes.FLOAT, allowNull: false },
    currency: { type: DataTypes.ENUM('USD', 'EUR'), allowNull: false },
    method: { type: DataTypes.ENUM('credit_card', 'paypal') },
    status: { type: DataTypes.ENUM('pending', 'completed', 'failed') },
    timestamp: { type: DataTypes.DATE, allowNull: false },
    paymentProvider: { type: DataTypes.STRING },
  }, { sequelize, modelName: 'Payment' });
  return Payment;
};