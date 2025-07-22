const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Get all document templates
router.get('/', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT id, name, type, template_data, is_active, created_at
      FROM document_templates
      WHERE is_active = true
      ORDER BY type, name
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching document templates:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get templates by type
router.get('/type/:type', async (req, res) => {
  try {
    const { type } = req.params;
    const result = await db.query(`
      SELECT id, name, type, template_data, is_active, created_at
      FROM document_templates
      WHERE type = $1 AND is_active = true
      ORDER BY name
    `, [type]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching document templates by type:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single template
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(`
      SELECT *
      FROM document_templates
      WHERE id = $1 AND is_active = true
    `, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Template not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching document template:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new template (admin only)
router.post('/', async (req, res) => {
  try {
    const { name, type, template_data } = req.body;
    
    if (!name || !type || !template_data) {
      return res.status(400).json({ error: 'Name, type, and template_data are required' });
    }
    
    const result = await db.query(`
      INSERT INTO document_templates (name, type, template_data, is_active)
      VALUES ($1, $2, $3, true)
      RETURNING *
    `, [name, type, JSON.stringify(template_data)]);
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating document template:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update template (admin only)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, type, template_data, is_active } = req.body;
    
    const result = await db.query(`
      UPDATE document_templates 
      SET name = COALESCE($1, name),
          type = COALESCE($2, type),
          template_data = COALESCE($3, template_data),
          is_active = COALESCE($4, is_active)
      WHERE id = $5
      RETURNING *
    `, [name, type, template_data ? JSON.stringify(template_data) : null, is_active, id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Template not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating document template:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Deactivate template (admin only)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await db.query(`
      UPDATE document_templates 
      SET is_active = false
      WHERE id = $1
      RETURNING *
    `, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Template not found' });
    }
    
    res.json({ message: 'Template deactivated successfully' });
  } catch (error) {
    console.error('Error deactivating document template:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;