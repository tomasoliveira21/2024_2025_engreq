const { Model,DataTypes } = require('sequelize');
const sequelize = require('../../utils/db-connect');
const { Producer } = require('./Producer');

class Certificate extends Model {}
Certificate.init({
    name: { type: DataTypes.STRING, allowNull: false },
    issuingAuthority: { type: DataTypes.STRING },
    issueDate: { type: DataTypes.DATE },
    expirationDate: { type: DataTypes.DATE },
    type: { type: DataTypes.ENUM('type1', 'type2') },
}, { sequelize, modelName: 'Certificate' });

module.exports = Certificate;
