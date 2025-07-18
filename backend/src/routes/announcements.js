const express = require('express');
const router = express.Router();
const db = require('../config/database');

router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    
    // Get total count
    const countResult = await db.query('SELECT COUNT(*) FROM announcements');
    const totalCount = parseInt(countResult.rows[0].count);
    
    // Get paginated results
    const result = await db.query(
      'SELECT id, title, content, created_at, updated_at FROM announcements ORDER BY created_at DESC LIMIT $1 OFFSET $2',
      [limit, offset]
    );
    
    const totalPages = Math.ceil(totalCount / limit);
    
    res.json({
      data: result.rows,
      pagination: {
        currentPage: page,
        totalPages: totalPages,
        totalCount: totalCount,
        limit: limit,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching announcements:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      'SELECT id, title, content, created_at, updated_at FROM announcements WHERE id = $1',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Announcement not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching announcement:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;