import React, { useState, useEffect, useRef } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';

export default function DashboardGuard({ children, requiredRoles }) {
  const { user, profile, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [checking, setChecking] = useState(false);
  const hasChecked = useRef(false);

  useEffect(() => {
    // Only check once when user exists but no profile
    if (user && !profile && !loading && !checking && !hasChecked.current) {
      hasChecked.current = true;
      setChecking(true);
      
      const checkProfile = async () => {
        // Wait for trigger to create profile
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        setChecking(false);
        
        if (data) {
          // Profile found, reload once
          window.location.reload();
        }
        // If no profile after wait, show error (don't loop)
      };
      
      checkProfile();
    }
  }, [user, profile, loading]);

  if (loading || checking) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)' }}>
        <div className="text-center space-y-3">
          <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin mx-auto"
            style={{ borderColor: '#AD5CFF', borderTopColor: 'transparent' }} />
          <p className="font-mono" style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
            {checking ? 'Setting up profile...' : 'Loading...'}
          </p>
        </div>
      </div>
    );
  }

  if (!user) return <Navigate to="/dashboard/login" replace />;

  // If no profile after checking, show error
  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6" style={{ background: 'var(--bg)' }}>
        <div className="max-w-sm text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center"
            style={{ background: 'rgba(239,68,68,0.1)' }}>
            <span style={{ fontSize: '28px' }}>⚠️</span>
          </div>
          <h2 className="font-mono font-extrabold uppercase" style={{ color: 'var(--text-primary)' }}>Profile Error</h2>
          <p className="font-sans font-light" style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            Your profile could not be created. Please try signing in again.
          </p>
          <button onClick={() => { signOut(); navigate('/dashboard/login'); }} 
            className="px-4 py-2 rounded-md font-mono font-bold uppercase"
            style={{ fontSize: '10px', background: '#EF4444', color: '#fff', border: 'none', cursor: 'pointer' }}>
            Sign Out & Try Again
          </button>
        </div>
      </div>
    );
  }

  // Check if user needs to set password (Google OAuth users)
  if (profile.password_set === false) {
    return <Navigate to="/dashboard/set-password" replace />;
  }

  // Not approved yet
  if (!profile.approved && profile.role !== 'leader') {
    return (
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
            <button onClick={() => { signOut(); navigate('/dashboard/login'); }} 
              className="font-mono font-bold uppercase transition-colors"
              style={{ fontSize: '10px', color: '#EF4444', background: 'none', border: 'none', cursor: 'pointer' }}>
              Logout
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Role check
  if (requiredRoles && !requiredRoles.includes(profile.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
