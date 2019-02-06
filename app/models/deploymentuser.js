module.exports = (sequelize, DataTypes) => {
  var deploymentUser = sequelize.define('deploymentUser', {
    deploymentId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    avatar: DataTypes.STRING,
    colour: DataTypes.STRING,
    animal: DataTypes.STRING
  }, {});

  deploymentUser.associate = function (models) {
    deploymentUser.hasMany(models.deploymentDevice);
    deploymentUser.belongsTo(models.user);
  };

  return deploymentUser;
};
