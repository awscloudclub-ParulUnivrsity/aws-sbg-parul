import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { Plus, Trash2, X, Check } from 'lucide-react';

const inp = {
  width: '100%', background: 'var(--surface-low)', border: '1px solid var(--border-muted)',
  borderRadius: '8px', padding: '8px 12px', fontSize: '12px',
  color: 'var(--text-primary)', outline: 'none', fontFamily: 'inherit',
};

const DEPT_COLORS = { leader:'#AD5CFF', social_media:'#EC4899', technical:'#06B6D4', operations:'#F97316', promotions:'#F59E0B', member:'#22C55E' };

export default function TeamManagePage() {
  const { profile: me } = useAuth();
  const [team,    setTeam]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal,   setModal]   = useState(false);
  const [saving,  setSaving]  = useState(false);
  const [form,    setForm]    = useState({ email:'', role_title:'', department:'', linkedin:'', github:'' });
  const [err,     setErr]     = useState('');

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('team_members')
      .select('*, profile:profiles(id,name,email,role,avatar_url)')
      .order('created_at', { ascending: false });
    setTeam(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const add = async () => {
    setSaving(true); setErr('');
    // find profile by email
    const { data: found } = await supabase.from('profiles').select('id').eq('email', form.email).single();
    if (!found) { setErr('No account found with that email. Ask them to sign up first.'); setSaving(false); return; }
    const { error } = await supabase.from('team_members').insert({
      profile_id: found.id,
      role_title: form.role_title,
      department: form.department,
      linkedin:   form.linkedin,
      github:     form.github,
      approved_by: me.id,
      approved_at: new Date().toISOString(),
    });
    if (error) { setErr(error.message); setSaving(false); return; }
    // also approve the profile
    await supabase.from('profiles').update({ approved: true, department: form.department }).eq('id', found.id);
    setSaving(false);
    setModal(false);
    setForm({ email:'', role_title:'', department:'', linkedin:'', github:'' });
    load();
  };

  const remove = async (id, profileId) => {
    if (!confirm('Remove from core team?')) return;
    await supabase.from('team_members').delete().eq('id', id);
    load();
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-mono font-extrabold uppercase" style={{ color: 'var(--text-primary)' }}>Core Team</h2>
          <p className="font-mono" style={{ fontSize: '10px', color: 'var(--text-subtle)' }}>{team.length} members</p>
        </div>
        <button onClick={() => setModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md font-mono font-bold uppercase text-white"
          style={{ fontSize: '10px', background: '#AD5CFF', cursor: 'pointer', border: 'none', boxShadow: '0 0 16px rgba(173,92,255,0.2)' }}
          onMouseEnter={e => e.currentTarget.style.background = '#9C47FF'}
          onMouseLeave={e => e.currentTarget.style.background = '#AD5CFF'}>
          <Plus size={13} /> Add Member
        </button>
      </div>

      {loading ? (
        <p className="font-mono text-center py-10" style={{ fontSize: '12px', color: 'var(--text-subtle)' }}>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {team.map(m => {
            const color = DEPT_COLORS[m.profile?.role] || '#AD5CFF';
            return (
              <div key={m.id} className="rounded-xl border p-5 flex flex-col gap-3 transition-all"
                style={{ background: 'var(--card-bg)', borderColor: 'var(--border-muted)' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = color + '50'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-muted)'}>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-white text-lg flex-shrink-0"
                    style={{ background: `linear-gradient(135deg, ${color}, #F97316)` }}>
                    {m.profile?.name?.[0]?.toUpperCase() || '?'}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold truncate" style={{ fontSize: '13px', color: 'var(--text-primary)' }}>{m.profile?.name}</p>
                    <p className="font-mono uppercase truncate" style={{ fontSize: '8px', color }}>{m.role_title || m.profile?.role}</p>
                    <p className="font-sans truncate" style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{m.department}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {m.linkedin && (
                    <a href={m.linkedin} target="_blank" rel="noreferrer"
                      className="font-mono font-bold uppercase no-underline px-2.5 py-1 rounded transition-all"
                      style={{ fontSize: '8px', color: '#AD5CFF', background: '#AD5CFF10', border: '1px solid #AD5CFF30' }}>
                      LinkedIn
                    </a>
                  )}
                  {m.github && (
                    <a href={m.github} target="_blank" rel="noreferrer"
                      className="font-mono font-bold uppercase no-underline px-2.5 py-1 rounded transition-all"
                      style={{ fontSize: '8px', color: 'var(--text-muted)', background: 'var(--surface-mid)', border: '1px solid var(--border-muted)' }}>
                      GitHub
                    </a>
                  )}
                  <button onClick={() => remove(m.id, m.profile_id)}
                    className="ml-auto w-7 h-7 rounded-md flex items-center justify-center transition-all"
                    style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#EF4444', cursor: 'pointer' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#EF4444'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.08)'}>
                    <Trash2 size={11} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="w-full max-w-md rounded-2xl border p-6 space-y-4"
            style={{ background: 'var(--card-bg)', borderColor: 'var(--border-muted)' }}>
            <div className="flex items-center justify-between">
              <h3 className="font-mono font-extrabold uppercase" style={{ color: 'var(--text-primary)' }}>Add Core Member</h3>
              <button onClick={() => { setModal(false); setErr(''); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={18} /></button>
            </div>
            <p className="font-sans font-light" style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              The person must have already signed up. Enter their email to add them to core team.
            </p>
            <div className="space-y-3">
              {[
                { label: 'Email Address *',   key: 'email',      type: 'email' },
                { label: 'Role Title',        key: 'role_title'  },
                { label: 'Department',        key: 'department'  },
                { label: 'LinkedIn URL',      key: 'linkedin'    },
                { label: 'GitHub URL',        key: 'github'      },
              ].map(({ label, key, type }) => (
                <div key={key} className="space-y-1">
                  <label className="font-mono font-bold uppercase" style={{ fontSize: '9px', color: 'var(--text-muted)' }}>{label}</label>
                  <input type={type || 'text'} value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                    style={inp}
                    onFocus={e => e.target.style.borderColor = '#AD5CFF'}
                    onBlur={e => e.target.style.borderColor = 'var(--border-muted)'} />
                </div>
              ))}
            </div>
            {err && <p className="font-sans text-xs px-3 py-2 rounded-md" style={{ color: '#EF4444', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>{err}</p>}
            <div className="flex gap-3 justify-end">
              <button onClick={() => { setModal(false); setErr(''); }}
                style={{ fontSize: '10px', padding: '8px 16px', borderRadius: '8px', background: 'var(--surface-low)', border: '1px solid var(--border-muted)', color: 'var(--text-muted)', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 700, textTransform: 'uppercase' }}>
                Cancel
              </button>
              <button onClick={add} disabled={saving || !form.email}
                className="flex items-center gap-2"
                style={{ fontSize: '10px', padding: '8px 16px', borderRadius: '8px', background: '#AD5CFF', color: '#fff', border: 'none', cursor: saving ? 'not-allowed' : 'pointer', fontFamily: 'inherit', fontWeight: 700, textTransform: 'uppercase' }}>
                <Check size={12} /> {saving ? 'Adding...' : 'Add Member'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
