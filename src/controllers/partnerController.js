const { Partner, ServiceRequestBundle, PartnerKey } = require('../models');
const crypto = require('crypto');
const axios = require('axios');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const partnerController = {
  // Create a new partner
  async createPartner(req, res) {
    console.log('Request received at createPartner');
    console.log('Request body:', req.body);
    try {
      const { name, registration_code } = req.body;
  
      if (!name || !registration_code) {
        console.log('Validation failed:', { name, registration_code });
        return res.status(400).json({ message: 'Name and Registration Code are required.' });
      }
  
      const partner = await Partner.create(req.body);
  
      console.log('Partner created:', partner);
      res.status(201).json({
        message: 'Partner created successfully',
        partner: {
          id: partner.id,
          name: partner.name,
        },
      });
    } catch (error) {
      console.error('Error in createPartner:', error);
      res.status(500).json({ message: 'Failed to create partner' });
    }
  },
  
  

  // Complete Registration
  async completeRegistration(req, res) {
    try {
      const { id, phone_number, email, password } = req.body;
  
      if (!id || !phone_number || !email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
      }
  
      const partner = await Partner.findOne({ where: { id } });
  
      if (!partner) {
        return res.status(404).json({ error: 'Partner not found' });
      }
  
      partner.phone_number = phone_number;
      partner.email = email;
      partner.password = await bcrypt.hash(password, 10); // Hash the password for security
      await partner.save();
  
      res.status(200).json({ message: 'Registration completed successfully' });
    } catch (error) {
      console.error('Error completing registration:', error);
      res.status(500).json({ error: 'Failed to complete registration' });
    }
  },
  

  async verifyPartner(req, res) {
    try {
      const { name, registration_code } = req.body;
  
      if (!name || !registration_code) {
        return res
          .status(400)
          .json({ error: "Both name and registration code are required." });
      }
  
      const partner = await Partner.findOne({
        where: { name, registration_code },
        attributes: ['id', 'name', 'registration_code'], // Only return essential fields
      });
  
      if (!partner) {
        return res.status(404).json({ error: "Invalid name or registration code" });
      }
  
      res.status(200).json({ partner });
    } catch (error) {
      console.error("Error verifying partner:", error);
      res.status(500).json({ error: "Failed to verify partner" });
    }
  },
  
  

  // Login
  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }

      const partner = await Partner.findOne({ where: { email } });

      if (!partner) {
        return res.status(404).json({ error: 'Invalid email or password' });
      }

      const isMatch = await bcrypt.compare(password, partner.password);

      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      const token = jwt.sign(
        { id: partner.id, email: partner.email },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      res.status(200).json({ token, message: 'Login successful' });
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ error: 'Failed to log in' });
    }
  },

  // Get all partners
  async getAllPartners(req, res) {
    try {
      const partners = await Partner.findAll({
        attributes: ['id', 'name', 'logo', 'about', 'email', 'phone_number'],
      });

      res.status(200).json({ partners });
    } catch (error) {
      console.error('Error fetching partners:', error);
      res.status(500).json({ error: 'Failed to fetch partners' });
    }
  },

  // Get a specific partner by ID
  async getPartnerById(req, res) {
    try {
      const { id } = req.params;

      const partner = await Partner.findOne({
        where: { id },
        attributes: [
          'id',
          'name',
          'logo',
          'about',
          'important_information',
          'registration_code',
          'person_of_contact',
          'email',
          'phone_number',
        ],
      });

      if (!partner) {
        return res.status(404).json({ error: 'Partner not found' });
      }

      res.status(200).json({ partner });
    } catch (error) {
      console.error('Error fetching partner:', error);
      res.status(500).json({ error: 'Failed to fetch partner' });
    }
  },

  // Stage authorization
  async stageAuthorization(req, res) {
    try {
      const { houseId, userId, transactionId, serviceName, pricing } = req.body;

      if (!houseId || !userId || !transactionId || !serviceName || !pricing) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const serviceRequestBundle = await ServiceRequestBundle.create({
        houseId,
        userId,
        status: 'pending',
        transactionId,
      });

      res.status(201).json({
        message: 'Authorization staged successfully',
        serviceRequestBundle,
      });
    } catch (error) {
      console.error('Error staging authorization:', error);
      res.status(500).json({ error: 'Failed to stage authorization' });
    }
  },

  // Retrieve API keys for a partner
  async getApiKeys(req, res) {
    try {
      const { partnerId } = req.params;

      const apiKeys = await PartnerKey.findAll({
        where: { partnerId },
        attributes: ['id', 'api_key', 'secret_key'],
      });

      if (!apiKeys || apiKeys.length === 0) {
        return res.status(404).json({ error: 'No API keys found for this partner' });
      }

      res.status(200).json({ apiKeys });
    } catch (error) {
      console.error('Error fetching API keys:', error);
      res.status(500).json({ error: 'Failed to fetch API keys' });
    }
  },
};

module.exports = partnerController;