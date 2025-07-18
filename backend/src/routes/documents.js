const express = require('express');
const router = express.Router();
const db = require('../config/database');

router.get('/', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT id, title, type, status, created_at FROM documents ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching documents:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/status-count', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT status, COUNT(*) as count FROM documents GROUP BY status'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching document status count:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;