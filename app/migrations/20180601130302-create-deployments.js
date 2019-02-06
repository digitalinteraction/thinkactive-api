module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('deployments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      organisationId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      baselineFrom: {
        type: Sequelize.DATE,
        allowNull: false
      },
      baselineTo: {
        type: Sequelize.DATE,
        allowNull: false
      },
      activityFrom: {
        type: Sequelize.DATE,
        allowNull: false
      },
      activityTo: {
        type: Sequelize.DATE,
        allowNull: false
      },
      createdBy: Sequelize.INTEGER,
      location: {
        type: Sequelize.STRING,
        allowNull: false
      },
      pointOfContact: Sequelize.STRING
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('deployments');
  }
};
