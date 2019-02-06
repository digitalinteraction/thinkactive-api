module.exports = (sequelize, DataTypes) => {
  var organisationUser = sequelize.define('organisationUser', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    organisationId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    role: {
      type: DataTypes.ENUM('organisationOwner', 'organisationMember')
    }
  }, {});

  organisationUser.associate = function (models) {
  };

  return organisationUser;
};
