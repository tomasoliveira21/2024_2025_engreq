const { Model,DataTypes } = require('sequelize');
const sequelize = require('../../utils/db-connect');

class OrderDetails extends Model {}
OrderDetails.init({
    orderId: {type: DataTypes.INTEGER, allowNull: false, references: {model: 'Orders', key: 'id'}},
    itemId: { type: DataTypes.INTEGER, allowNull: false },
    itemType: {type: DataTypes.ENUM('product','basket'),allowNull: false },
    quantity: { type: DataTypes.INTEGER, allowNull: false },
    price: { type: DataTypes.FLOAT, allowNull: false },
    producerId: { type: DataTypes.INTEGER, allowNull: false, references: {model: 'Producers', key: 'id'} },
},{ sequelize, modelName: 'OrderDetails'
    , indexes:[
        {
            unique: true,
            fields: ['orderId', 'itemId'],
        }
    ]});

module.exports = OrderDetails;