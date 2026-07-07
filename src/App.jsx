import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Outlet, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import HomePage from './pages/Home';
import AboutPage from './pages/about/index';
import EventsPage from './pages/events/index';
import ContactPage from './pages/contact/index';
import TeamPage from './pages/team/index';
import DevProfilePage from './pages/team/[slug]';
import NotFoundPage from './pages/404';
import CertifyPage from './pages/certify/index';
import CertifiedPage from './pages/certified/index';
// Dashboard imports
import DashboardLogin from './pages/dashboard/login';
import SetPassword from './pages/dashboard/set-password';
import DashboardLayout from './components/dashboard/DashboardLayout';
import DashboardGuard from './components/dashboard/DashboardGuard';
import DashboardOverview from './pages/dashboard/index';
import DashboardMembers from './pages/dashboard/members';
import DashboardTeam from './pages/dashboard/team';
import DashboardEvents from './pages/dashboard/events';
import DashboardCertifications from './pages/dashboard/certifications';
import DashboardSettings from './pages/dashboard/settings';
import DashboardBadge from './pages/dashboard/badge';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppShell />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

function AppShell() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="events" element={<EventsPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="team" element={<TeamPage />} />
          <Route path="team/:slug" element={<DevProfilePage />} />
          <Route path="certify" element={<CertifyPage />} />
          <Route path="certified" element={<CertifiedPage />} />
        </Route>

        {/* Dashboard login and set-password (semi-public) */}
        <Route path="/dashboard/login" element={<DashboardLogin />} />
        <Route path="/dashboard/set-password" element={<SetPassword />} />

        {/* Protected dashboard routes */}
        <Route path="/dashboard" element={<DashboardGuard><DashboardLayout /></DashboardGuard>}>
          <Route index element={<DashboardOverview />} />
          <Route path="members" element={<DashboardMembers />} />
          <Route path="team" element={<DashboardTeam />} />
          <Route path="events" element={<DashboardEvents />} />
          <Route path="certifications" element={<DashboardCertifications />} />
          <Route path="settings" element={<DashboardSettings />} />
          <Route path="badge" element={<DashboardBadge />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function PublicLayout() {
  return (
    <div className="min-h-screen relative overflow-x-hidden" style={{ background: 'var(--bg)' }}>
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
}
