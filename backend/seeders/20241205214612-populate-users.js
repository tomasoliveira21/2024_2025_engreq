'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {

    const amaps = await queryInterface.sequelize.query(
        'SELECT id FROM "AMAPs";',
        { type: Sequelize.QueryTypes.SELECT }
    );

    await queryInterface.bulkInsert('Users', [
      {
        name: 'John Doe',
        email: 'john.doe@example.com',
        nif: 123456789,
        role: 'Producer',
        authuserid: 'a1111111-1111-1111-1111-111111111111',
        AMAPId: amaps[0]?.id || null
      },
      {
        name: 'Tom Hardy',
        email: 'tom.hardy@example.com',
        nif: 918726391,
        role: 'Producer',
        authuserid: 'a1111222-1111-1111-1111-111111111111',
        AMAPId: amaps[0]?.id || null
      },
      {
        name: 'Bruce Willis',
        email: 'bruce.willis@example.com',
        nif: 192831984,
        role: 'Producer',
        authuserid: 'c3333444-3333-3333-3333-333333333333', // Replace with actual UUID from auth.users
        AMAPId: amaps[0]?.id || null
      },
      {
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        nif: 987654321,
        role: 'Admin',
        authuserid: 'b2222222-2222-2222-2222-222222222222', // Replace with actual UUID from auth.users
        AMAPId: amaps[0]?.id || null
      },
      {
        name: 'Alice Johnson',
        email: 'alice.johnson@example.com',
        nif: 456789123,
        role: 'AMAP Admin',
        authuserid: 'c3333333-3333-3333-3333-333333333333', // Replace with actual UUID from auth.users
        AMAPId: amaps[0]?.id || null
      },
      {
        name: 'Bob Williams',
        email: 'bob.williams@example.com',
        nif: 789123456,
        role: 'Co-Producer',
        authuserid: 'd4444444-4444-4444-4444-444444444444', // Replace with actual UUID from auth.users
        AMAPId: amaps[0]?.id || null
      },
      {
        name: 'Robbin Williams',
        email: 'robbin.williams@example.com',
        nif: 789123443,
        role: 'Co-Producer',
        authuserid: 'd4444555-4444-4444-4444-444444444444', // Replace with actual UUID from auth.users
        AMAPId: amaps[0]?.id || null
      },
      {
        name: 'Mike Tyson',
        email: 'mike.tyson@example.com',
        nif: 789123477,
        role: 'Co-Producer',
        authuserid: 'd4444666-4444-4444-4444-444444444444', // Replace with actual UUID from auth.users
        AMAPId: amaps[0]?.id || null
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {});
  },
};
