const request = require('supertest');
const app = require('../app');
const db = require('../config/database');

jest.mock('../config/database');
const mockDb = db;

describe('API Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockDb.testConnection.mockResolvedValue();
  });

  describe('Employees API', () => {
    test('GET /api/employees should return employees list', async () => {
      const mockEmployees = [
        { id: 1, name: 'Test User', email: 'test@example.com', department: 'IT' }
      ];
      mockDb.query.mockResolvedValue({ rows: mockEmployees });

      const response = await request(app).get('/api/employees');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toEqual(mockEmployees);
    });

    test('GET /api/employees/:id should return employee by id', async () => {
      const mockEmployee = { id: 1, name: 'Test User', email: 'test@example.com', department: 'IT' };
      mockDb.query.mockResolvedValue({ rows: [mockEmployee] });

      const response = await request(app).get('/api/employees/1');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('name');
      expect(response.body).toHaveProperty('email');
      expect(response.body).toEqual(mockEmployee);
    });

    test('GET /api/employees/nonexistent should return 404', async () => {
      mockDb.query.mockResolvedValue({ rows: [] });

      const response = await request(app).get('/api/employees/999');
      expect(response.status).toBe(404);
    });
  });

  describe('Announcements API', () => {
    test('GET /api/announcements should return announcements list', async () => {
      const mockAnnouncements = [
        { id: 1, title: 'Test Announcement', content: 'Test content', created_at: '2023-01-01' }
      ];
      mockDb.query.mockResolvedValue({ rows: mockAnnouncements });

      const response = await request(app).get('/api/announcements');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toEqual(mockAnnouncements);
    });

    test('GET /api/announcements/:id should return announcement by id', async () => {
      const mockAnnouncement = { id: 1, title: 'Test Announcement', content: 'Test content', created_at: '2023-01-01' };
      mockDb.query.mockResolvedValue({ rows: [mockAnnouncement] });

      const response = await request(app).get('/api/announcements/1');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('title');
      expect(response.body).toHaveProperty('content');
      expect(response.body).toEqual(mockAnnouncement);
    });

    test('GET /api/announcements/nonexistent should return 404', async () => {
      mockDb.query.mockResolvedValue({ rows: [] });

      const response = await request(app).get('/api/announcements/999');
      expect(response.status).toBe(404);
    });
  });

  describe('Documents API', () => {
    test('GET /api/documents should return documents list', async () => {
      const mockDocuments = [
        { id: 1, title: 'Test Document', type: 'test', status: 'pending', created_at: '2023-01-01' }
      ];
      mockDb.query.mockResolvedValue({ rows: mockDocuments });

      const response = await request(app).get('/api/documents');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toEqual(mockDocuments);
    });

    test('GET /api/documents/status-count should return document status counts', async () => {
      const mockStatusCounts = [
        { status: 'pending', count: '2' },
        { status: 'approved', count: '1' }
      ];
      mockDb.query.mockResolvedValue({ rows: mockStatusCounts });

      const response = await request(app).get('/api/documents/status-count');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toEqual(mockStatusCounts);
    });
  });

  describe('Organizations API', () => {
    test('GET /api/organizations should return organizations list', async () => {
      const mockOrganizations = [
        { id: 1, name: 'Test Organization', parent_id: null, created_at: '2023-01-01' }
      ];
      mockDb.query.mockResolvedValue({ rows: mockOrganizations });

      const response = await request(app).get('/api/organizations');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toEqual(mockOrganizations);
    });
  });

  describe('API Root', () => {
    test('GET /api should return API info', async () => {
      const response = await request(app).get('/api');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
    });
  });
});