'use strict';

const {tables} = require("../src/utils/Constants");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Fetch all Users with the role 'Consumer'
    const users = await queryInterface.sequelize.query(
        `SELECT id FROM "Users" WHERE role = 'Co-Producer';`,
        { type: Sequelize.QueryTypes.SELECT }
    );

    // Generate Consumers data based on the fetched Users
    const consumers = users.map((user, index) => ({
      userId: user.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    // Bulk insert into the Consumers table
    await queryInterface.bulkInsert(tables.Consumers, consumers);
  },

  down: async (queryInterface, Sequelize) => {
    // Delete all records from the Consumers table
    await queryInterface.bulkDelete(tables.Consumers, null, {});
  },
};
