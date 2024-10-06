const { House, User } = require('../models');
const { body, validationResult } = require('express-validator');

// Create a new house with validation
exports.createHouse = [
  body('name').notEmpty().withMessage('House name is required'),
  body('address').notEmpty().withMessage('House address is required'),

  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    try {
      const { name, address } = req.body;
      const house = await House.create({ name, address });
      res.status(201).json({
        message: 'House created successfully',
        house,
      });
    } catch (error) {
      next(error);
    }
  }
];

// Get all houses
exports.getAllHouses = async (req, res, next) => {
  try {
    const houses = await House.findAll({ include: 'users' });
    res.status(200).json(houses);
  } catch (error) {
    next(error);
  }
};

// Get a single house
exports.getHouse = async (req, res, next) => {
  try {
    const house = await House.findByPk(req.params.id, { include: 'users' });
    if (!house) {
      return res.status(404).json({ message: 'House not found' });
    }
    res.json(house);
  } catch (error) {
    next(error);
  }
};

// Update a house with validation
exports.updateHouse = [
  body('name').optional().notEmpty().withMessage('House name cannot be empty'),
  body('address').optional().notEmpty().withMessage('House address cannot be empty'),

  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    try {
      const { name, address } = req.body;
      const house = await House.findByPk(req.params.id);
      if (!house) {
        return res.status(404).json({ message: 'House not found' });
      }
      await house.update({ name, address });
      res.json({
        message: 'House updated successfully',
        house,
      });
    } catch (error) {
      next(error);
    }
  }
];

// Delete a house
exports.deleteHouse = async (req, res, next) => {
  try {
    const house = await House.findByPk(req.params.id);
    if (!house) {
      return res.status(404).json({ message: 'House not found' });
    }
    await house.destroy();
    res.json({ message: 'House deleted successfully' });
  } catch (error) {
    next(error);
  }
};
