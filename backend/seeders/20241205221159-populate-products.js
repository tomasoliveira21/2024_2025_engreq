'use strict';

/** @type {import('sequelize-cli').Migration} */

const {QueryTypes} = require("sequelize");
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Fetch all Producers from the Producers table
    const producers = await queryInterface.sequelize.query(
        'SELECT id FROM "Producers";',
        {
          type: QueryTypes.SELECT,
        }
    );

    // Define the list of products to be added
    const products = [
      { name: 'Banana', description: 'Description for Banana', type: 'type1', price: 10.0, quantity: 50 },
      { name: 'Apple', description: 'Description for Apple', type: 'type1', price: 15.0, quantity: 30 },
      { name: 'Tomato', description: 'Description for Tomato', type: 'type2', price: 20.0, quantity: 40 },
      { name: 'Chicken Breast', description: 'Description for Chicken Breast', type: 'type2', price: 25.0, quantity: 60 },
      { name: 'Eggs', description: 'Description for Eggs', type: 'type1', price: 12.5, quantity: 70 },
      { name: 'Milk', description: 'Description for Milk', type: 'type1', price: 12.5, quantity: 70 },
      { name: 'Butter', description: 'Description for Butter', type: 'type1', price: 12.5, quantity: 70 },
      { name: 'Cereal', description: 'Description for Cereal', type: 'type1', price: 12.5, quantity: 70 },
      { name: 'Mushrooms', description: 'Description for Mushrooms', type: 'type1', price: 12.5, quantity: 70 },
    ];

    // Calculate how to distribute the products evenly across producers
    let productIndex = 0;
    const totalProducers = producers.length;

    // Create Product entries, distributing them among the producers
    const productEntries = products.map(product => {
      const producer = producers[productIndex % totalProducers]; // Distribute products evenly among producers
      productIndex++;

      return {
        name: product.name,
        description: product.description,
        type: product.type,
        price: product.price,
        quantity: product.quantity,
        producerId: producer.id, // Foreign key to producer
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    });

    // Bulk insert the products into the Products table
    await queryInterface.bulkInsert('Products', productEntries);
  },

  down: async (queryInterface, Sequelize) => {
    // Delete all records from the Products table
    await queryInterface.bulkDelete('Products', null, {});
  },
};
