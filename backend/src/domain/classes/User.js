const { Model,DataTypes } = require('sequelize');
const sequelize = require('../../utils/db-connect');

class User extends Model {}
User.init({
    name: {type: DataTypes.STRING, allowNull: false},
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    nif: { type: DataTypes.INTEGER },
    role: { type: DataTypes.ENUM('Producer', 'Co-Producer', 'Admin', 'AMAP Admin'), allowNull: false },
    // Foreign key to Supabase auth.users
    authuserid: {
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
}, {
    sequelize,
    timestamps: false,
    modelName: 'User' });

module.exports = User;
