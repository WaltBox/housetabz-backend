const { sequelize } = require('./src/models');
const { execSync } = require('child_process');

// Run migrations before running any tests
beforeAll(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connected to the test database successfully.');

    console.log('Running migrations...');
    execSync('npx sequelize-cli db:migrate', { stdio: 'inherit' });
    console.log('Migrations ran successfully.');
  } catch (error) {
    console.error('Unable to connect to or migrate the database:', error);
  }
});

// Close the database connection after all tests have run
afterAll(async () => {
  await sequelize.close();
});
