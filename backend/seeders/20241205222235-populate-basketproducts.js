'use strict';

/** @type {import('sequelize-cli').Migration} */
const { QueryTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Fetch all Baskets and Products
    const baskets = await queryInterface.sequelize.query(
        'SELECT id FROM "Baskets";',
        {
          type: QueryTypes.SELECT,
        }
    );

    const products = await queryInterface.sequelize.query(
        'SELECT id FROM "Products";',
        {
          type: QueryTypes.SELECT,
        }
    );

    // Create an array to store the relationships
    const basketProducts = [];

    // Randomly assign products to baskets without repetition
    baskets.forEach(basket => {
      // Get a random number of products to associate with the basket
      const numberOfProducts = Math.min(
          Math.floor(Math.random() * 3) + 1,
          products.length
      ); // Random between 1 and 3 products, capped by the number of products available

      // Create a set to track products already added to this basket
      const assignedProductIds = new Set();

      for (let i = 0; i < numberOfProducts; i++) {
        let randomProduct;

        // Ensure we get a product that hasn't already been assigned to this basket
        do {
          randomProduct = products[Math.floor(Math.random() * products.length)];
        } while (assignedProductIds.has(randomProduct.id));

        // Add the product to the basket
        basketProducts.push({
          BasketId: basket.id,
          ProductId: randomProduct.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        // Mark this product as assigned to the basket
        assignedProductIds.add(randomProduct.id);
      }
    });

    // Bulk insert the relationships into the BasketProducts join table
    await queryInterface.bulkInsert('BasketProducts', basketProducts);
  },

  down: async (queryInterface, Sequelize) => {
    // Delete all records from the BasketProducts table
    await queryInterface.bulkDelete('BasketProducts', null, {});
  },
};
