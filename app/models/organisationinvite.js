module.exports = (sequelize, DataTypes) => {
  var organisationInvite = sequelize.define('organisationInvite', {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true
      }
    },
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    code: {
      type: DataTypes.STRING,
      allowNull: false
    },
    organisationId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    createdBy: DataTypes.INTEGER,
    hasExpired: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    }
  }, {});
  return organisationInvite;
};
