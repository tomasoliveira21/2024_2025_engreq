'use strict';
const {
  Model, DataTypes
} = require('sequelize');
const sequelize = require("../src/utils/db-connect");
module.exports = (sequelize, DataTypes) => {
  class Certificate extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Certificate.init({
    name: { type: DataTypes.STRING, allowNull: false },
    issuingAuthority: { type: DataTypes.STRING },
    issueDate: { type: DataTypes.DATE },
    expirationDate: { type: DataTypes.DATE },
    type: { type: DataTypes.ENUM('type1', 'type2') },
  }, { sequelize, modelName: 'Certificate' });
  return Certificate;
};