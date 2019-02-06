module.exports = (sequelize, DataTypes) => {
  var Challenge = sequelize.define('challenge', {
    deploymentId: DataTypes.INTEGER,
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    message: DataTypes.TEXT,
    metric: {
      type: DataTypes.ENUM,
      values: ['TOTAL', 'AVERAGE'],
      allowNull: false
    },
    mode: {
      type: DataTypes.ENUM,
      values: ['EVERYONE', 'GROUP'],
      allowNull: false
    },
    target: DataTypes.INTEGER,
    start: {
      type: DataTypes.DATE,
      allowNull: false
    },
    end: {
      type: DataTypes.DATE,
      allowNull: false
    },
    deletedAt: DataTypes.DATE
  }, {});
  return Challenge;
};

