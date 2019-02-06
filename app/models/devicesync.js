'use strict';
module.exports = (sequelize, DataTypes) => {
  var deviceSync = sequelize.define('deviceSync', {
    batteryLevel: DataTypes.INTEGER,
    deploymentDeviceId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    deploymentUserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    raw: {
      type: DataTypes.TEXT('long'),
      allowNull: true
    }
  }, {});

  deviceSync.associate = function (models) {
    deviceSync.hasMany(models.deviceData);
  };

  return deviceSync;
};
