module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('deploymentDevices', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      deploymentId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'deployments',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      deviceId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'devices',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      deploymentUserId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'deploymentUsers',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      isActiveDevice: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        allowNull: false
      },
      lastBlockSynced: Sequelize.INTEGER,
      lastRTC: Sequelize.BIGINT,
      lastSyncTime: Sequelize.DATE
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('deploymentDevices');
  }
};
