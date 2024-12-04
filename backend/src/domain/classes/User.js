const { Model,DataTypes } = require('sequelize');
const sequelize = require('../../utils/db-connect');

class User extends Model {}
User.init({
    name: {type: DataTypes.STRING, allowNull: false},
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.ENUM('Producer', 'Co-Producer', 'Admin', 'AMAP Admin'), allowNull: false },
    nif: { type: DataTypes.INTEGER },
    // Foreign key to Supabase auth.users
    authUserId: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: true,
        references: {
            model: 'user', // Supabase's auth.users table
            key: 'id', // Column in auth.users
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    },
}, { sequelize, modelName: 'User' });

module.exports = User;
