'use strict';

const {tables} = require("../src/utils/Constants");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(tables.Stocks, [
      {
        id: 1, // Optional: Only if your Stock table uses an `id` primary key
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Stocks', null, {});
  },
};
