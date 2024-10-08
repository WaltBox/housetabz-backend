const { Sequelize } = require('sequelize');
const config = require('../src/config/config');

const sequelize = new Sequelize(config.databaseUrl, {
  dialect: 'postgres',
  logging: console.log,
});

module.exports = sequelize;