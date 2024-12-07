const { Model,DataTypes } = require('sequelize');
const sequelize = require('../../utils/db-connect');

class Payment extends Model {}
Payment.init({
    amount: { type: DataTypes.FLOAT, allowNull: false },
    currency: { type: DataTypes.ENUM('USD', 'EUR'), allowNull: false },
    method: { type: DataTypes.ENUM('credit_card', 'paypal') },
    status: { type: DataTypes.ENUM('pending', 'completed', 'failed') },
    timestamp: { type: DataTypes.DATE, allowNull: false },
    paymentProvider: { type: DataTypes.STRING },
    orderId: { type: DataTypes.INTEGER, allowNull: false },
}, { sequelize, modelName: 'Payment' });

module.exports = Payment;
