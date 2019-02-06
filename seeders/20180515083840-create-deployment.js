'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('deployments', [{
      name: 'Andys test deployment',
      organisationId: 1,
      baselineFrom: '2018-03-15 14:52:57',
      baselineTo: '2018-03-15 14:52:57',
      activityFrom: '2018-03-15 14:52:57',
      activityTo: '2018-03-15 14:52:57',
      createdBy: null,
      location: 'St Johns Primary',
      pointOfContact: 'Mary Jane',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('deployments', null, {});
  }
};
