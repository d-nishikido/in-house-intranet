import React from 'react';
import Layout from '../components/Layout';
import DocumentList from '../components/DocumentList';

const Documents = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <DocumentList />
      </div>
    </Layout>
  );
};

export default Documents;