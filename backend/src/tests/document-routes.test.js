const request = require('supertest');
const app = require('../app');

describe('Document Routes', () => {
  describe('GET /api/documents', () => {
    it('should return all documents', async () => {
      const response = await request(app)
        .get('/api/documents')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('GET /api/documents/status-count', () => {
    it('should return document status counts', async () => {
      const response = await request(app)
        .get('/api/documents/status-count')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      if (response.body.length > 0) {
        expect(response.body[0]).toHaveProperty('status');
        expect(response.body[0]).toHaveProperty('count');
      }
    });
  });

  describe('POST /api/documents', () => {
    it('should create a new document', async () => {
      const newDocument = {
        title: 'Test Document',
        type: 'attendance_report',
        content: 'Test content',
        created_by: 1
      };

      const response = await request(app)
        .post('/api/documents')
        .send(newDocument)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe(newDocument.title);
      expect(response.body.type).toBe(newDocument.type);
      expect(response.body.status).toBe('draft');
    });

    it('should return 400 for missing required fields', async () => {
      const incompleteDocument = {
        title: 'Test Document'
        // missing type and created_by
      };

      await request(app)
        .post('/api/documents')
        .send(incompleteDocument)
        .expect(400);
    });
  });

  describe('GET /api/documents/:id', () => {
    it('should return 404 for non-existent document', async () => {
      await request(app)
        .get('/api/documents/99999')
        .expect(404);
    });
  });

  describe('PUT /api/documents/:id', () => {
    it('should return 404 for non-existent document', async () => {
      const updateData = {
        title: 'Updated Title'
      };

      await request(app)
        .put('/api/documents/99999')
        .send(updateData)
        .expect(404);
    });
  });

  describe('DELETE /api/documents/:id', () => {
    it('should return 404 for non-existent document', async () => {
      await request(app)
        .delete('/api/documents/99999')
        .expect(404);
    });
  });

  describe('POST /api/documents/:id/submit', () => {
    it('should return 404 for non-existent document', async () => {
      await request(app)
        .post('/api/documents/99999/submit')
        .expect(404);
    });
  });

  describe('POST /api/documents/:id/approve', () => {
    it('should return 400 for missing approver_id', async () => {
      await request(app)
        .post('/api/documents/1/approve')
        .send({ comments: 'Test comment' })
        .expect(400);
    });
  });

  describe('POST /api/documents/:id/reject', () => {
    it('should return 400 for missing rejector_id', async () => {
      await request(app)
        .post('/api/documents/1/reject')
        .send({ comments: 'Test comment' })
        .expect(400);
    });
  });
});

describe('Document Templates Routes', () => {
  describe('GET /api/document-templates', () => {
    it('should return all active templates', async () => {
      const response = await request(app)
        .get('/api/document-templates')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('GET /api/document-templates/type/:type', () => {
    it('should return templates by type', async () => {
      const response = await request(app)
        .get('/api/document-templates/type/attendance_report')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('POST /api/document-templates', () => {
    it('should create a new template', async () => {
      const newTemplate = {
        name: 'Test Template',
        type: 'test_type',
        template_data: {
          fields: [
            { name: 'test_field', type: 'text', required: true }
          ]
        }
      };

      const response = await request(app)
        .post('/api/document-templates')
        .send(newTemplate)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe(newTemplate.name);
      expect(response.body.type).toBe(newTemplate.type);
      expect(response.body.is_active).toBe(true);
    });

    it('should return 400 for missing required fields', async () => {
      const incompleteTemplate = {
        name: 'Test Template'
        // missing type and template_data
      };

      await request(app)
        .post('/api/document-templates')
        .send(incompleteTemplate)
        .expect(400);
    });
  });
});