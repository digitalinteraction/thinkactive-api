module.exports = (sequelize, DataTypes) => {
  var deploymentDevice = sequelize.define(
    'deploymentDevice', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
      },
      deploymentId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      deviceId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      deploymentUserId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      isActiveDevice: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false
      },
      lastBlockSynced: DataTypes.INTEGER,
      lastRTC: DataTypes.BIGINT,
      lastSyncTime: DataTypes.DATE
    },
    {
      defaultScope: {
        where: {
          isActiveDevice: true
        }
      }
    }
  );

  deploymentDevice.associate = function (models) {
    deploymentDevice.belongsTo(models.device);
    deploymentDevice.belongsTo(models.deploymentUser);
    deploymentDevice.belongsTo(models.deployment);
  };

  return deploymentDevice;
};
