module.exports = (sequelize, DataTypes) => {
  var device = sequelize.define(
    'device',
    {
      macAddress: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      epochInterval: DataTypes.INTEGER,
      organisationId: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    },
    {}
  );

  device.associate = function (models) {
    // device.hasMany(models.deploymentUser, { through: models.deploymentDevice, foreignKey: 'deploymentUserId' });

    // device.belongsToMany(models.deployment, { through: models.deploymentDevice, foreignKey: 'deploymentId' });

    device.hasMany(models.deploymentDevice);
  };

  return device;
};
