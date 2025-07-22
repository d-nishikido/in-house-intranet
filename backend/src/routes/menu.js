const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

// Get all menu structure (categories with items)
router.get('/', authenticateToken, async (req, res) => {
  try {
    // Get all active categories
    const categoriesResult = await pool.query(
      'SELECT * FROM menu_categories WHERE is_active = true ORDER BY order_index'
    );
    const categories = categoriesResult.rows;

    // Get all active items grouped by category
    const itemsResult = await pool.query(
      'SELECT * FROM menu_items WHERE is_active = true ORDER BY category_id, order_index'
    );
    const items = itemsResult.rows;

    // Group items by category
    const menuStructure = categories.map(category => {
      const categoryItems = items.filter(item => item.category_id === category.id);
      return {
        ...category,
        items: categoryItems
      };
    });

    res.json({ success: true, data: menuStructure });
  } catch (error) {
    console.error('Error fetching menu structure:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch menu structure' });
  }
});

// Get all menu categories
router.get('/categories', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM menu_categories WHERE is_active = true ORDER BY order_index'
    );
    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Error fetching menu categories:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch menu categories' });
  }
});

// Get items for a specific category
router.get('/categories/:id/items', authenticateToken, async (req, res) => {
  const { id } = req.params;
  
  try {
    // First check if category exists
    const categoryResult = await pool.query(
      'SELECT * FROM menu_categories WHERE id = $1 AND is_active = true',
      [id]
    );
    
    if (categoryResult.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Category not found' });
    }

    // Get items for the category
    const itemsResult = await pool.query(
      'SELECT * FROM menu_items WHERE category_id = $1 AND is_active = true ORDER BY order_index',
      [id]
    );

    res.json({ 
      success: true, 
      data: {
        category: categoryResult.rows[0],
        items: itemsResult.rows
      }
    });
  } catch (error) {
    console.error('Error fetching category items:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch category items' });
  }
});

// Get items for a specific category by name
router.get('/categories/name/:name/items', authenticateToken, async (req, res) => {
  const { name } = req.params;
  
  try {
    // First check if category exists
    const categoryResult = await pool.query(
      'SELECT * FROM menu_categories WHERE name = $1 AND is_active = true',
      [name]
    );
    
    if (categoryResult.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Category not found' });
    }

    // Get items for the category
    const itemsResult = await pool.query(
      'SELECT * FROM menu_items WHERE category_id = $1 AND is_active = true ORDER BY order_index',
      [categoryResult.rows[0].id]
    );

    res.json({ 
      success: true, 
      data: {
        category: categoryResult.rows[0],
        items: itemsResult.rows
      }
    });
  } catch (error) {
    console.error('Error fetching category items by name:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch category items' });
  }
});

// Search menu items
router.get('/search', authenticateToken, async (req, res) => {
  const { query } = req.query;
  
  if (!query || query.trim() === '') {
    return res.status(400).json({ success: false, error: 'Search query is required' });
  }

  try {
    const result = await pool.query(
      `SELECT mi.*, mc.name as category_name, mc.title as category_title 
       FROM menu_items mi
       JOIN menu_categories mc ON mi.category_id = mc.id
       WHERE mi.is_active = true 
       AND mc.is_active = true
       AND (
         LOWER(mi.title) LIKE LOWER($1) 
         OR LOWER(mi.description) LIKE LOWER($1)
         OR LOWER(mc.title) LIKE LOWER($1)
       )
       ORDER BY mc.order_index, mi.order_index`,
      [`%${query}%`]
    );

    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Error searching menu items:', error);
    res.status(500).json({ success: false, error: 'Failed to search menu items' });
  }
});

module.exports = router;