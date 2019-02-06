module.exports = (sequelize, DataTypes) => {
    var question = sequelize.define('question', {
      id: { type: DataTypes.INTEGER, unique: true, primaryKey: true },
      level: { type: DataTypes.INTEGER, validate: { min: 1, max: 3 } },
      text: { type: DataTypes.STRING, unique: true },
      questionState: { type: DataTypes.JSON },
      answerType: { type: DataTypes.INTEGER, validate: { min: 0, max: 2 } },
      answerRequirement: { type: DataTypes.INTEGER, validate: { min: 0, max: 2 } },
      answerContents: { type: DataTypes.STRING },
      answerRestrictions: { type: DataTypes.STRING, defaultValue: '' },
      resultState: { type: DataTypes.JSON }
    }, {});
  
    /*food.associate = function (models) {
      food.belongsToMany(models.device, { through: 'deploymentDevices', foreignKey: 'foodId' });
    };*/
  
    return question;
  };