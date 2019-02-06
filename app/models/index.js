const fs = require('fs');
const path = require('path');

const basename = path.basename(__filename);
const Sequelize = require('sequelize');
let config = require('../config/db.js');

if (process.env.NODE_ENV === 'production') {
  config = config.production;
}
else if (process.env.NODE_ENV === 'testing') {
  config = config.testing;
}
else {
  config = config.development;
}

const db = {};
db.sequelize = new Sequelize(config.database, config.username, config.password, config);
db.Sequelize = Sequelize;

fs
  .readdirSync(__dirname)
  .filter((file) => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach((file) => {
    var model = db.sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});


module.exports = db;
