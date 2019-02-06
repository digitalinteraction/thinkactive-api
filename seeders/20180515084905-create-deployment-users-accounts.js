'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('users', [{
      username: 'red-deer-1',
      password: null,
      email: null,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      username: 'red-boar-1',
      password: null,
      email: null,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      username: 'blue-giraffe-1',
      password: null,
      email: null,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      username: 'blue-dog-1',
      password: null,
      email: null,
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('users', null, {});
  }
};
