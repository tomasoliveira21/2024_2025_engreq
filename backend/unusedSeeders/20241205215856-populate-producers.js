'use strict';

/** @type {import('sequelize-cli').Migration} */
const { Sequelize } = require('sequelize');
const {tables} = require("../src/utils/Constants");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Fetch all Users with the role 'Producer'
    const users = await queryInterface.sequelize.query(
        `SELECT id,name FROM "Users" WHERE role = 'Producer';`,
        { type: Sequelize.QueryTypes.SELECT }
    );

    // Create Producers linked to the fetched Users
    const producers = users.map((user, index) => ({
      userId: user.id,
      businessName: `${user.name}'s Business ${index + 1}`,
      description: `Description for ${user.name}'s Business ${index + 1}`,
      photoUrl: `https://example.com/photo${index + 1}.jpg`,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    // Bulk insert into Producers table
    await queryInterface.bulkInsert(tables.Producers, producers);
  },

  down: async (queryInterface, Sequelize) => {
    // Delete all records from the Producers table
    await queryInterface.bulkDelete(tables.Producers, null, {});
  },
};
