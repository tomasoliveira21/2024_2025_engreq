const { Model,DataTypes } = require('sequelize');
const sequelize = require('../../utils/db-connect');

class User extends Model {}
User.init({
    name: {type: DataTypes.STRING, allowNull: false},
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    nif: { type: DataTypes.INTEGER },
    role: { type: DataTypes.ENUM('Producer', 'Co-Producer', 'Admin', 'AMAP Admin'), allowNull: false },
    // Foreign key to Supabase auth.users
    authuserid: {type: DataTypes.UUID,allowNull: false, unique: true,},
    photoUrl: {type: DataTypes.STRING, allowNull: true}
}, {
    sequelize,
    timestamps: false,
    modelName: 'User' });

module.exports = User;
