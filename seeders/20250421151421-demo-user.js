'use strict';
const bcrypt = require('bcryptjs'); 

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const hashed = await bcrypt.hash('password', 10); 

    return queryInterface.bulkInsert('Users', [{
      username: 'demo',
      password: hashed,
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Users', null, {});
  }
};