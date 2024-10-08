const { Sequelize, DataTypes } = require('sequelize');
const config = require('../config/config');

const sequelize = new Sequelize(config.databaseUrl, {
  dialect: 'postgres',
  logging: config.sequelize ? config.sequelize.logging : console.log,
});

const db = {
  sequelize,
  Sequelize,
  User: require('./user')(sequelize, DataTypes),
  House: require('./house')(sequelize, DataTypes),
  Partner: require('./partner')(sequelize, DataTypes),
  ServicePlan: require('./servicePlan')(sequelize, DataTypes),
  HouseService: require('./houseService')(sequelize, DataTypes),
};

// Set up associations if they exist
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db;
