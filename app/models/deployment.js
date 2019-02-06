module.exports = (sequelize, DataTypes) => {
  var deployment = sequelize.define('deployment', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    organisationId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    baselineFrom: {
      type: DataTypes.DATE,
      allowNull: false
    },
    baselineTo: {
      type: DataTypes.DATE,
      allowNull: false
    },
    activityFrom: {
      type: DataTypes.DATE,
      allowNull: false
    },
    activityTo: {
      type: DataTypes.DATE,
      allowNull: false
    },
    createdBy: DataTypes.INTEGER,
    location: {
      type: DataTypes.STRING,
      allowNull: false
    },
    pointOfContact: DataTypes.STRING
  }, {});
  deployment.associate = function (models) {
    // deployment.belongsToMany(models.device, { through: models.deploymentDevice, foreignKey: 'deploymentId' });

    deployment.hasMany(models.deploymentDevice);


  };
  return deployment;
};
