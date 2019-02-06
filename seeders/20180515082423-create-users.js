'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('users', [{
      username: 'Andy',
      password: '$2a$10$v9sqjYwIY09VFT1C/9r6OOclxbVHWjmCLAC.U1sXvE54EHKnX9iHa',
      email: 'atgarbett@gmail.com',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      username: 'Rob',
      password: '$2a$10$ERUsoDova4I5aVO6vfY4Qu86DP5yfFkoudjqBvbZRvY.eXPkC/eGu',
      email: 'rob@andrsn.uk',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('users', null, {});
  }
};
