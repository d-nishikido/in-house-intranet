import React from 'react';
import Layout from '../components/Layout';
import DocumentForm from '../components/DocumentForm';

const DocumentFormPage = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <DocumentForm />
      </div>
    </Layout>
  );
};

export default DocumentFormPage;