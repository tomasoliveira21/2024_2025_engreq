'use strict';
const {
  Model, DataTypes
} = require('sequelize');
const sequelize = require("../src/utils/db-connect");
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Product.init({
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.STRING },
    type: { type: DataTypes.ENUM('type1', 'type2') },
    price: { type: DataTypes.FLOAT, allowNull: false },
    quantity: { type: DataTypes.INTEGER },
  }, { sequelize, modelName: 'Product' });
};