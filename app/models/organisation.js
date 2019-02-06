module.exports = (sequelize, DataTypes) => {
  var organisation = sequelize.define('organisation', {
    name: {
      type: DataTypes.STRING,
      unique: true
    }
  }, {});

  organisation.associate = function (models) {
    // organisation.hasMany(models.organisationUser);
    organisation.belongsToMany(models.user, { through: models.organisationUser, foreignKey: 'organisationId' });
  };

  return organisation;
};
