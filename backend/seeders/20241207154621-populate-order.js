'use strict';

/** @type {import('sequelize-cli').Migration} */
const { QueryTypes } = require('sequelize');

module.exports = {
  async up (queryInterface, Sequelize) {
    const consumers = await queryInterface.sequelize.query(
        `SELECT id FROM "Consumers";`,
        {
          type: QueryTypes.SELECT,
        }
    );
    
    // Prepare orders data (3 orders for each co-producer)
    const orders = [];
    const currentDate = new Date();

    consumers.forEach((coProducer) => {
      orders.push(
          {
            consumerId: coProducer.id, // Associate with the consumer's ID
            periodType: 'weekly',
            totalCost: Math.random() * 100 + 50, // Random total cost between 50 and 150
            paidCost: Math.random() * 50 + 20, // Random paid cost between 20 and 70
            orderDate: currentDate,
            status: 'pending',
            createdAt: currentDate,
            updatedAt: currentDate,
          },
          {
            consumerId: coProducer.id,
            periodType: 'monthly',
            totalCost: Math.random() * 200 + 100, // Random total cost between 100 and 300
            paidCost: Math.random() * 150 + 50, // Random paid cost between 50 and 200
            orderDate: currentDate,
            status: 'completed',
            createdAt: currentDate,
            updatedAt: currentDate,
          },
          {
            consumerId: coProducer.id,
            periodType: 'weekly',
            totalCost: Math.random() * 80 + 40, // Random total cost between 40 and 120
            paidCost: Math.random() * 60 + 10, // Random paid cost between 10 and 70
            orderDate: currentDate,
            status: 'cancelled',
            createdAt: currentDate,
            updatedAt: currentDate,
          }
      );
    });

    // Bulk insert orders into the Order table
    await queryInterface.bulkInsert('Orders', orders);
  },

  async down (queryInterface, Sequelize) {
      await queryInterface.bulkDelete('Orders', null, {});
  }
};
