module.exports = (sequelize, DataTypes) => {
    var deploymentUserState = sequelize.define('deploymentUserState', {
      id: { type: DataTypes.INTEGER, unique: true, autoIncrement: true, primaryKey: true },
      deploymentUserId: { type: DataTypes.INTEGER },
      lastQuestionId: { type: DataTypes.INTEGER },
      questionAttemptNumber: { type: DataTypes.INTEGER },
      questionAnsweredCorrectly: { type: DataTypes.BOOLEAN, default: false }
    }, {});
  
    /*deploymentUserState.associate = function (models) {
        deploymentUserState.belongsToMany(models.device, { through: 'deploymentDevices', foreignKey: 'deploymentUserStateId' });
    };*/
  
    return deploymentUserState;
  };

  /*  These can now be infered from the questionID.
  
      happyOrStressed: { type: DataTypes.BOOLEAN, default: true },
      strongOrWeak: { type: DataTypes.BOOLEAN, default: true },
      refreshedOrSleepy: { type: DataTypes.BOOLEAN, default: true },
      energeticOrTired:{ type: DataTypes.BOOLEAN, default: true },
      healthyOrIll: { type: DataTypes.BOOLEAN, default: true },
      fullOrHungry: { type: DataTypes.BOOLEAN, default: true },
      fruitAndVegetables: { type: DataTypes.INTEGER, default: 2, validate: { min: 0, max: 2 } },
      protein: { type: DataTypes.INTEGER, default: 2, validate: { min: 0, max: 2 } },
      fatsAndSugars: { type: DataTypes.INTEGER, default: 2, validate: { min: 0, max: 2 } },
      milkAndDairy: { type: DataTypes.INTEGER, default: 2, validate: { min: 0, max: 2 } },
      carbohydrates: { type: DataTypes.INTEGER, default: 2, validate: { min: 0, max: 2 } }
      */
