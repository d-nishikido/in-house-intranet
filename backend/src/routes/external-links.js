const express = require('express');
const router = express.Router();
const db = require('../config/database');

// GET all external links
router.get('/', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM external_links WHERE is_active = true ORDER BY name ASC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching external links:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET external link by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      'SELECT * FROM external_links WHERE id = $1',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'External link not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching external link:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST increment access count
router.post('/:id/access', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      'UPDATE external_links SET access_count = access_count + 1 WHERE id = $1 RETURNING *',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'External link not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating access count:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET links by category
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const result = await db.query(
      'SELECT * FROM external_links WHERE category = $1 AND is_active = true ORDER BY name ASC',
      [category]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching external links by category:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;