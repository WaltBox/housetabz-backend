const request = require('supertest');
const app = require('../src/app');
const { sequelize } = require('../src/models'); // Import sequelize instance for syncing

// Sync the test database before running any tests
beforeAll(async () => {
  await sequelize.sync({ force: true }); // This ensures the database schema is created for testing
});

// Close the database connection after all tests have run
afterAll(async () => {
  await sequelize.close();
});

describe('User Controller', () => {
  it('should create a new user', async () => {
    const newUser = {
      username: 'testuser',
      email: 'testuser@example.com',
    };

    const response = await request(app)
      .post('/api/users')
      .send(newUser);

    expect(response.statusCode).toBe(201);
  });
});
