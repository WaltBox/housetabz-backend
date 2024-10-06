const { Sequelize, DataTypes } = require('sequelize');
const config = require('../config/config');

// Pass the logging option from config to the Sequelize constructor
const sequelize = new Sequelize(config.databaseUrl, {
  dialect: 'postgres',
  logging: config.sequelize ? config.sequelize.logging : console.log, // Use the logging configuration if defined
});

// Import models and pass sequelize and DataTypes
const User = require('./user')(sequelize, DataTypes);
const House = require('./house')(sequelize, DataTypes);
const Partner = require('./partner')(sequelize, DataTypes);
const ServicePlan = require('./servicePlan')(sequelize, DataTypes);
const HouseService = require('./houseService')(sequelize, DataTypes);

// Add models to the db object for exporting
const db = {
  sequelize,
  Sequelize,
  User,
  House,
  Partner,
  ServicePlan,
  HouseService,
};

// Setup associations
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db;
