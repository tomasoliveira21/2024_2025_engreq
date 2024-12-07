'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('AMAPs', [
      {
        name: 'Porto AMAP',
        description: 'A community-focused AMAP offering organic produce.',
        type: 'type1',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Lisboa CSA',
        description: 'A CSA supporting local urban farmers.',
        type: 'type2',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Coimbra AMAP',
        description: 'Sustainable farming cooperative for healthy living.',
        type: 'type1',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('AMAPs', null, {});
  },
};

