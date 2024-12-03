const { Model,DataTypes } = require('sequelize');
const sequelize = require('../../utils/db-connect');


class User extends Model {}
User.init({
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.ENUM('consumer', 'producer'), allowNull: false },
    nif: { type: DataTypes.STRING },
}, { sequelize, modelName: 'User' });

module.exports = User;
