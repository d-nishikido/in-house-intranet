import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/App.css';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import AnnouncementDetail from './pages/AnnouncementDetail';
import AttendanceReport from './pages/AttendanceReport';
import Documents from './pages/Documents';
import DocumentDetail from './pages/DocumentDetail';
import DocumentForm from './pages/DocumentForm';

function App() {
  return (
    <AuthProvider>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <div className="App">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            } />
            <Route path="/announcements/:id" element={
              <ProtectedRoute>
                <AnnouncementDetail />
              </ProtectedRoute>
            } />
            <Route path="/attendance/report" element={
              <ProtectedRoute>
                <AttendanceReport />
              </ProtectedRoute>
            } />
            <Route path="/documents" element={
              <ProtectedRoute>
                <Documents />
              </ProtectedRoute>
            } />
            <Route path="/documents/new" element={
              <ProtectedRoute>
                <DocumentForm />
              </ProtectedRoute>
            } />
            <Route path="/documents/:id" element={
              <ProtectedRoute>
                <DocumentDetail />
              </ProtectedRoute>
            } />
            <Route path="/documents/:id/edit" element={
              <ProtectedRoute>
                <DocumentForm />
              </ProtectedRoute>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;