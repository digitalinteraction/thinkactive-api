'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('deploymentUsers', [{
      deploymentId: 1,
      userId: 2,
      avatar: 'red-deer',
      colour: 'red',
      animal: 'deer',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      deploymentId: 1,
      userId: 3,
      avatar: 'red-boar',
      colour: 'red',
      animal: 'boar',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      deploymentId: 1,
      userId: 4,
      avatar: 'blue-giraffe',
      colour: 'blue',
      animal: 'giraffe',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      deploymentId: 1,
      userId: 5,
      avatar: 'blue-dog',
      colour: 'blue',
      animal: 'dog',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('deploymentUsers', null, {});
  }
};
