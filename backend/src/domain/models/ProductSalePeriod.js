const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../utils/db-connect');

class ProductSalePeriod extends Model {}

ProductSalePeriod.init({
    ProductId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Products',
            key: 'id',
        },
        primaryKey: true,
    },
    SalePeriodId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'SalePeriods',
            key: 'id',
        },
        primaryKey: true,
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    }
}, {
    sequelize,
    modelName: 'ProductSalePeriod',
    tableName: 'ProductSalePeriods',
    timestamps: true,
    freezeTableName: true,
});

module.exports = ProductSalePeriod;