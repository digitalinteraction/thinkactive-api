module.exports = (sequelize, DataTypes) => {
  var deviceData = sequelize.define('deviceData', {
    steps: DataTypes.INTEGER,
    recordedOn: DataTypes.DATE,
    batteryLevel: DataTypes.INTEGER,
    deviceSyncId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    deploymentDeviceId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    deploymentUserId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {});

  deviceData.associate = function (models) {
    deviceData.belongsTo(models.deviceSync);
  };

  return deviceData;
};
