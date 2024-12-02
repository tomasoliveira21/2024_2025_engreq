// map the classes and associations to each other
const { Sequelize } = require('sequelize');
const sequelize = require('../utils/db-connect');
const AMAP = require('./AMAP');
const Certificate = require('./Certificate');
const Consumer = require('./Consumer');
const Delivery = require('./Delivery');
const Location = require('./Location');
const Order = require('./Order');
const Payment = require('./Payment');
const Producer = require('./Producer');
const Product = require('./Product');
const Stock = require('./Stock');
const User = require('./User');

User.hasOne(Consumer, { foreignKey: 'userId' });
User.hasOne(Producer, { foreignKey: 'userId' });
User.belongsTo(AMAP, { foreignKey: 'amapId' });
User.hasMany(Payment, { foreignKey: 'userId' });

Stock.belongsTo(Producer, { foreignKey: 'producerId' });

Product.belongsTo(Producer, { foreignKey: 'producerId' });

Producer.hasMany(Product, { foreignKey: 'producerId' });
Producer.belongsTo(User, { foreignKey: 'userId' });
Producer.hasOne(Stock, { foreignKey: 'producerId' });
Producer.hasMany(Certificate, { foreignKey: 'producerId' });

Payment.belongsTo(User, { foreignKey: 'userId' });

Order.belongsTo(Consumer, { foreignKey: 'consumerId' });
Order.hasMany(Delivery, { foreignKey: 'orderId' });

Location.hasOne(Delivery, { foreignKey: 'locationId' });

Delivery.belongsTo(Order, { foreignKey: 'orderId' });
Delivery.belongsTo(Location, { foreignKey: 'locationId' });

Consumer.belongsTo(User, { foreignKey: 'userId' });
Consumer.hasMany(Order, { foreignKey: 'consumerId' });

Certificate.belongsTo(Producer, { foreignKey: 'producerId' });

AMAP.hasMany(User, { as: 'members' });

// Export models
module.exports = {
    sequelize,
    AMAP,
    Certificate,
    Consumer,
    Delivery,
    Location,
    Order,
    Payment,
    Producer,
    Product,
    Stock,
    User
};

