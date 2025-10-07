const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:13001/api';

export const documentService = {
  // Get all documents
  async getDocuments() {
    const response = await fetch(`${API_BASE_URL}/documents`);
    if (!response.ok) {
      throw new Error('Failed to fetch documents');
    }
    return response.json();
  },

  // Get document by ID
  async getDocument(id) {
    const response = await fetch(`${API_BASE_URL}/documents/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch document');
    }
    return response.json();
  },

  // Create document
  async createDocument(documentData) {
    const response = await fetch(`${API_BASE_URL}/documents`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(documentData),
    });
    if (!response.ok) {
      throw new Error('Failed to create document');
    }
    return response.json();
  },

  // Update document
  async updateDocument(id, documentData) {
    const response = await fetch(`${API_BASE_URL}/documents/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(documentData),
    });
    if (!response.ok) {
      throw new Error('Failed to update document');
    }
    return response.json();
  },

  // Delete document
  async deleteDocument(id) {
    const response = await fetch(`${API_BASE_URL}/documents/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete document');
    }
    return response.json();
  },

  // Submit document
  async submitDocument(id) {
    const response = await fetch(`${API_BASE_URL}/documents/${id}/submit`, {
      method: 'POST',
    });
    if (!response.ok) {
      throw new Error('Failed to submit document');
    }
    return response.json();
  },

  // Approve document
  async approveDocument(id, approverData) {
    const response = await fetch(`${API_BASE_URL}/documents/${id}/approve`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(approverData),
    });
    if (!response.ok) {
      throw new Error('Failed to approve document');
    }
    return response.json();
  },

  // Reject document
  async rejectDocument(id, rejectorData) {
    const response = await fetch(`${API_BASE_URL}/documents/${id}/reject`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(rejectorData),
    });
    if (!response.ok) {
      throw new Error('Failed to reject document');
    }
    return response.json();
  },

  // Upload files
  async uploadFiles(documentId, files) {
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }

    const response = await fetch(`${API_BASE_URL}/documents/${documentId}/files`, {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) {
      throw new Error('Failed to upload files');
    }
    return response.json();
  },

  // Download file
  async downloadFile(documentId, fileId) {
    const response = await fetch(`${API_BASE_URL}/documents/${documentId}/files/${fileId}`);
    if (!response.ok) {
      throw new Error('Failed to download file');
    }
    return response.blob();
  },

  // Delete file
  async deleteFile(documentId, fileId) {
    const response = await fetch(`${API_BASE_URL}/documents/${documentId}/files/${fileId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete file');
    }
    return response.json();
  },

  // Get document status count
  async getDocumentStatusCount() {
    const response = await fetch(`${API_BASE_URL}/documents/status-count`);
    if (!response.ok) {
      throw new Error('Failed to fetch document status count');
    }
    return response.json();
  },

  // Get document templates
  async getDocumentTemplates() {
    const response = await fetch(`${API_BASE_URL}/document-templates`);
    if (!response.ok) {
      throw new Error('Failed to fetch document templates');
    }
    return response.json();
  },

  // Get templates by type
  async getTemplatesByType(type) {
    const response = await fetch(`${API_BASE_URL}/document-templates/type/${type}`);
    if (!response.ok) {
      throw new Error('Failed to fetch templates by type');
    }
    return response.json();
  },
};

export default documentService;