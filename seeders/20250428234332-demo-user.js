'use strict';
const bcrypt = require('bcryptjs');
const saltRounds = 10;

module.exports = {
  async up(queryInterface, Sequelize) {
    const hashedPassword = await bcrypt.hash('Demo', saltRounds);

    await queryInterface.bulkInsert('Users', [{
      username: 'demo',
      password: hashedPassword, 
      createdAt: new Date(),
      updatedAt: new Date(),
    }], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  }
};
