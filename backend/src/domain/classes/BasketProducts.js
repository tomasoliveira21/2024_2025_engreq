const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../utils/db-connect'); // Adjust the path as necessary

class BasketProduct extends Model {}

BasketProduct.init(
    {
        BasketId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Baskets',
                key: 'id',
            },
        },
        ProductId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Products',
                key: 'id',
            },
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        updatedAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        sequelize,
        modelName: 'BasketProduct',
        tableName: 'BasketProducts',
        timestamps: true,
    }
);

module.exports = BasketProduct;