import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Eye, EyeOff, Sun, Moon } from 'lucide-react';
import { api } from '../../lib/api';
import { supabase } from '../../lib/supabase';

const inp = {
  width: '100%',
  background: 'var(--surface-low)',
  border: '1px solid var(--border-muted)',
  borderRadius: '8px',
  padding: '10px 14px',
  fontSize: '13px',
  color: 'var(--text-primary)',
  outline: 'none',
  fontFamily: 'inherit',
};

export default function SetPassword() {
  const { user, profile, loading, refreshProfile } = useAuth();
  const { dark, toggle } = useTheme();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [show, setShow] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate('/dashboard/login', { replace: true });
      } else if (profile && profile.password_set === true) {
        navigate('/dashboard', { replace: true });
      }
    }
  }, [user, profile, loading, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setSubmitting(true);

    try {
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) throw updateError;

      await api.updateMe({ password_set: true });
      await refreshProfile();

      setTimeout(() => {
        navigate('/dashboard', { replace: true });
      }, 500);
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)' }}>
        <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
          style={{ borderColor: '#AD5CFF', borderTopColor: 'transparent' }} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative"
      style={{ background: 'var(--bg)' }}>
      <div className="site-grid-pattern absolute inset-0 pointer-events-none opacity-60" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(173,92,255,0.08) 0%, transparent 70%)', filter: 'blur(40px)' }} />

      <button onClick={toggle}
        className="absolute top-5 right-5 w-8 h-8 rounded-md border flex items-center justify-center"
        style={{ background: 'transparent', borderColor: 'var(--border-muted)', color: 'var(--text-muted)' }}>
        {dark ? <Sun size={14} /> : <Moon size={14} />}
      </button>

      <div className="relative z-10 w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <img src="/SBGLOGO.png" alt="SBG" className="h-10 w-auto object-contain mx-auto" />
          <h1 className="font-extrabold uppercase text-xl" style={{ color: 'var(--text-primary)' }}>
            Set Your Password
          </h1>
          <p className="font-mono" style={{ fontSize: '10px', color: 'var(--text-subtle)' }}>
            Complete your account setup
          </p>
        </div>

        <div className="rounded-2xl border p-6" style={{ background: 'var(--card-bg)', borderColor: 'var(--border-muted)' }}>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-1">
              <label className="font-mono font-bold uppercase" style={{ fontSize: '9px', color: 'var(--text-muted)' }}>Password</label>
              <div className="relative">
                <input required type={show ? 'text' : 'password'} value={password}
                  onChange={e => setPassword(e.target.value)} placeholder="••••••••"
                  style={{ ...inp, paddingRight: '40px' }}
                  onFocus={e => e.target.style.borderColor = '#AD5CFF'}
                  onBlur={e => e.target.style.borderColor = 'var(--border-muted)'} />
                <button type="button" onClick={() => setShow(!show)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-subtle)' }}>
                  {show ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-mono font-bold uppercase" style={{ fontSize: '9px', color: 'var(--text-muted)' }}>Confirm Password</label>
              <div className="relative">
                <input required type={showConfirm ? 'text' : 'password'} value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)} placeholder="••••••••"
                  style={{ ...inp, paddingRight: '40px' }}
                  onFocus={e => e.target.style.borderColor = '#AD5CFF'}
                  onBlur={e => e.target.style.borderColor = 'var(--border-muted)'} />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-subtle)' }}>
                  {showConfirm ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            {error && (
              <p className="font-sans text-xs px-3 py-2 rounded-md"
                style={{ color: '#EF4444', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
                {error}
              </p>
            )}

            <button type="submit" disabled={submitting}
              className="w-full py-3 rounded-md font-mono font-bold uppercase text-white transition-all"
              style={{ fontSize: '11px', background: submitting ? '#9C47FF' : '#AD5CFF', cursor: submitting ? 'not-allowed' : 'pointer', boxShadow: '0 0 20px rgba(173,92,255,0.2)' }}>
              {submitting ? 'Setting Password...' : 'Set Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
