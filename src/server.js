const app = require('./app');
const config = require('./config/config');
const { sequelize } = require('./models');

sequelize.sync({ alter: true })
  .then(() => {
    console.log('Database synced');
    app.listen(config.port, () => {
      console.log(`Server running in ${config.nodeEnv} mode on port ${config.port}`);
    });
  })
  .catch(err => console.error('Unable to sync database:', err));
