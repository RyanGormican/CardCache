const express = require('express');
const pool = require('./db');

const router = express.Router();

router.post('/add-suggestion', async (req, res) => {
  console.log('Received POST request to /add-suggestion');
  try {
    const { name = 'Anonymous', topic, suggestion, date } = req.body;
    const query = 'INSERT INTO suggestions (name, topic, suggestion, date) VALUES ($1, $2, $3, $4)';
    await pool.query(query, [name, topic, suggestion, date]);
    console.log('Suggestion added successfully');
    res.status(201).json({ message: 'Suggestion added successfully' });
  } catch (error) {
    console.error('Error adding suggestion:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

router.get('/get-suggestions', async (req, res) => {
  console.log('Received GET request to /get-suggestions');
  try {
    const query = 'SELECT * FROM suggestions';
    const result = await pool.query(query);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

module.exports = router;
