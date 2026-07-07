import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Eye, EyeOff, Sun, Moon } from 'lucide-react';
import { api } from '../../lib/api';

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

export default function DashboardLogin() {
  const { signIn, signInWithGoogle } = useAuth();
  const { dark, toggle } = useTheme();
  const navigate = useNavigate();

  const [email,   setEmail]   = useState('');
  const [pass,    setPass]    = useState('');
  const [show,    setShow]    = useState(false);
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);
  const [registrationEnabled, setRegistrationEnabled] = useState(true);
  const [checkingRegistration, setCheckingRegistration] = useState(true);

  useEffect(() => {
    const checkRegistration = async () => {
      try {
        const data = await api.getSetting('registration_enabled');
        if (data && data.value) {
          setRegistrationEnabled(data.value.enabled !== false);
        }
      } catch (err) {
        // default to enabled if backend unreachable
        setRegistrationEnabled(true);
      } finally {
        setCheckingRegistration(false);
      }
    };
    checkRegistration();
  }, []);

  const handle = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error } = await signIn(email, pass);
    if (error) { setError(error.message); setLoading(false); return; }
    navigate('/dashboard');
    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setError('');
    const { error } = await signInWithGoogle();
    if (error) setError(error.message);
  };

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
            Dashboard Login
          </h1>
          <p className="font-mono" style={{ fontSize: '10px', color: 'var(--text-subtle)' }}>
            AWS STUDENT BUILDER GROUP :: PARUL UNIVERSITY
          </p>
        </div>

        <div className="rounded-2xl border p-6 space-y-4"
          style={{ background: 'var(--card-bg)', borderColor: 'var(--border-muted)' }}>

          <form onSubmit={handle} className="space-y-3">
            <div className="space-y-1">
              <label className="font-mono font-bold uppercase" style={{ fontSize: '9px', color: 'var(--text-muted)' }}>Email</label>
              <input required type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com" style={inp}
                onFocus={e => e.target.style.borderColor = '#AD5CFF'}
                onBlur={e => e.target.style.borderColor = 'var(--border-muted)'} />
            </div>

            <div className="space-y-1">
              <label className="font-mono font-bold uppercase" style={{ fontSize: '9px', color: 'var(--text-muted)' }}>Password</label>
              <div className="relative">
                <input required type={show ? 'text' : 'password'} value={pass} onChange={e => setPass(e.target.value)}
                  placeholder="••••••••" style={{ ...inp, paddingRight: '40px' }}
                  onFocus={e => e.target.style.borderColor = '#AD5CFF'}
                  onBlur={e => e.target.style.borderColor = 'var(--border-muted)'} />
                <button type="button" onClick={() => setShow(!show)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-subtle)' }}>
                  {show ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            {error && (
              <p className="font-sans text-xs px-3 py-2 rounded-md"
                style={{ color: '#EF4444', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
                {error}
              </p>
            )}

            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-md font-mono font-bold uppercase text-white transition-all"
              style={{ fontSize: '11px', background: loading ? '#9C47FF' : '#AD5CFF', cursor: loading ? 'not-allowed' : 'pointer', boxShadow: '0 0 20px rgba(173,92,255,0.2)' }}>
              {loading ? 'Please wait...' : 'Sign In'}
            </button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full" style={{ borderTop: '1px solid var(--border-muted)' }} />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 font-mono" style={{ background: 'var(--card-bg)', color: 'var(--text-subtle)', fontSize: '10px' }}>OR REQUEST ACCESS</span>
            </div>
          </div>

          {checkingRegistration ? (
            <div className="py-3 text-center">
              <div className="w-5 h-5 rounded-full border-2 border-t-transparent animate-spin mx-auto"
                style={{ borderColor: '#AD5CFF', borderTopColor: 'transparent' }} />
            </div>
          ) : !registrationEnabled ? (
            <div className="py-3 px-4 rounded-md text-center"
              style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
              <p className="font-mono font-bold uppercase" style={{ fontSize: '10px', color: '#EF4444' }}>
                Registration Disabled
              </p>
              <p className="font-sans mt-1" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                New user registration is currently closed. Only existing members can sign in.
              </p>
            </div>
          ) : (
            <>
              <button type="button" onClick={handleGoogleSignIn}
                className="w-full py-3 rounded-md font-mono font-bold uppercase transition-all flex items-center justify-center gap-2"
                style={{ fontSize: '11px', background: 'transparent', border: '1px solid var(--border-muted)', color: 'var(--text-primary)', cursor: 'pointer' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = '#AD5CFF'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-muted)'}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </button>
              <p className="font-sans text-center" style={{ fontSize: '11px', color: 'var(--text-subtle)' }}>
                New users must be approved by a leader before accessing the dashboard.
              </p>
            </>
          )}
        </div>

        <p className="text-center">
          <a href="/" className="font-mono no-underline transition-colors" style={{ fontSize: '10px', color: 'var(--text-subtle)' }}
            onMouseEnter={e => e.currentTarget.style.color = '#AD5CFF'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-subtle)'}>
            ← Back to website
          </a>
        </p>
      </div>
    </div>
  );
}
