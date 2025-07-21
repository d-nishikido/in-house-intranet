const express = require('express');
const router = express.Router();
const db = require('../config/database');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/documents/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 
    'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'image/jpeg', 'image/png'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF, DOC, DOCX, XLS, XLSX, JPG, PNG are allowed.'), false);
  }
};

const upload = multer({ 
  storage, 
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Get all documents
router.get('/', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT d.id, d.title, d.type, d.status, d.created_at, d.due_date, d.file_count,
             e.name as created_by_name, 
             a.name as approved_by_name,
             r.name as rejected_by_name
      FROM documents d
      LEFT JOIN employees e ON d.created_by = e.id
      LEFT JOIN employees a ON d.approved_by = a.id
      LEFT JOIN employees r ON d.rejected_by = r.id
      ORDER BY d.created_at DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching documents:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get document status count
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

// Get single document
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(`
      SELECT d.*, 
             e.name as created_by_name,
             a.name as approved_by_name,
             r.name as rejected_by_name,
             o.name as department_name
      FROM documents d
      LEFT JOIN employees e ON d.created_by = e.id
      LEFT JOIN employees a ON d.approved_by = a.id
      LEFT JOIN employees r ON d.rejected_by = r.id
      LEFT JOIN organizations o ON d.department_id = o.id
      WHERE d.id = $1
    `, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Document not found' });
    }
    
    // Get associated files
    const filesResult = await db.query(
      'SELECT id, file_name, file_size, mime_type, uploaded_at FROM document_files WHERE document_id = $1',
      [id]
    );
    
    const document = result.rows[0];
    document.files = filesResult.rows;
    
    res.json(document);
  } catch (error) {
    console.error('Error fetching document:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new document
router.post('/', async (req, res) => {
  try {
    const { title, type, content, department_id, due_date, created_by } = req.body;
    
    if (!title || !type || !created_by) {
      return res.status(400).json({ error: 'Title, type, and created_by are required' });
    }
    
    const result = await db.query(`
      INSERT INTO documents (title, type, content, department_id, due_date, created_by, status)
      VALUES ($1, $2, $3, $4, $5, $6, 'draft')
      RETURNING *
    `, [title, type, content, department_id, due_date, created_by]);
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating document:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update document
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, type, content, department_id, due_date } = req.body;
    
    const result = await db.query(`
      UPDATE documents 
      SET title = COALESCE($1, title),
          type = COALESCE($2, type),
          content = COALESCE($3, content),
          department_id = COALESCE($4, department_id),
          due_date = COALESCE($5, due_date),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $6
      RETURNING *
    `, [title, type, content, department_id, due_date, id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Document not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating document:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete document
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Delete associated files first
    const filesResult = await db.query('SELECT file_path FROM document_files WHERE document_id = $1', [id]);
    for (const file of filesResult.rows) {
      try {
        await fs.unlink(file.file_path);
      } catch (err) {
        console.error('Error deleting file:', err);
      }
    }
    
    const result = await db.query('DELETE FROM documents WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Document not found' });
    }
    
    res.json({ message: 'Document deleted successfully' });
  } catch (error) {
    console.error('Error deleting document:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Submit document
router.post('/:id/submit', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await db.query(`
      UPDATE documents 
      SET status = 'pending', submitted_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1 AND status = 'draft'
      RETURNING *
    `, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Document not found or not in draft status' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error submitting document:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Approve document
router.post('/:id/approve', async (req, res) => {
  try {
    const { id } = req.params;
    const { approver_id, comments } = req.body;
    
    if (!approver_id) {
      return res.status(400).json({ error: 'Approver ID is required' });
    }
    
    const client = await db.connect();
    try {
      await client.query('BEGIN');
      
      // Update document status
      const docResult = await client.query(`
        UPDATE documents 
        SET status = 'approved', approved_by = $1, updated_at = CURRENT_TIMESTAMP
        WHERE id = $2 AND status = 'pending'
        RETURNING *
      `, [approver_id, id]);
      
      if (docResult.rows.length === 0) {
        await client.query('ROLLBACK');
        return res.status(404).json({ error: 'Document not found or not in pending status' });
      }
      
      // Record approval
      await client.query(`
        INSERT INTO document_approvals (document_id, approver_id, status, comments)
        VALUES ($1, $2, 'approved', $3)
      `, [id, approver_id, comments]);
      
      await client.query('COMMIT');
      res.json(docResult.rows[0]);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error approving document:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Reject document
router.post('/:id/reject', async (req, res) => {
  try {
    const { id } = req.params;
    const { rejector_id, comments } = req.body;
    
    if (!rejector_id) {
      return res.status(400).json({ error: 'Rejector ID is required' });
    }
    
    const client = await db.connect();
    try {
      await client.query('BEGIN');
      
      // Update document status
      const docResult = await client.query(`
        UPDATE documents 
        SET status = 'rejected', rejected_by = $1, updated_at = CURRENT_TIMESTAMP
        WHERE id = $2 AND status = 'pending'
        RETURNING *
      `, [rejector_id, id]);
      
      if (docResult.rows.length === 0) {
        await client.query('ROLLBACK');
        return res.status(404).json({ error: 'Document not found or not in pending status' });
      }
      
      // Record rejection
      await client.query(`
        INSERT INTO document_approvals (document_id, approver_id, status, comments)
        VALUES ($1, $2, 'rejected', $3)
      `, [id, rejector_id, comments]);
      
      await client.query('COMMIT');
      res.json(docResult.rows[0]);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error rejecting document:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Upload files to document
router.post('/:id/files', upload.array('files', 5), async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if document exists
    const docResult = await db.query('SELECT id FROM documents WHERE id = $1', [id]);
    if (docResult.rows.length === 0) {
      return res.status(404).json({ error: 'Document not found' });
    }
    
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }
    
    const client = await db.connect();
    try {
      await client.query('BEGIN');
      
      const uploadedFiles = [];
      for (const file of req.files) {
        const fileResult = await client.query(`
          INSERT INTO document_files (document_id, file_name, file_path, file_size, mime_type)
          VALUES ($1, $2, $3, $4, $5)
          RETURNING *
        `, [id, file.originalname, file.path, file.size, file.mimetype]);
        
        uploadedFiles.push(fileResult.rows[0]);
      }
      
      // Update file count on document
      await client.query(`
        UPDATE documents 
        SET file_count = (SELECT COUNT(*) FROM document_files WHERE document_id = $1),
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $1
      `, [id]);
      
      await client.query('COMMIT');
      res.status(201).json(uploadedFiles);
    } catch (error) {
      await client.query('ROLLBACK');
      // Clean up uploaded files on error
      for (const file of req.files) {
        try {
          await fs.unlink(file.path);
        } catch (unlinkError) {
          console.error('Error cleaning up file:', unlinkError);
        }
      }
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error uploading files:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Download file
router.get('/:id/files/:fileId', async (req, res) => {
  try {
    const { id, fileId } = req.params;
    
    const result = await db.query(`
      SELECT df.*, d.title as document_title
      FROM document_files df
      JOIN documents d ON df.document_id = d.id
      WHERE df.id = $1 AND df.document_id = $2
    `, [fileId, id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'File not found' });
    }
    
    const file = result.rows[0];
    
    // Check if file exists on disk
    try {
      await fs.access(file.file_path);
    } catch (error) {
      return res.status(404).json({ error: 'File not found on disk' });
    }
    
    res.setHeader('Content-Disposition', `attachment; filename="${file.file_name}"`);
    res.setHeader('Content-Type', file.mime_type);
    res.sendFile(path.resolve(file.file_path));
  } catch (error) {
    console.error('Error downloading file:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete file
router.delete('/:id/files/:fileId', async (req, res) => {
  try {
    const { id, fileId } = req.params;
    
    const result = await db.query(`
      SELECT file_path FROM document_files 
      WHERE id = $1 AND document_id = $2
    `, [fileId, id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'File not found' });
    }
    
    const client = await db.connect();
    try {
      await client.query('BEGIN');
      
      // Delete from database
      await client.query('DELETE FROM document_files WHERE id = $1', [fileId]);
      
      // Update file count on document
      await client.query(`
        UPDATE documents 
        SET file_count = (SELECT COUNT(*) FROM document_files WHERE document_id = $1),
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $1
      `, [id]);
      
      await client.query('COMMIT');
      
      // Delete file from disk
      try {
        await fs.unlink(result.rows[0].file_path);
      } catch (unlinkError) {
        console.error('Error deleting file from disk:', unlinkError);
      }
      
      res.json({ message: 'File deleted successfully' });
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;