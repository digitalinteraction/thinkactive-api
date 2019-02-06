'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('deploymentDevices', [{
      deploymentUserId: 1,
      deploymentId: 1,
      deviceId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      isActiveDevice: true
    },
    {
      deploymentUserId: 2,
      deploymentId: 1,
      deviceId: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
      isActiveDevice: true
    },
    {
      deploymentUserId: 3,
      deploymentId: 1,
      deviceId: 3,
      createdAt: new Date(),
      updatedAt: new Date(),
      isActiveDevice: true
    },
    {
      deploymentUserId: 4,
      deploymentId: 1,
      deviceId: 4,
      createdAt: new Date(),
      updatedAt: new Date(),
      isActiveDevice: true
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('deploymentDevices', null, {});
  }
};
