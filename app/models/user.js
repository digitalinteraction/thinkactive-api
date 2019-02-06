const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define(
    'user', {
      username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: true,
        defaultValue: null,
        validate: {
          notEmpty: true,
          isAlphanumeric: true,
          isUnique: async (username, next) => {
            const user = await User.findOne({
              where: { username }
            });
            if (user) return next('Username must be unique');
            return next();
          }
        }
      },
      password: {
        type: DataTypes.STRING,
        allowNull: true
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          notEmpty: true,
          isEmail: true,
          len: [3, 254],
          isUnique: async (email, next) => {
            const user = await User.findOne({
              where: { email }
            });
            if (user) return next('Email has already been taken');
            return next();
          }
        }
      }
    },
    {
      defaultScope: {
        attributes: ['id', 'username', 'email', 'createdAt', 'updatedAt']
      },
      scopes: {
        withPassword: {
          attributes: ['id', 'username', 'password', 'email', 'createdAt', 'updatedAt']
        }
      }
    }
  );

  User.prototype.toJSON = function toJson() {
    // console.log(this.attributes);
    const values = Object.assign({}, this.get());
    delete values.password;
    return values;
  };

  User.hashPassword = async function hashPassword(password) {
    const salt = await bcrypt.genSalt(parseInt(process.env.AUTH_BCRYPT_SALT_ITERATIONS, 10));
    return bcrypt.hash(password, salt);
  };

  User.associate = function forgottenPasswords(models) {
    User.hasMany(models.forgottenPassword);
    // User.hasMany(models.organisationUser);
    User.belongsToMany(models.organisation, { through: models.organisationUser, foreignKey: 'userId' });

    User.hasMany(models.deploymentUser);
  };

  return User;
};
