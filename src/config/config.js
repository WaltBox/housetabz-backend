require('dotenv').config();

const environments = {
  development: {
    port: process.env.PORT || 3000,
    nodeEnv: 'development',
    databaseUrl: process.env.DATABASE_URL || 'postgres://postgres:6490Hill@localhost:5432/housetabz_db',
  },
  test: {
    port: process.env.TEST_PORT || 3001,
    nodeEnv: 'test',
    databaseUrl: process.env.TEST_DATABASE_URL || 'postgres://waltboxwell:6490Hill@localhost:5432/housetabz_db_test',
    sequelize: {
      logging: false, // Disable logging during tests
    },
  },
  production: {
    port: process.env.PORT || 3000,
    nodeEnv: 'production',
    databaseUrl: process.env.DATABASE_URL,
  },
};

const currentEnv = process.env.NODE_ENV || 'development';
module.exports = environments[currentEnv];
