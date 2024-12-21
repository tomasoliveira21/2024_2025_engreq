const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../utils/db-connect');

class BasketSalePeriod extends Model {}

BasketSalePeriod.init({
    BasketId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Baskets',
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
    modelName: 'BasketSalePeriod',
    tableName: 'BasketSalePeriods',
    timestamps: true,
    freezeTableName: true,
});

module.exports = BasketSalePeriod;