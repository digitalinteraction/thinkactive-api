module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('organisationUsers', [{
      organisationId: 1,
      userId: 1,
      role: 'organisationOwner',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      organisationId: 1,
      userId: 2,
      role: 'organisationOwner',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('organisationUsers', null, {});
  }
};
