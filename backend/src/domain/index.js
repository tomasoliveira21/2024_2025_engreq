// map the classes and associations to each other
const { Sequelize } = require('sequelize');

const sequelize = require('../utils/db-connect');
const AMAP = require('./models/AMAP');
const Certificate = require('./models/Certificate');
const Consumer = require('./models/Consumer');
const Delivery = require('./models/Delivery');
const Location = require('./models/Location');
const Order = require('./models/Order');
const Payment = require('./models/Payment');
const Producer = require('./models/Producer');
const Product = require('./models/Product');
const Stock = require('./models/Stock');
const User = require('./models/User');
const Basket = require("./models/Basket");
const OrderDetails = require('./models/OrderDetails');
const Subscriptions = require('./models/Subscription');

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

// Order - Producer - Product associations
Order.hasMany(OrderDetails, { foreignKey: 'orderId' });
OrderDetails.belongsTo(Order, { foreignKey: 'orderId' });

Product.hasMany(OrderDetails, { foreignKey: 'itemId', constraints:false });
OrderDetails.belongsTo(Product, { foreignKey: 'itemId', constraints:false, scope: {itemType:'product' }});

Basket.hasMany(OrderDetails, { foreignKey: 'itemId', constraints: false });
OrderDetails.belongsTo(Basket, { foreignKey: 'itemId', constraints: false, scope: { itemType: 'basket' } });

Producer.hasMany(OrderDetails, { foreignKey: 'producerId' });
OrderDetails.belongsTo(Producer, { foreignKey: 'producerId' });




