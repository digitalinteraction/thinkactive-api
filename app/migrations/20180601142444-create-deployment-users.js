module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('deploymentUsers', {
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
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      avatar: Sequelize.STRING,
      colour: Sequelize.STRING,
      animal: Sequelize.STRING
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('deploymentUsers');
  }
};
