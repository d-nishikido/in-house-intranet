import React from 'react';
import Layout from '../components/Layout';
import DocumentDetail from '../components/DocumentDetail';

const DocumentDetailPage = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <DocumentDetail />
      </div>
    </Layout>
  );
};

export default DocumentDetailPage;