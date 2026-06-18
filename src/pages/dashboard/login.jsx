import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Eye, EyeOff, Sun, Moon } from 'lucide-react';

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
  const { signIn, signUp } = useAuth();
  const { dark, toggle } = useTheme();
  const navigate = useNavigate();

  const [mode,    setMode]    = useState('signin'); // 'signin' | 'signup'
  const [name,    setName]    = useState('');
  const [email,   setEmail]   = useState('');
  const [pass,    setPass]    = useState('');
  const [show,    setShow]    = useState(false);
  const [error,   setError]   = useState('');
  const [msg,     setMsg]     = useState('');
  const [loading, setLoading] = useState(false);

  const handle = async (e) => {
    e.preventDefault();
    setError(''); setMsg('');
    setLoading(true);

    if (mode === 'signin') {
      const { error } = await signIn(email, pass);
      if (error) { setError(error.message); setLoading(false); return; }
      navigate('/dashboard');
    } else {
      const { error } = await signUp(email, pass, name);
      if (error) { setError(error.message); setLoading(false); return; }
      setMsg('Account created! Wait for leader approval, then sign in.');
      setMode('signin');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative"
      style={{ background: 'var(--bg)' }}>
      <div className="site-grid-pattern absolute inset-0 pointer-events-none opacity-60" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(173,92,255,0.08) 0%, transparent 70%)', filter: 'blur(40px)' }} />

      {/* Theme toggle */}
      <button onClick={toggle}
        className="absolute top-5 right-5 w-8 h-8 rounded-md border flex items-center justify-center"
        style={{ background: 'transparent', borderColor: 'var(--border-muted)', color: 'var(--text-muted)' }}>
        {dark ? <Sun size={14} /> : <Moon size={14} />}
      </button>

      <div className="relative z-10 w-full max-w-md space-y-6">

        {/* Logo */}
        <div className="text-center space-y-2">
          <img src="/SBGLOGO.png" alt="SBG" className="h-10 w-auto object-contain mx-auto" />
          <h1 className="font-extrabold uppercase text-xl" style={{ color: 'var(--text-primary)' }}>
            {mode === 'signin' ? 'Dashboard Login' : 'Request Access'}
          </h1>
          <p className="font-mono" style={{ fontSize: '10px', color: 'var(--text-subtle)' }}>
            AWS STUDENT BUILDER GROUP :: PARUL UNIVERSITY
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border p-6 space-y-4"
          style={{ background: 'var(--card-bg)', borderColor: 'var(--border-muted)' }}>

          {/* Mode tabs */}
          <div className="flex gap-2 font-mono">
            {['signin','signup'].map(m => (
              <button key={m} onClick={() => { setMode(m); setError(''); setMsg(''); }}
                className="flex-1 py-2 rounded-md font-bold uppercase transition-all"
                style={{
                  fontSize: '10px',
                  background: mode === m ? '#AD5CFF' : 'transparent',
                  color: mode === m ? '#fff' : 'var(--text-muted)',
                  border: `1px solid ${mode === m ? '#AD5CFF' : 'var(--border-muted)'}`,
                  cursor: 'pointer',
                }}>
                {m === 'signin' ? 'Sign In' : 'Request Access'}
              </button>
            ))}
          </div>

          <form onSubmit={handle} className="space-y-3">
            {mode === 'signup' && (
              <div className="space-y-1">
                <label className="font-mono font-bold uppercase" style={{ fontSize: '9px', color: 'var(--text-muted)' }}>Full Name</label>
                <input required value={name} onChange={e => setName(e.target.value)}
                  placeholder="Your full name" style={inp}
                  onFocus={e => e.target.style.borderColor = '#AD5CFF'}
                  onBlur={e => e.target.style.borderColor = 'var(--border-muted)'} />
              </div>
            )}

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
            {msg && (
              <p className="font-sans text-xs px-3 py-2 rounded-md"
                style={{ color: '#22C55E', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)' }}>
                {msg}
              </p>
            )}

            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-md font-mono font-bold uppercase text-white transition-all"
              style={{ fontSize: '11px', background: loading ? '#9C47FF' : '#AD5CFF', cursor: loading ? 'not-allowed' : 'pointer', boxShadow: '0 0 20px rgba(173,92,255,0.2)' }}>
              {loading ? 'Please wait...' : mode === 'signin' ? 'Sign In' : 'Request Access'}
            </button>
          </form>

          {mode === 'signup' && (
            <p className="font-sans text-center" style={{ fontSize: '11px', color: 'var(--text-subtle)' }}>
              After sign up, a leader must approve your account before you can access the dashboard.
            </p>
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
