module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('challenges', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      deploymentId: Sequelize.INTEGER,
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      message: Sequelize.TEXT,
      metric: {
        type: Sequelize.ENUM,
        values: ['TOTAL', 'AVERAGE'],
        allowNull: false
      },
      mode: {
        type: Sequelize.ENUM,
        values: ['EVERYONE', 'GROUP'],
        allowNull: false
      },
      target: Sequelize.INTEGER,
      start: {
        type: Sequelize.DATE,
        allowNull: false
      },
      end: {
        type: Sequelize.DATE,
        allowNull: false
      },
      deletedAt: Sequelize.DATE
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('challenges');
  }
};
