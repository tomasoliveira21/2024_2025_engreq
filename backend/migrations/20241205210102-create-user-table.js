'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Users', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      nif: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      role: {
        type: Sequelize.ENUM('Producer', 'Co-Producer', 'Admin', 'AMAP Admin'),
        allowNull: false,
      },
      authuserid: {
        type: Sequelize.UUID,
        allowNull: false,
        unique: true,
        references: {
          model: 'user', // Supabase's auth.users table
          key: 'id', // Referencing 'id' column in auth.users
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Users');
  },
};