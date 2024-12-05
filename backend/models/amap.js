'use strict';
const {
  Model, DataTypes
} = require('sequelize');
const sequelize = require("../src/utils/db-connect");
module.exports = (sequelize, DataTypes) => {
  class AMAP extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      AMAP.hasMany(models.gb, { as: 'members' });
    }
  }
  AMAP.init({
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.STRING, allowNull: false },
    type: { type: DataTypes.ENUM('type1', 'type2'), allowNull: false },
  }, { sequelize, modelName: 'AMAP' });
  return AMAP;
};