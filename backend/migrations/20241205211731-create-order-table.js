'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Orders', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      periodType: {
        type: Sequelize.ENUM('weekly', 'monthly', 'single purchase'),
        allowNull: false,
      },
      totalCost: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      paidCost: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      orderDate: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM('pending', 'completed', 'cancelled'),
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Drop the ENUM types first to avoid dependency issues
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_Orders_periodType";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_Orders_status";');

    // Drop the table
    await queryInterface.dropTable('Orders');
  },
};
