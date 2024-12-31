const express = require('express');
const router = express.Router();
const pool = require('../db');

router.post('/', async (req, res) => {
  console.log('Received address payload:', req.body); // Debug log

  try {
    const {
      type,
      houseNumber,
      street,
      area,
      landmark,
      latitude,
      longitude,
      fullAddress
    } = req.body;

    // Input validation
    if (!type || !street || !area || !latitude || !longitude) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['type', 'street', 'area', 'latitude', 'longitude']
      });
    }

    const query = `
      INSERT INTO addresses 
        (type, house_number, street, area, landmark, latitude, longitude, full_address)
      VALUES 
        ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;

    const values = [
      type,
      houseNumber,
      street,
      area,
      landmark,
      latitude,
      longitude,
      fullAddress
    ];

    console.log('Executing query with values:', values); 

    const result = await pool.query(query, values);
    
    console.log('Query result:', result.rows[0]); 
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Detailed error:', error); 
    res.status(500).json({ 
      error: 'Failed to save address',
      details: error.message,
      hint: error.hint
    });
  }
});

module.exports = router;