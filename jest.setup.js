const { sequelize } = require('./src/models');

// Sync the test database before running any tests
beforeAll(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connected to the test database successfully.');
    
    console.log('Attempting to sync the test database...');
    await sequelize.sync({ force: true }); // This ensures that all tables are created before tests run
    console.log('Database synced successfully.');
  } catch (error) {
    console.error('Unable to connect to or sync the database:', error);
  }
});

// Close the database connection after all tests have run
afterAll(async () => {
  await sequelize.close();
});
