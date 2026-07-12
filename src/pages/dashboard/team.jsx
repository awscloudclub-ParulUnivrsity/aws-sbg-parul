import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { Plus, Trash2, X, Check, AlertTriangle } from 'lucide-react';

const inp = {
  width: '100%', background: 'var(--surface-low)', border: '1px solid var(--border-muted)',
  borderRadius: '8px', padding: '8px 12px', fontSize: '12px',
  color: 'var(--text-primary)', outline: 'none', fontFamily: 'inherit',
};

const DEPT_COLORS = { leader: '#AD5CFF', social_media: '#EC4899', technical: '#06B6D4', operations: '#F97316', promotions: '#F59E0B', member: '#22C55E' };

export default function TeamManagePage() {
  const { profile: me } = useAuth();
  const [team,     setTeam]     = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [modal,    setModal]    = useState(false);
  const [saving,   setSaving]   = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [form,     setForm]     = useState({ email: '', role_title: '', department: '', linkedin: '', github: '' });
  const [err,      setErr]      = useState('');

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('team_members')
      .select('*, profile:profiles(id,name,email,role,avatar_url)')
      .order('created_at', { ascending: true });
    console.log('[TeamLoad] data:', data, 'error:', error);
    if (error) console.error('team_members load error:', error);
    setTeam(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const add = async () => {
    setSaving(true); setErr('');

    // 1. Find the profile by email
    const { data: found, error: findErr } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', form.email.trim())
      .maybeSingle();

    console.log('[TeamAdd] profile lookup:', found, findErr);

    if (findErr) { setErr(`Lookup error: ${findErr.message}`); setSaving(false); return; }
    if (!found) { setErr('No account found with that email. Ask them to sign up first.'); setSaving(false); return; }

    // 2. Check if already in team
    const { data: existing, error: existErr } = await supabase
      .from('team_members')
      .select('id')
      .eq('profile_id', found.id)
      .maybeSingle();

    console.log('[TeamAdd] existing check:', existing, existErr);

    if (existing) { setErr('This person is already in the core team.'); setSaving(false); return; }

    // 3. Insert
    const payload = {
      profile_id:  found.id,
      role_title:  form.role_title,
      department:  form.department,
      linkedin:    form.linkedin,
      github:      form.github,
      approved_by: me.id,
      approved_at: new Date().toISOString(),
    };
    console.log('[TeamAdd] inserting:', payload);

    const { data: inserted, error: insertErr } = await supabase
      .from('team_members')
      .insert(payload)
      .select();

    console.log('[TeamAdd] insert result:', inserted, insertErr);

    if (insertErr) { setErr(`Insert failed: ${insertErr.message}`); setSaving(false); return; }

    // 4. Auto-approve their profile
    await supabase.from('profiles').update({ approved: true, department: form.department }).eq('id', found.id);

    setSaving(false);
    setModal(false);
    setForm({ email: '', role_title: '', department: '', linkedin: '', github: '' });
    load();
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    await supabase.from('team_members').delete().eq('id', deleteId);
    setDeleting(false);
    setDeleteId(null);
    load();
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-mono font-extrabold uppercase" style={{ color: 'var(--text-primary)' }}>Core Team</h2>
          <p className="font-mono" style={{ fontSize: '10px', color: 'var(--text-subtle)' }}>{team.length} members · shown on public /team page</p>
        </div>
        <button onClick={() => { setModal(true); setErr(''); }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md font-mono font-bold uppercase text-white"
          style={{ fontSize: '10px', background: '#AD5CFF', cursor: 'pointer', border: 'none', boxShadow: '0 0 16px rgba(173,92,255,0.2)' }}
          onMouseEnter={e => e.currentTarget.style.background = '#9C47FF'}
          onMouseLeave={e => e.currentTarget.style.background = '#AD5CFF'}>
          <Plus size={13} /> Add Member
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: '#AD5CFF', borderTopColor: 'transparent' }} />
        </div>
      ) : team.length === 0 ? (
        <div className="rounded-xl border p-10 text-center" style={{ background: 'var(--card-bg)', borderColor: 'var(--border-muted)' }}>
          <p className="font-mono" style={{ fontSize: '12px', color: 'var(--text-subtle)' }}>No team members yet. Add members to display them on the public team page.</p>
        </div>
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
                  <div className="min-w-0 flex-1">
                    <p className="font-bold truncate" style={{ fontSize: '13px', color: 'var(--text-primary)' }}>{m.profile?.name}</p>
                    <p className="font-mono uppercase truncate" style={{ fontSize: '8px', color }}>{m.role_title || m.profile?.role}</p>
                    <p className="font-sans truncate" style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{m.department || m.profile?.email}</p>
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {m.linkedin && (
                    <a href={m.linkedin} target="_blank" rel="noreferrer"
                      className="font-mono font-bold uppercase no-underline px-2.5 py-1 rounded transition-all"
                      style={{ fontSize: '8px', color: '#AD5CFF', background: '#AD5CFF10', border: '1px solid #AD5CFF30' }}>
                      LinkedIn ↗
                    </a>
                  )}
                  {m.github && (
                    <a href={m.github} target="_blank" rel="noreferrer"
                      className="font-mono font-bold uppercase no-underline px-2.5 py-1 rounded transition-all"
                      style={{ fontSize: '8px', color: 'var(--text-muted)', background: 'var(--surface-mid)', border: '1px solid var(--border-muted)' }}>
                      GitHub ↗
                    </a>
                  )}
                  <button onClick={() => setDeleteId(m.id)}
                    className="ml-auto w-7 h-7 rounded-md flex items-center justify-center transition-all"
                    style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#EF4444', cursor: 'pointer' }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#EF4444'; e.currentTarget.style.color = '#fff'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; e.currentTarget.style.color = '#EF4444'; }}>
                    <Trash2 size={11} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="w-full max-w-md rounded-2xl border p-6 space-y-4 max-h-[90vh] overflow-y-auto"
            style={{ background: 'var(--card-bg)', borderColor: 'var(--border-muted)' }}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-mono font-extrabold uppercase" style={{ color: 'var(--text-primary)' }}>Add Core Member</h3>
                <p className="font-sans font-light mt-0.5" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  Person must already have a dashboard account.
                </p>
              </div>
              <button onClick={() => { setModal(false); setErr(''); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                <X size={18} />
              </button>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Email Address *', key: 'email',      type: 'email', placeholder: 'member@example.com' },
                { label: 'Role Title',      key: 'role_title', placeholder: 'e.g. Technical Lead' },
                { label: 'Department',      key: 'department', placeholder: 'e.g. Technical' },
                { label: 'LinkedIn URL',    key: 'linkedin',   placeholder: 'https://linkedin.com/in/...' },
                { label: 'GitHub URL',      key: 'github',     placeholder: 'https://github.com/...' },
              ].map(({ label, key, type, placeholder }) => (
                <div key={key} className="space-y-1">
                  <label className="font-mono font-bold uppercase" style={{ fontSize: '9px', color: 'var(--text-muted)' }}>{label}</label>
                  <input type={type || 'text'} value={form[key]} placeholder={placeholder}
                    onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                    style={inp}
                    onFocus={e => e.target.style.borderColor = '#AD5CFF'}
                    onBlur={e => e.target.style.borderColor = 'var(--border-muted)'} />
                </div>
              ))}
            </div>
            {err && (
              <p className="font-sans text-xs px-3 py-2 rounded-md"
                style={{ color: '#EF4444', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
                {err}
              </p>
            )}
            <div className="flex gap-3 justify-end">
              <button onClick={() => { setModal(false); setErr(''); }}
                style={{ fontSize: '10px', padding: '8px 16px', borderRadius: '8px', background: 'var(--surface-low)', border: '1px solid var(--border-muted)', color: 'var(--text-muted)', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 700, textTransform: 'uppercase' }}>
                Cancel
              </button>
              <button onClick={add} disabled={saving || !form.email.trim()}
                className="flex items-center gap-2"
                style={{ fontSize: '10px', padding: '8px 16px', borderRadius: '8px', background: '#AD5CFF', color: '#fff', border: 'none', cursor: (saving || !form.email.trim()) ? 'not-allowed' : 'pointer', fontFamily: 'inherit', fontWeight: 700, textTransform: 'uppercase', opacity: (saving || !form.email.trim()) ? 0.7 : 1 }}>
                <Check size={12} /> {saving ? 'Adding...' : 'Add Member'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="w-full max-w-sm rounded-2xl border p-6 space-y-4 text-center"
            style={{ background: 'var(--card-bg)', borderColor: 'rgba(239,68,68,0.3)' }}>
            <div className="w-12 h-12 rounded-full mx-auto flex items-center justify-center"
              style={{ background: 'rgba(239,68,68,0.1)' }}>
              <AlertTriangle size={22} style={{ color: '#EF4444' }} />
            </div>
            <div>
              <h3 className="font-mono font-extrabold uppercase" style={{ color: 'var(--text-primary)' }}>Remove from Team?</h3>
              <p className="font-sans font-light mt-1" style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                This removes the member from the public team page. Their account remains active.
              </p>
            </div>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setDeleteId(null)}
                style={{ fontSize: '10px', padding: '8px 20px', borderRadius: '8px', background: 'var(--surface-low)', border: '1px solid var(--border-muted)', color: 'var(--text-muted)', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 700, textTransform: 'uppercase' }}>
                Cancel
              </button>
              <button onClick={confirmDelete} disabled={deleting}
                style={{ fontSize: '10px', padding: '8px 20px', borderRadius: '8px', background: '#EF4444', color: '#fff', border: 'none', cursor: deleting ? 'not-allowed' : 'pointer', fontFamily: 'inherit', fontWeight: 700, textTransform: 'uppercase', opacity: deleting ? 0.7 : 1 }}>
                {deleting ? 'Removing...' : 'Remove'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
