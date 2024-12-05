'use strict';
const {
  Model, DataTypes
} = require('sequelize');
const sequelize = require("../src/utils/db-connect");
module.exports = (sequelize, DataTypes) => {
  class Delivery extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Delivery.init({
    deliveryDate: { type: DataTypes.DATE, allowNull: false },
    cost: { type: DataTypes.FLOAT, allowNull: false },
  }, { sequelize, modelName: 'Delivery' });
  return Delivery;
};