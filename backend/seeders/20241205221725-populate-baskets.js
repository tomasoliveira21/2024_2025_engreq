'use strict';

/** @type {import('sequelize-cli').Migration} */
const {QueryTypes} = require("sequelize");
const {tables} = require("../src/utils/Constants"); // Assuming models are in the models folder

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Fetch all Producers from the Producers table
    const producers = await queryInterface.sequelize.query(
        'SELECT id FROM "Producers";',
        {
          type: QueryTypes.SELECT,
        }
    );
    // Define the list of baskets to be added
    const baskets = [
      { name: 'Fruits', description: 'Description for Fruits', type: 'type1', photoUrl: 'http://example.com/Fruits.jpg', price: 20.0, weight: 5.0 },
      { name: 'Meats', description: 'Description for Meats', type: 'type1', photoUrl: 'http://example.com/Meats.jpg', price: 25.0, weight: 6.0 },
      { name: 'Vegetables', description: 'Description for Vegetables', type: 'type1', photoUrl: 'http://example.com/Vegetables.jpg', price: 15.0, weight: 4.0 },
      { name: 'Dairy', description: 'Description for Dairy', type: 'type1', photoUrl: 'http://example.com/Dairy.jpg', price: 30.0, weight: 7.0 },
      // Add more baskets as necessary
    ];

    // Calculate how to distribute the baskets evenly across producers
    let basketIndex = 0;
    const totalProducers = producers.length;

    // Create Basket entries, distributing them among the producers
    const basketEntries = baskets.map(basket => {
      const producer = producers[basketIndex % totalProducers]; // Distribute baskets evenly among producers
      basketIndex++;

      return {
        name: basket.name,
        description: basket.description,
        type: basket.type,
        photoUrl: basket.photoUrl,
        price: basket.price,
        weight: basket.weight,
        ProducerId: producer.id, // Foreign key to producer
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    });

    // Bulk insert the baskets into the Baskets table
    await queryInterface.bulkInsert(tables.Baskets, basketEntries);
  },

  down: async (queryInterface, Sequelize) => {
    // Delete all records from the Baskets table
    await queryInterface.bulkDelete(tables.Baskets, null, {});
  },
};
