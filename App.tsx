
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import ReportIssuePage from './pages/ReportIssuePage';
import TrackComplaintsPage from './pages/TrackComplaintsPage';
import LoginPage from './pages/LoginPage';
import OfficialDashboardPage from './pages/Official/OfficialDashboardPage';
import ComplaintDetailPage from './pages/Official/ComplaintDetailPage';
import AnalyticsPage from './pages/Official/AnalyticsPage';
import CommunityReportsPage from './pages/CommunityReportsPage';
import ResourcesPage from './pages/ResourcesPage';
import NavigationBar from './components/Shared/NavigationBar';
import Footer from './components/Shared/Footer';
import ProtectedRoute from './components/Shared/ProtectedRoute';
import { UserRole } from './types';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LanguageProvider } from './context/LanguageContext';

const RootRoute: React.FC = () => {
  const { user, isAuthenticated } = useAuth();

  if (user?.type === UserRole.OFFICIAL) {
    return <Navigate to="/official/dashboard" replace />;
  }
  if (isAuthenticated) {
    return <DashboardPage />;
  }
  return <LandingPage />;
};

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen flex flex-col bg-gray-50">
            <NavigationBar />
            <main className="flex-grow">
              <Routes>
                {/* Intelligent Root Route */}
                <Route path="/" element={<RootRoute />} />

                {/* Public */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/resources" element={<ResourcesPage />} />

                {/* Official */}
                <Route path="/official/dashboard" element={
                  <ProtectedRoute allowedRoles={[UserRole.OFFICIAL]}>
                    <OfficialDashboardPage />
                  </ProtectedRoute>
                } />
                <Route path="/official/complaint/:id" element={
                  <ProtectedRoute allowedRoles={[UserRole.OFFICIAL]}>
                    <ComplaintDetailPage />
                  </ProtectedRoute>
                } />
                <Route path="/official/analytics" element={
                  <ProtectedRoute allowedRoles={[UserRole.OFFICIAL]}>
                    <AnalyticsPage />
                  </ProtectedRoute>
                } />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </LanguageProvider>
  );
};

export default App;
