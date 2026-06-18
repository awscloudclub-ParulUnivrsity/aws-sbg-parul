import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import { useTheme } from '../../context/ThemeContext';
import { Save, Moon, Sun, User, Lock, Bell } from 'lucide-react';

const inp = {
  width: '100%', background: 'var(--surface-low)', border: '1px solid var(--border-muted)',
  borderRadius: '8px', padding: '8px 12px', fontSize: '12px',
  color: 'var(--text-primary)', outline: 'none', fontFamily: 'inherit',
};

export default function SettingsPage() {
  const { profile, signOut } = useAuth();
  const { dark, toggle } = useTheme();
  const [form, setForm] = useState({ name: '', department: '', bio: '' });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (profile) {
      setForm({
        name: profile.name || '',
        department: profile.department || '',
        bio: profile.bio || '',
      });
    }
  }, [profile]);

  const save = async () => {
    setSaving(true);
    setMessage('');
    const { error } = await supabase
      .from('profiles')
      .update({ name: form.name, department: form.department, bio: form.bio })
      .eq('id', profile.id);
    
    if (error) {
      setMessage('Error saving settings');
    } else {
      setMessage('Settings saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    }
    setSaving(false);
  };

  return (
    <div className="space-y-5 max-w-2xl">

      {/* Profile Settings */}
      <div className="rounded-xl border p-6 space-y-4"
        style={{ background: 'var(--card-bg)', borderColor: 'var(--border-muted)' }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: '#AD5CFF15' }}>
            <User size={18} style={{ color: '#AD5CFF' }} />
          </div>
          <div>
            <h2 className="font-mono font-bold uppercase" style={{ fontSize: '11px', color: 'var(--text-primary)' }}>Profile Settings</h2>
            <p className="font-sans" style={{ fontSize: '10px', color: 'var(--text-subtle)' }}>Update your personal information</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="space-y-1">
            <label className="font-mono font-bold uppercase" style={{ fontSize: '9px', color: 'var(--text-muted)' }}>Full Name</label>
            <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              style={inp}
              onFocus={e => e.target.style.borderColor = '#AD5CFF'}
              onBlur={e => e.target.style.borderColor = 'var(--border-muted)'} />
          </div>

          <div className="space-y-1">
            <label className="font-mono font-bold uppercase" style={{ fontSize: '9px', color: 'var(--text-muted)' }}>Department</label>
            <input value={form.department} onChange={e => setForm(f => ({ ...f, department: e.target.value }))}
              style={inp}
              onFocus={e => e.target.style.borderColor = '#AD5CFF'}
              onBlur={e => e.target.style.borderColor = 'var(--border-muted)'} />
          </div>

          <div className="space-y-1">
            <label className="font-mono font-bold uppercase" style={{ fontSize: '9px', color: 'var(--text-muted)' }}>Email</label>
            <input value={profile?.email || ''} disabled
              style={{ ...inp, opacity: 0.6, cursor: 'not-allowed' }} />
            <p className="font-sans" style={{ fontSize: '9px', color: 'var(--text-subtle)' }}>Email cannot be changed</p>
          </div>

          <div className="space-y-1">
            <label className="font-mono font-bold uppercase" style={{ fontSize: '9px', color: 'var(--text-muted)' }}>Bio (Optional)</label>
            <textarea value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
              rows={3} placeholder="Tell us about yourself..."
              style={{ ...inp, resize: 'vertical' }}
              onFocus={e => e.target.style.borderColor = '#AD5CFF'}
              onBlur={e => e.target.style.borderColor = 'var(--border-muted)'} />
          </div>
        </div>

        {message && (
          <div className="px-3 py-2 rounded-md" 
            style={{ background: '#22C55E15', color: '#22C55E', fontSize: '11px', border: '1px solid #22C55E30' }}>
            {message}
          </div>
        )}

        <button onClick={save} disabled={saving}
          className="flex items-center gap-2 px-4 py-2 rounded-md font-mono font-bold uppercase text-white transition-all"
          style={{ fontSize: '10px', background: '#AD5CFF', cursor: saving ? 'not-allowed' : 'pointer', border: 'none' }}>
          <Save size={12} /> {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {/* Appearance */}
      <div className="rounded-xl border p-6 space-y-4"
        style={{ background: 'var(--card-bg)', borderColor: 'var(--border-muted)' }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: '#06B6D415' }}>
            {dark ? <Moon size={18} style={{ color: '#06B6D4' }} /> : <Sun size={18} style={{ color: '#06B6D4' }} />}
          </div>
          <div>
            <h2 className="font-mono font-bold uppercase" style={{ fontSize: '11px', color: 'var(--text-primary)' }}>Appearance</h2>
            <p className="font-sans" style={{ fontSize: '10px', color: 'var(--text-subtle)' }}>Customize your theme</p>
          </div>
        </div>

        <div className="flex items-center justify-between p-3 rounded-lg"
          style={{ background: 'var(--surface-low)' }}>
          <div>
            <p className="font-mono font-bold" style={{ fontSize: '11px', color: 'var(--text-primary)' }}>Dark Mode</p>
            <p className="font-sans" style={{ fontSize: '9px', color: 'var(--text-subtle)' }}>
              {dark ? 'Currently using dark theme' : 'Currently using light theme'}
            </p>
          </div>
          <button onClick={toggle}
            className="w-12 h-6 rounded-full relative transition-all"
            style={{ background: dark ? '#AD5CFF' : '#E5E7EB', border: 'none', cursor: 'pointer' }}>
            <div className="w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all"
              style={{ left: dark ? 'calc(100% - 22px)' : '2px' }} />
          </button>
        </div>
      </div>

      {/* Account Info */}
      <div className="rounded-xl border p-6 space-y-4"
        style={{ background: 'var(--card-bg)', borderColor: 'var(--border-muted)' }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: '#F9731615' }}>
            <Lock size={18} style={{ color: '#F97316' }} />
          </div>
          <div>
            <h2 className="font-mono font-bold uppercase" style={{ fontSize: '11px', color: 'var(--text-primary)' }}>Account Info</h2>
            <p className="font-sans" style={{ fontSize: '10px', color: 'var(--text-subtle)' }}>Your account details</p>
          </div>
        </div>

        <div className="space-y-2">
          {[
            { label: 'Role', value: profile?.role?.replace('_', ' ') || 'member' },
            { label: 'Status', value: profile?.approved ? '✓ Approved' : '⏳ Pending Approval' },
            { label: 'Joined', value: profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : '—' },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between py-2 border-b"
              style={{ borderColor: 'var(--border-muted)' }}>
              <span className="font-mono font-bold uppercase" style={{ fontSize: '9px', color: 'var(--text-subtle)' }}>{label}</span>
              <span className="font-sans" style={{ fontSize: '11px', color: 'var(--text-primary)' }}>{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Danger Zone */}
      <div className="rounded-xl border p-6 space-y-4"
        style={{ background: 'var(--card-bg)', borderColor: '#EF444430' }}>
        <div>
          <h2 className="font-mono font-bold uppercase" style={{ fontSize: '11px', color: '#EF4444' }}>Danger Zone</h2>
          <p className="font-sans" style={{ fontSize: '10px', color: 'var(--text-subtle)' }}>Irreversible actions</p>
        </div>

        <div className="p-3 rounded-lg border" style={{ background: 'rgba(239,68,68,0.05)', borderColor: '#EF444420' }}>
          <p className="font-sans mb-3" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            Need to sign out? You can log back in anytime with your credentials.
          </p>
          <button onClick={signOut}
            className="px-4 py-2 rounded-md font-mono font-bold uppercase transition-all"
            style={{ fontSize: '10px', background: '#EF4444', color: '#fff', border: 'none', cursor: 'pointer' }}>
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
