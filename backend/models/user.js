'use strict';
const {
  Model, DataTypes
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init({
    name: {type: DataTypes.STRING, allowNull: false},
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    nif: { type: DataTypes.INTEGER },
    role: { type: DataTypes.ENUM('Producer', 'Co-Producer', 'Admin', 'AMAP Admin'), allowNull: false },
    // Foreign key to Supabase auth.users
    authuserid: {type: DataTypes.UUID,allowNull: false, unique: true,},
  }, {
    sequelize,
    timestamps: false,
    modelName: 'User' });
  return User;
};