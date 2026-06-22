import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Eye, EyeOff } from 'lucide-react';
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
  const { user, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [show, setShow] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({ password });
      
      if (error) throw error;

      // Update profile to mark password as set
      await supabase
        .from('profiles')
        .update({ password_set: true })
        .eq('id', user.id);

      await refreshProfile();
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative"
      style={{ background: 'var(--bg)' }}>
      <div className="site-grid-pattern absolute inset-0 pointer-events-none opacity-60" />
      
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

        <div className="rounded-2xl border p-6"
          style={{ background: 'var(--card-bg)', borderColor: 'var(--border-muted)' }}>
          
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-1">
              <label className="font-mono font-bold uppercase" style={{ fontSize: '9px', color: 'var(--text-muted)' }}>
                Password
              </label>
              <div className="relative">
                <input 
                  required 
                  type={show ? 'text' : 'password'} 
                  value={password} 
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••" 
                  style={{ ...inp, paddingRight: '40px' }}
                  onFocus={e => e.target.style.borderColor = '#AD5CFF'}
                  onBlur={e => e.target.style.borderColor = 'var(--border-muted)'} 
                />
                <button type="button" onClick={() => setShow(!show)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-subtle)' }}>
                  {show ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-mono font-bold uppercase" style={{ fontSize: '9px', color: 'var(--text-muted)' }}>
                Confirm Password
              </label>
              <div className="relative">
                <input 
                  required 
                  type={showConfirm ? 'text' : 'password'} 
                  value={confirmPassword} 
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="••••••••" 
                  style={{ ...inp, paddingRight: '40px' }}
                  onFocus={e => e.target.style.borderColor = '#AD5CFF'}
                  onBlur={e => e.target.style.borderColor = 'var(--border-muted)'} 
                />
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

            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-md font-mono font-bold uppercase text-white transition-all"
              style={{ 
                fontSize: '11px', 
                background: loading ? '#9C47FF' : '#AD5CFF', 
                cursor: loading ? 'not-allowed' : 'pointer', 
                boxShadow: '0 0 20px rgba(173,92,255,0.2)' 
              }}>
              {loading ? 'Setting Password...' : 'Set Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
