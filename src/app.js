const express = require('express');
const cors = require('cors');
const config = require('./config/config');
const userRoutes = require('./routes/userRoutes');
const houseRoutes = require('./routes/houseRoutes');
const partnerRoutes = require('./routes/partnerRoutes');
const serviceRequestBundleRoutes = require('./routes/serviceRequestBundleRoutes');
const billRoutes = require('./routes/billRoutes');
const chargeRoutes = require('./routes/chargeRoutes');
const taskRoutes = require('./routes/taskRoutes');
const rhythmOffersRoutes = require('./routes/rhythmOffersRoutes');
const rhythmOfferRequestRoutes = require('./routes/rhythmOfferRequestRoutes');
const sparklyRequestRoutes = require('./routes/sparklyRequestRoutes');
const sequelize = require('./config/database');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swaggerConfig');
const morgan = require('morgan');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Swagger setup
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/houses', houseRoutes);
app.use('/api/partners', partnerRoutes);
app.use('/api', serviceRequestBundleRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/houses', billRoutes);
app.use('/api/users', chargeRoutes);
app.use('/api/v2/rhythm-offers', rhythmOffersRoutes);
app.use('/api/user', rhythmOfferRequestRoutes);
app.use('/api/partners', sparklyRequestRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to HouseTabz Backend!' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Test database connection before syncing
const initializeDatabase = async () => {
  try {
    // Test the connection
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');

    // Sync the database (without force)
    await sequelize.sync();
    console.log('Database synced');

    // Start the server
    app.listen(config.port, () => {
      console.log(`Server running in ${config.nodeEnv} mode on port ${config.port}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
};


// Initialize database and start server
initializeDatabase();

module.exports = app;