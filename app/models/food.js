module.exports = (sequelize, DataTypes) => {
    var food = sequelize.define('food', {
      id: { type: DataTypes.INTEGER, unique: true, primaryKey: true },
      name: { type: DataTypes.STRING, unique: true },
      group: { type: DataTypes.INTEGER, validate: { min: 0, max: 4 } },
      fat: { type: DataTypes.INTEGER, validate: { min: 0, max: 2 } },
      sugar: { type: DataTypes.INTEGER, validate: { min: 0, max: 2 } },
      energy: { type: DataTypes.INTEGER, validate: { min: 0, max: 2 } }
    }, {});
  
    /*food.associate = function (models) {
      food.belongsToMany(models.device, { through: 'deploymentDevices', foreignKey: 'foodId' });
    };*/
  
    return food;
  };