module.exports = (sequelize, DataTypes) => {
  var forgottenPassword = sequelize.define('forgottenPassword', {
    userId: DataTypes.INTEGER,
    token: DataTypes.STRING,
    hasExpired: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {});

  return forgottenPassword;
};
