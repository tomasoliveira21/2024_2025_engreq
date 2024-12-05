const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../utils/db-connect');

class BasketProduct extends Model {}

BasketProduct.init({
    BasketId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Baskets',
            key: 'id',
        },
        primaryKey: true,
    },
    ProductId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Products',
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
    modelName: 'BasketProduct',
    tableName: 'BasketProducts',
    timestamps: true,
    freezeTableName: true,
});

module.exports = BasketProduct;