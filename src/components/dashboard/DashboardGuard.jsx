import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';

export default function DashboardGuard({ children, requiredRoles }) {
  const { user, profile, loading, signOut } = useAuth();
  const [retrying, setRetrying] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  // If user exists but no profile, retry fetching
  useEffect(() => {
    if (user && !profile && !loading && retryCount < 3) {
      setRetrying(true);
      const timer = setTimeout(async () => {
        console.log('Retrying profile fetch, attempt:', retryCount + 1);
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (data) {
          window.location.reload();
        } else {
          setRetryCount(prev => prev + 1);
        }
        setRetrying(false);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [user, profile, loading, retryCount]);

  if (loading || retrying) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)' }}>
      <div className="text-center space-y-3">
        <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin mx-auto"
          style={{ borderColor: '#AD5CFF', borderTopColor: 'transparent' }} />
        {retrying && (
          <p className="font-mono" style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
            Setting up your profile...
          </p>
        )}
      </div>
    </div>
  );

  if (!user) return <Navigate to="/dashboard/login" replace />;

  // If profile not yet loaded or doesn't exist after retries
  if (!profile) {
    if (retryCount >= 3) {
      return (
        <div className="min-h-screen flex items-center justify-center px-6" style={{ background: 'var(--bg)' }}>
          <div className="max-w-sm text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center"
              style={{ background: 'rgba(239,68,68,0.1)' }}>
              <span style={{ fontSize: '28px' }}>⚠️</span>
            </div>
            <h2 className="font-mono font-extrabold uppercase" style={{ color: 'var(--text-primary)' }}>Profile Error</h2>
            <p className="font-sans font-light" style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              Your profile couldn't be created. Please sign out and try again, or contact support.
            </p>
            <button onClick={signOut} className="px-4 py-2 rounded-md font-mono font-bold uppercase"
              style={{ fontSize: '10px', background: '#EF4444', color: '#fff', border: 'none', cursor: 'pointer' }}>
              Sign Out
            </button>
          </div>
        </div>
      );
    }
    
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)' }}>
        <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
          style={{ borderColor: '#AD5CFF', borderTopColor: 'transparent' }} />
      </div>
    );
  }

  // Check if Google OAuth user needs to set password
  if (profile && !profile.password_set) {
    // Check if user has a password already (email/password signup)
    // Google OAuth users won't have encrypted_password
    const hasPassword = user?.app_metadata?.provider !== 'google';
    
    if (!hasPassword) {
      return <Navigate to="/dashboard/set-password" replace />;
    } else {
      // Email/password user, mark as password_set
      supabase
        .from('profiles')
        .update({ password_set: true })
        .eq('id', user.id)
        .then(() => window.location.reload());
    }
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
