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
import AttendanceEntry from './pages/AttendanceEntry';
import Documents from './pages/Documents';
import DocumentDetail from './pages/DocumentDetail';
import DocumentForm from './pages/DocumentForm';
import MenuPage from './components/MenuPage';
import MenuItemPage from './components/MenuItemPage';

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
            <Route path="/attendance/entry" element={
              <ProtectedRoute>
                <AttendanceEntry />
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
            
            {/* Menu Routes */}
            <Route path="/menu/:categoryName" element={
              <ProtectedRoute>
                <MenuPage />
              </ProtectedRoute>
            } />
            
            {/* Company Menu Items */}
            <Route path="/company/organization" element={<ProtectedRoute><MenuItemPage /></ProtectedRoute>} />
            <Route path="/company/position-system" element={<ProtectedRoute><MenuItemPage /></ProtectedRoute>} />
            <Route path="/company/coco-schedule" element={<ProtectedRoute><MenuItemPage /></ProtectedRoute>} />
            
            {/* Operations Menu Items */}
            <Route path="/operations/work-regulations" element={<ProtectedRoute><MenuItemPage /></ProtectedRoute>} />
            <Route path="/operations/guidelines" element={<ProtectedRoute><MenuItemPage /></ProtectedRoute>} />
            <Route path="/operations/substitute-holidays" element={<ProtectedRoute><MenuItemPage /></ProtectedRoute>} />
            
            {/* Facilities Menu Items */}
            <Route path="/facilities/seats-extensions" element={<ProtectedRoute><MenuItemPage /></ProtectedRoute>} />
            <Route path="/facilities/office-info" element={<ProtectedRoute><MenuItemPage /></ProtectedRoute>} />
            <Route path="/facilities/management-contacts" element={<ProtectedRoute><MenuItemPage /></ProtectedRoute>} />
            
            {/* Management Menu Items */}
            <Route path="/management/staff" element={<ProtectedRoute><MenuItemPage /></ProtectedRoute>} />
            <Route path="/management/hr-announcements" element={<ProtectedRoute><MenuItemPage /></ProtectedRoute>} />
            <Route path="/management/personnel-info" element={<ProtectedRoute><MenuItemPage /></ProtectedRoute>} />
            <Route path="/management/general-affairs" element={<ProtectedRoute><MenuItemPage /></ProtectedRoute>} />
            <Route path="/management/company-car" element={<ProtectedRoute><MenuItemPage /></ProtectedRoute>} />
            <Route path="/management/eis-announcements" element={<ProtectedRoute><MenuItemPage /></ProtectedRoute>} />
            
            {/* Procedures Menu Items */}
            <Route path="/procedures/various-applications" element={<ProtectedRoute><MenuItemPage /></ProtectedRoute>} />
            <Route path="/procedures/approval-workflow" element={<ProtectedRoute><MenuItemPage /></ProtectedRoute>} />
            <Route path="/procedures/business-card" element={<ProtectedRoute><MenuItemPage /></ProtectedRoute>} />
            <Route path="/procedures/equipment-purchase" element={<ProtectedRoute><MenuItemPage /></ProtectedRoute>} />
            <Route path="/procedures/auto-insurance" element={<ProtectedRoute><MenuItemPage /></ProtectedRoute>} />
            <Route path="/procedures/ssl-vpn" element={<ProtectedRoute><MenuItemPage /></ProtectedRoute>} />
            <Route path="/procedures/employee-referral" element={<ProtectedRoute><MenuItemPage /></ProtectedRoute>} />
            
            {/* Equipment Menu Items */}
            <Route path="/equipment/phone-operation" element={<ProtectedRoute><MenuItemPage /></ProtectedRoute>} />
            <Route path="/equipment/video-conference" element={<ProtectedRoute><MenuItemPage /></ProtectedRoute>} />
            <Route path="/equipment/hdd-data-deletion" element={<ProtectedRoute><MenuItemPage /></ProtectedRoute>} />
            <Route path="/equipment/pc-setup" element={<ProtectedRoute><MenuItemPage /></ProtectedRoute>} />
            
            {/* Intranet Menu Items */}
            <Route path="/intranet/settings" element={<ProtectedRoute><MenuItemPage /></ProtectedRoute>} />
            <Route path="/intranet/attendance-operation" element={<ProtectedRoute><MenuItemPage /></ProtectedRoute>} />
            <Route path="/intranet/office365" element={<ProtectedRoute><MenuItemPage /></ProtectedRoute>} />
            <Route path="/intranet/email-settings" element={<ProtectedRoute><MenuItemPage /></ProtectedRoute>} />
            <Route path="/intranet/bulletin-board-usage" element={<ProtectedRoute><MenuItemPage /></ProtectedRoute>} />
            <Route path="/intranet/software-links" element={<ProtectedRoute><MenuItemPage /></ProtectedRoute>} />
            
            {/* EMG Vision Menu Items */}
            <Route path="/emg-vision/corporate-philosophy" element={<ProtectedRoute><MenuItemPage /></ProtectedRoute>} />
            <Route path="/emg-vision/management-policy" element={<ProtectedRoute><MenuItemPage /></ProtectedRoute>} />
            <Route path="/emg-vision/environmental-policy" element={<ProtectedRoute><MenuItemPage /></ProtectedRoute>} />
            
            {/* Business Strategy Menu Items */}
            <Route path="/business-strategy/meeting" element={<ProtectedRoute><MenuItemPage /></ProtectedRoute>} />
            <Route path="/business-strategy/quality-assurance" element={<ProtectedRoute><MenuItemPage /></ProtectedRoute>} />
            <Route path="/business-strategy/budget-planning" element={<ProtectedRoute><MenuItemPage /></ProtectedRoute>} />
            <Route path="/business-strategy/civil-law-amendment" element={<ProtectedRoute><MenuItemPage /></ProtectedRoute>} />
            <Route path="/business-strategy/subcontract-act" element={<ProtectedRoute><MenuItemPage /></ProtectedRoute>} />
            
            {/* Compliance Menu Items */}
            <Route path="/compliance/committee" element={<ProtectedRoute><MenuItemPage /></ProtectedRoute>} />
            
            {/* Development Menu Items */}
            <Route path="/development/technical-seminar" element={<ProtectedRoute><MenuItemPage /></ProtectedRoute>} />
            <Route path="/development/dx-task-force" element={<ProtectedRoute><MenuItemPage /></ProtectedRoute>} />
            
            {/* Public Relations Menu Items */}
            <Route path="/public-relations/portal" element={<ProtectedRoute><MenuItemPage /></ProtectedRoute>} />
            
            {/* Information Security Menu Items */}
            <Route path="/security/emg-security" element={<ProtectedRoute><MenuItemPage /></ProtectedRoute>} />
            <Route path="/security/win11-upgrade" element={<ProtectedRoute><MenuItemPage /></ProtectedRoute>} />
            <Route path="/security/test-request-2024" element={<ProtectedRoute><MenuItemPage /></ProtectedRoute>} />
            
            {/* Recruitment Menu Items */}
            <Route path="/recruitment/about" element={<ProtectedRoute><MenuItemPage /></ProtectedRoute>} />
            
            {/* Education Menu Items */}
            <Route path="/education/training-qualifications" element={<ProtectedRoute><MenuItemPage /></ProtectedRoute>} />
            <Route path="/education/announcements" element={<ProtectedRoute><MenuItemPage /></ProtectedRoute>} />
            <Route path="/education/skill-calendar" element={<ProtectedRoute><MenuItemPage /></ProtectedRoute>} />
            <Route path="/education/development-plan" element={<ProtectedRoute><MenuItemPage /></ProtectedRoute>} />
            
            {/* Lists Menu Items */}
            <Route path="/lists/attendees" element={<ProtectedRoute><MenuItemPage /></ProtectedRoute>} />
            <Route path="/lists/employee-count" element={<ProtectedRoute><MenuItemPage /></ProtectedRoute>} />
            <Route path="/lists/attendance-times" element={<ProtectedRoute><MenuItemPage /></ProtectedRoute>} />
            <Route path="/lists/project-numbers" element={<ProtectedRoute><MenuItemPage /></ProtectedRoute>} />
            <Route path="/lists/partner-attendance" element={<ProtectedRoute><MenuItemPage /></ProtectedRoute>} />
            
            {/* Reports Menu Items */}
            <Route path="/reports/emg-topics" element={<ProtectedRoute><MenuItemPage /></ProtectedRoute>} />
            <Route path="/reports/qualification-history" element={<ProtectedRoute><MenuItemPage /></ProtectedRoute>} />
            <Route path="/reports/patents-trademarks" element={<ProtectedRoute><MenuItemPage /></ProtectedRoute>} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;