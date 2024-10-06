const request = require('supertest');
const app = require('../src/app'); // Path to your Express app

describe('House Controller', () => {
  it('should create a new house', async () => {
    const newHouse = {
      name: 'Test House',
      address: '123 Test Street',
    };

    const response = await request(app)
      .post('/api/houses')
      .send(newHouse);

    expect(response.statusCode).toBe(201);
    expect(response.body.message).toBe('House created successfully');
    expect(response.body.house).toHaveProperty('id');
    expect(response.body.house.name).toBe('Test House');
    expect(response.body.house.address).toBe('123 Test Street');
  });


  it('should not create a house without an address', async () => {
    const newHouse = {
      name: 'Test House',
    };

    const response = await request(app)
      .post('/api/houses')
      .send(newHouse);

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe('House address is required');
  });
});
