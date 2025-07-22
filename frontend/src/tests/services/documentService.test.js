import documentService from '../../services/documentService';

// Mock fetch
global.fetch = jest.fn();

describe('documentService', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  describe('getDocuments', () => {
    it('should fetch documents successfully', async () => {
      const mockDocuments = [
        { id: 1, title: 'Test Doc', type: 'attendance_report', status: 'pending' }
      ];
      
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockDocuments,
      });

      const result = await documentService.getDocuments();
      expect(result).toEqual(mockDocuments);
      expect(fetch).toHaveBeenCalledWith('http://localhost:3001/api/documents');
    });

    it('should throw error when fetch fails', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      await expect(documentService.getDocuments()).rejects.toThrow('Failed to fetch documents');
    });
  });

  describe('createDocument', () => {
    it('should create document successfully', async () => {
      const mockDocument = { id: 1, title: 'New Doc', type: 'attendance_report' };
      const createData = { title: 'New Doc', type: 'attendance_report', created_by: 1 };
      
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockDocument,
      });

      const result = await documentService.createDocument(createData);
      expect(result).toEqual(mockDocument);
      expect(fetch).toHaveBeenCalledWith('http://localhost:3001/api/documents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(createData),
      });
    });
  });

  describe('uploadFiles', () => {
    it('should upload files successfully', async () => {
      const mockFiles = [{ id: 1, file_name: 'test.pdf' }];
      const files = [new File(['content'], 'test.pdf', { type: 'application/pdf' })];
      
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockFiles,
      });

      const result = await documentService.uploadFiles(1, files);
      expect(result).toEqual(mockFiles);
      expect(fetch).toHaveBeenCalledWith('http://localhost:3001/api/documents/1/files', {
        method: 'POST',
        body: expect.any(FormData),
      });
    });
  });

  describe('approveDocument', () => {
    it('should approve document successfully', async () => {
      const mockDocument = { id: 1, status: 'approved' };
      const approverData = { approver_id: 1, comments: 'Approved' };
      
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockDocument,
      });

      const result = await documentService.approveDocument(1, approverData);
      expect(result).toEqual(mockDocument);
      expect(fetch).toHaveBeenCalledWith('http://localhost:3001/api/documents/1/approve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(approverData),
      });
    });
  });
});