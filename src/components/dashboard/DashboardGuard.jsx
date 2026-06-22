import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function DashboardGuard({ children, requiredRoles }) {
  const { user, profile, loading, signOut } = useAuth();

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)' }}>
      <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
        style={{ borderColor: '#AD5CFF', borderTopColor: 'transparent' }} />
    </div>
  );

  if (!user) return <Navigate to="/dashboard/login" replace />;

  // If profile not yet loaded wait
  if (!profile) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)' }}>
      <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
        style={{ borderColor: '#AD5CFF', borderTopColor: 'transparent' }} />
    </div>
  );

  // Check if Google OAuth user needs to set password
  if (profile && !profile.password_set && user?.app_metadata?.provider === 'google') {
    return <Navigate to="/dashboard/set-password" replace />;
  }

  // Not approved yet (only non-leaders need approval)
  if (!profile.approved && profile.role !== 'leader') return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ background: 'var(--bg)' }}>
      <div className="max-w-sm text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center"
          style={{ background: 'rgba(249,115,24,0.1)' }}>
          <span style={{ fontSize: '28px' }}>⏳</span>
        </div>
        <h2 className="font-mono font-extrabold uppercase" style={{ color: 'var(--text-primary)' }}>Pending Approval</h2>
        <p className="font-sans font-light" style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
          Your account is awaiting approval from the Chapter Lead. You'll get access once approved.
        </p>
        <div className="flex gap-2 justify-center">
          <a href="/" className="inline-block font-mono font-bold uppercase no-underline transition-colors"
            style={{ fontSize: '10px', color: '#AD5CFF' }}>← Back to website</a>
          <span style={{ color: 'var(--text-muted)' }}>|</span>
          <button onClick={signOut} className="font-mono font-bold uppercase transition-colors"
            style={{ fontSize: '10px', color: '#EF4444', background: 'none', border: 'none', cursor: 'pointer' }}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );

  // Role check
  if (requiredRoles && !requiredRoles.includes(profile.role)) return <Navigate to="/dashboard" replace />;

  return children;
}
