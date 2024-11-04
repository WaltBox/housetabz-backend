const { Sequelize } = require('sequelize');
const pg = require('pg');
require('dotenv').config();

const sequelize = new Sequelize('housetabzdevelopement', 'postgres', 'HouseTabzdev2024', {
  host: 'housetabz-development.cjue82oi8gwl.us-east-2.rds.amazonaws.com',
  port: 5432,
  dialect: 'postgres',
  dialectModule: pg,
  logging: console.log,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
      sslmode: 'require'
    },
    keepAlives: 1,
    keepAlivesIdle: 30000,
    statement_timeout: 60000
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

// Test function
const testConnection = async () => {
  try {
    // First try a raw connection
    const { Client } = require('pg');
    const client = new Client({
      host: 'housetabz-development.cjue82oi8gwl.us-east-2.rds.amazonaws.com',
      port: 5432,
      database: 'housetabzdevelopement',
      user: 'postgres',
      password: 'HouseTabzdev2024',
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    });

    console.log('Attempting direct connection...');
    await client.connect();
    console.log('Direct connection successful');
    const result = await client.query('SELECT NOW()');
    console.log('Query result:', result.rows[0]);
    await client.end();

    // Then try Sequelize
    console.log('Attempting Sequelize connection...');
    await sequelize.authenticate();
    console.log('Sequelize connection successful');
  } catch (error) {
    console.error('Connection error:', error);
    throw error;
  }
};

// Run the test immediately
testConnection().catch(console.error);

module.exports = sequelize;