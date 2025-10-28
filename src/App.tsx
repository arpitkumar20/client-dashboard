import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar } from './components/layout/Sidebar';
import { Navbar } from './components/layout/Navbar';
import { Dashboard } from './pages/Dashboard';
import { Leads } from './pages/Leads';
import { Appointments } from './pages/Appointments';
import { InfoFeed } from './pages/InfoFeed';
import { Users } from './pages/Users';
import { Reports } from './pages/Reports';
import { Integrations } from './pages/Integrations';
import { Support } from './pages/Support';
import { Analytics } from './pages/Analytics';
import { ProfileSettings } from './pages/ProfileSettings';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
                <Sidebar isCollapsed={sidebarCollapsed} setIsCollapsed={setSidebarCollapsed} />
                <div className="flex-1 flex flex-col overflow-hidden">
                  <Navbar />
                  <main className="flex-1 overflow-y-auto">
                    <Routes>
                      <Route path="dashboard" element={<Dashboard />} />
                      <Route path="leads" element={<Leads />} />
                      <Route path="appointments" element={<Appointments />} />
                      <Route path="info-feed" element={<InfoFeed />} />
                      <Route path="users" element={<Users />} />
                      <Route path="reports" element={<Reports />} />
                      <Route path="integrations" element={<Integrations />} />
                      <Route path="support" element={<Support />} />
                      <Route path="analytics" element={<Analytics />} />
                      <Route path="profile-settings" element={<ProfileSettings />} />
                      <Route path="*" element={<Navigate to="/dashboard" replace />} />
                    </Routes>
                  </main>
                </div>
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;