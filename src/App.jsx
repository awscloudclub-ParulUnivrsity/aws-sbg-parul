import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import HomePage from './pages/Home';
import AboutPage from './pages/about/index';
import EventsPage from './pages/events/index';
import ContactPage from './pages/contact/index';
import TeamPage from './pages/team/index';
import DevProfilePage from './pages/team/[slug]';
import NotFoundPage from './pages/404';

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AppShell />
      </BrowserRouter>
    </ThemeProvider>
  );
}

function AppShell() {
  return (
    <div className="min-h-screen relative overflow-x-hidden" style={{ background: 'var(--bg)' }}>
      <Navbar />
      <Routes>
        <Route path="/"           element={<HomePage />} />
        <Route path="/about"      element={<AboutPage />} />
        <Route path="/events"     element={<EventsPage />} />
        <Route path="/contact"    element={<ContactPage />} />
        <Route path="/team"       element={<TeamPage />} />
        <Route path="/team/:slug" element={<DevProfilePage />} />
        <Route path="*"           element={<NotFoundPage />} />
      </Routes>
      <Footer />
    </div>
  );
}
