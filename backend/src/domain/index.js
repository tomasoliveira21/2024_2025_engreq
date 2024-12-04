// map the classes and associations to each other
const { Sequelize } = require('sequelize');

const sequelize = require('../utils/db-connect');
const AMAP = require('./classes/AMAP');
const Certificate = require('./classes/Certificate');
const Consumer = require('./classes/Consumer');
const Delivery = require('./classes/Delivery');
const Location = require('./classes/Location');
const Order = require('./classes/Order');
const Payment = require('./classes/Payment');
const Producer = require('./classes/Producer');
const Product = require('./classes/Product');
const Stock = require('./classes/Stock');
const User = require('./classes/User');
const Basket = require("./classes/Basket");

User.hasOne(Consumer, { foreignKey: 'userId' });
User.hasOne(Producer, { foreignKey: 'userId' });
User.belongsTo(AMAP, { foreignKey: 'AMAPId' });
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

Basket.belongsTo(Producer, {foreignKey: 'ProducerId' });
Producer.hasMany(Basket, { as: 'baskets' });
Basket.belongsToMany(Product, { through: 'BasketProducts' });
Product.belongsToMany(Basket, { through: 'BasketProducts' });
