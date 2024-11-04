require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL || 'postgres://postgres:HouseTabzdev2024@housetabz-development.cjue82oi8gwl.us-east-2.rds.amazonaws.com:5432/housetabzdevelopement',
};