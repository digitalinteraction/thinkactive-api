module.exports = {
  development: {
    database: 'DATABASE',
    username: 'USERNAME',
    password: 'PASSWORD',
    dialect: 'mysql',
    host: 'HOST'
  },
  test: {
    dialect: 'mysql',
    storage: ':memory:'
  },
  production: {
    database: 'DATABASE',
    username: 'USERNAME',
    password: 'PASSWORD',
    dialect: 'mysql',
    host: 'HOST'
  }
};
