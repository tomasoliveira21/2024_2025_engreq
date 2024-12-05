'use strict';
const {
  Model, DataTypes
} = require('sequelize');
const sequelize = require("../src/utils/db-connect");
module.exports = (sequelize, DataTypes) => {
  class Basket extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Basket.init({
    name: {type: DataTypes.STRING, allowNull: true},
    description: {type: DataTypes.STRING, allowNull: true},
    photoUrl: { type: DataTypes.STRING, allowNull: true },
    price: {type: DataTypes.FLOAT, allowNull: true},
    weight: {type: DataTypes.FLOAT, allowNull: true},
  }, { sequelize, modelName: 'Basket' });
  return Basket;
};