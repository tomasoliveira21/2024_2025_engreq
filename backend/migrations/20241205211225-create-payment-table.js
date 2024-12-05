module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Payments', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      amount: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      currency: {
        type: Sequelize.ENUM('USD', 'EUR'),
        allowNull: false,
      },
      method: {
        type: Sequelize.ENUM('credit_card', 'paypal'),
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM('pending', 'completed', 'failed'),
        allowNull: true,
      },
      timestamp: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      paymentProvider: {
        type: Sequelize.STRING,
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
    // Drop the ENUM types before dropping the table to avoid ENUM type conflicts
    await queryInterface.dropTable('Payments');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_Payments_currency";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_Payments_method";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_Payments_status";');
  },
};