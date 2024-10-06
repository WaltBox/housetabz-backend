// jest.setup.js
const { sequelize } = require('./src/models');

// Sync the test database before running any tests
beforeAll(async () => {
  await sequelize.sync({ force: true }); // Create tables for the test database
});
