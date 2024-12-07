'use strict';

const {QueryTypes} = require("sequelize");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
// Get existing orders, producers, products, and baskets
    const orders = await queryInterface.sequelize.query(
        'SELECT id FROM "Orders";',
        { type: QueryTypes.SELECT }
    );

    const products = await queryInterface.sequelize.query(
        'SELECT id, "producerId" FROM "Products";',
        { type: QueryTypes.SELECT }
    );

    const baskets = await queryInterface.sequelize.query(
        'SELECT id, "ProducerId" FROM "Baskets";',
        { type: QueryTypes.SELECT }
    );

// Prepare OrderDetails data (associating orders, products, baskets, and producers)
    const orderDetails = [];
    const currentDate = new Date();

    for (const order of orders) {
      // Randomly associate producers and products/baskets
      const randomProduct = products[Math.floor(Math.random() * products.length)];
      const randomBasket = baskets[Math.floor(Math.random() * baskets.length)];

      // Check if the combination of orderId and itemId already exists
      const existingOrderDetail = await queryInterface.sequelize.query(
          'SELECT 1 FROM "OrderDetails" WHERE "orderId" = :orderId AND "itemId" = :itemId LIMIT 1',
          {
            replacements: { orderId: order.id, itemId: randomProduct.id },
            type: QueryTypes.SELECT,
          }
      );

      if (!existingOrderDetail.length) {
        orderDetails.push(
            {
              orderId: order.id,
              itemId: randomProduct.id,
              itemType: 'product',
              quantity: Math.floor(Math.random() * 10) + 1, // Random quantity between 1 and 10
              price: Math.random() * 50 + 10, // Random price between 10 and 60
              producerId: randomProduct.producerId,
              createdAt: currentDate,
              updatedAt: currentDate,
            }
        );
      }

      // Repeat for basket
      const existingBasketDetail = await queryInterface.sequelize.query(
          'SELECT 1 FROM "OrderDetails" WHERE "orderId" = :orderId AND "itemId" = :itemId LIMIT 1',
          {
            replacements: { orderId: order.id, itemId: randomBasket.id },
            type: QueryTypes.SELECT,
          }
      );

      if (!existingBasketDetail.length) {
        orderDetails.push(
            {
              orderId: order.id,
              itemId: randomBasket.id,
              itemType: 'basket',
              quantity: Math.floor(Math.random() * 3) + 1, // Random quantity between 1 and 3
              price: Math.random() * 100 + 20, // Random price between 20 and 120
              producerId: randomBasket.ProducerId,
              createdAt: currentDate,
              updatedAt: currentDate,
            }
        );
      }
    }

// Bulk insert OrderDetails into the OrderDetails table
    if (orderDetails.length > 0) {
      await queryInterface.bulkInsert('OrderDetails', orderDetails);
    } else {
      console.log('No orders found for creating order details.');
    }
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
