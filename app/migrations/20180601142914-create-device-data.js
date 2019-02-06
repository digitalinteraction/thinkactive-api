module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('deviceData', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      steps: Sequelize.INTEGER,
      recordedOn: Sequelize.DATE,
      batteryLevel: Sequelize.INTEGER,
      deviceSyncId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      deploymentDeviceId: {
        type: Sequelize.INTEGER,
        allowNull: false
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('deviceData');
  }
};
