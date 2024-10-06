const { sequelize } = require('./src/models');

// Sync the test database before running any tests
beforeAll(async () => {
  await sequelize.sync({ force: true }); // Create tables for the test database
});

// Close the database connection after all tests have run
afterAll(async () => {
  await sequelize.close();
});
