import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { CheckCircle, XCircle, Search, ChevronDown, Download, Trash2, Award, AlertTriangle, Lock, Unlock } from 'lucide-react';

const ROLES = ['member', 'social_media', 'technical', 'operations', 'promotions', 'leader'];
const DEPTS = ['General', 'Social Media', 'Technical', 'Operations', 'Promotions'];
const ROLE_COLORS = { leader: '#AD5CFF', social_media: '#EC4899', technical: '#06B6D4', operations: '#F97316', promotions: '#F59E0B', member: '#22C55E' };

const inp = {
  background: 'var(--surface-low)', border: '1px solid var(--border-muted)',
  borderRadius: '8px', padding: '8px 12px', fontSize: '12px',
  color: 'var(--text-primary)', outline: 'none', fontFamily: 'inherit',
};

export default function MembersPage() {
  const { profile: me } = useAuth();
  const isLeader = me?.role === 'leader';

  const [members,   setMembers]   = useState([]);
  const [query,     setQuery]     = useState('');
  const [filter,    setFilter]    = useState('all');
  const [loading,   setLoading]   = useState(true);
  const [deleteId,  setDeleteId]  = useState(null);
  const [deleting,  setDeleting]  = useState(false);
  const [badgeId,   setBadgeId]   = useState(null); // member id for badge preview
  const [copied,    setCopied]    = useState(null);
  const [registrationEnabled, setRegistrationEnabled] = useState(true);
  const [toggling, setToggling] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
    setMembers(data || []);
    
    // Load registration setting
    const { data: setting } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'registration_enabled')
      .single();
    
    if (setting) {
      setRegistrationEnabled(setting.value.enabled);
    }
    
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const approve   = async (id) => { await supabase.from('profiles').update({ approved: true  }).eq('id', id); load(); };
  const revoke    = async (id) => { await supabase.from('profiles').update({ approved: false }).eq('id', id); load(); };
  const updateRole = async (id, role) => { await supabase.from('profiles').update({ role }).eq('id', id); load(); };
  const updateDept = async (id, department) => { await supabase.from('profiles').update({ department }).eq('id', id); load(); };

  const confirmDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    
    try {
      const memberEmail = members.find(m => m.id === deleteId)?.email;
      
      // Delete from team_members first (FK constraint)
      await supabase.from('team_members').delete().eq('profile_id', deleteId);
      
      // Delete certifications
      if (memberEmail) {
        await supabase.from('certifications').delete().eq('email', memberEmail);
      }
      
      // Delete from profiles
      await supabase.from('profiles').delete().eq('id', deleteId);
      
      // Delete from auth.users (requires service role - this will cascade delete profile)
      const { error: authError } = await supabase.auth.admin.deleteUser(deleteId);
      
      if (authError) {
        console.error('Auth delete error:', authError);
        alert('User deleted from profiles but auth cleanup failed. Run in Supabase SQL:\nDELETE FROM auth.users WHERE id = \'' + deleteId + '\'');
      }
      
      setDeleteId(null);
      load();
    } catch (error) {
      console.error('Delete error:', error);
      alert('Delete failed: ' + error.message);
    } finally {
      setDeleting(false);
    }
  };

  const toggleRegistration = async () => {
    if (!isLeader) return;
    setToggling(true);
    
    const newValue = !registrationEnabled;
    
    const { error } = await supabase
      .from('settings')
      .upsert({
        key: 'registration_enabled',
        value: { enabled: newValue },
        updated_at: new Date().toISOString(),
        updated_by: me.id
      }, { onConflict: 'key' });
    
    if (error) {
      alert('Failed to update setting: ' + error.message);
    } else {
      setRegistrationEnabled(newValue);
    }
    
    setToggling(false);
  };

  const sendBadgeLink = (m) => {
    const url = `${window.location.origin}/portal/verify?email=${encodeURIComponent(m.email)}`;
    navigator.clipboard.writeText(url);
    setCopied(m.id);
    setTimeout(() => setCopied(null), 2000);
  };

  const filtered = members.filter(m => {
    const q = query.toLowerCase();
    const matchQ = !q || m.name?.toLowerCase().includes(q) || m.email?.toLowerCase().includes(q);
    const matchF = filter === 'all' || (filter === 'pending' ? !m.approved : m.approved);
    return matchQ && matchF;
  });

  const exportCSV = () => {
    const headers = ['Name', 'Email', 'Role', 'Department', 'Status', 'Joined'];
    const rows = filtered.map(m => [
      m.name || '', m.email || '',
      m.role?.replace('_', ' ') || '', m.department || '',
      m.approved ? 'Approved' : 'Pending',
      new Date(m.created_at).toLocaleDateString()
    ]);
    const csv = [headers, ...rows].map(r => r.map(v => `"${v}"`).join(',')).join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    a.download = `members-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const badgeMember = members.find(m => m.id === badgeId);

  return (
    <div className="space-y-5">

      {/* Registration Toggle (Leader Only) */}
      {isLeader && (
        <div className="rounded-xl border p-4 flex items-center justify-between"
          style={{ background: registrationEnabled ? 'rgba(34,197,94,0.05)' : 'rgba(239,68,68,0.05)', borderColor: registrationEnabled ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ background: registrationEnabled ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)' }}>
              {registrationEnabled ? <Unlock size={18} style={{ color: '#22C55E' }} /> : <Lock size={18} style={{ color: '#EF4444' }} />}
            </div>
            <div>
              <h3 className="font-mono font-bold uppercase" style={{ fontSize: '11px', color: 'var(--text-primary)' }}>
                New User Registration
              </h3>
              <p className="font-sans" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                {registrationEnabled ? 'New users can request access via Google OAuth' : 'Registration is disabled - only existing users can login'}
              </p>
            </div>
          </div>
          <button onClick={toggleRegistration} disabled={toggling}
            className="px-4 py-2 rounded-md font-mono font-bold uppercase transition-all"
            style={{
              fontSize: '10px',
              background: registrationEnabled ? '#EF4444' : '#22C55E',
              color: '#fff',
              border: 'none',
              cursor: toggling ? 'not-allowed' : 'pointer',
              opacity: toggling ? 0.7 : 1
            }}>
            {toggling ? 'Updating...' : registrationEnabled ? 'Disable' : 'Enable'}
          </button>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div className="relative flex-1 min-w-48 max-w-xs">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-subtle)' }} />
          <input value={query} onChange={e => setQuery(e.target.value)}
            placeholder="Search name or email..." style={{ ...inp, paddingLeft: '32px', width: '100%' }} />
        </div>
        <div className="flex gap-2 flex-wrap">
          {['all', 'pending', 'approved'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className="px-3 py-1.5 rounded-md border font-mono font-bold uppercase transition-all"
              style={{ fontSize: '9px', cursor: 'pointer', background: filter === f ? '#AD5CFF' : 'transparent', color: filter === f ? '#fff' : 'var(--text-muted)', borderColor: filter === f ? '#AD5CFF' : 'var(--border-muted)' }}>
              {f}
            </button>
          ))}
          {isLeader && (
            <button onClick={exportCSV}
              className="px-3 py-1.5 rounded-md border font-mono font-bold uppercase transition-all flex items-center gap-1.5"
              style={{ fontSize: '9px', cursor: 'pointer', background: 'transparent', color: 'var(--text-muted)', borderColor: 'var(--border-muted)' }}>
              <Download size={12} /> Export CSV
            </button>
          )}
        </div>
      </div>

      {/* Summary pills */}
      <div className="flex gap-3 flex-wrap">
        {[
          { label: 'Total', value: members.length, color: '#AD5CFF' },
          { label: 'Approved', value: members.filter(m => m.approved).length, color: '#22C55E' },
          { label: 'Pending', value: members.filter(m => !m.approved).length, color: '#F97316' },
        ].map(({ label, value, color }) => (
          <div key={label} className="flex items-center gap-2 px-3 py-1.5 rounded-lg border font-mono"
            style={{ fontSize: '10px', background: color + '10', borderColor: color + '30', color }}>
            <span className="font-black">{value}</span>
            <span className="font-bold uppercase">{label}</span>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-xl border overflow-hidden" style={{ background: 'var(--card-bg)', borderColor: 'var(--border-muted)' }}>
        <div className="overflow-x-auto">
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '700px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-muted)', background: 'var(--surface-low)' }}>
                {['Member', 'Email', 'Role', 'Department', 'Status', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: '9px', fontFamily: 'inherit', fontWeight: 700, color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.08em', whiteSpace: 'nowrap' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} style={{ padding: '32px', textAlign: 'center' }}>
                  <div className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin mx-auto" style={{ borderColor: '#AD5CFF', borderTopColor: 'transparent' }} />
                </td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} style={{ padding: '32px', textAlign: 'center', color: 'var(--text-subtle)', fontSize: '12px', fontFamily: 'inherit' }}>No members found.</td></tr>
              ) : filtered.map((m, i) => (
                <tr key={m.id} style={{ borderBottom: i < filtered.length - 1 ? '1px solid var(--border-muted)' : 'none' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-mid)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>

                  {/* Name */}
                  <td style={{ padding: '10px 14px' }}>
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center font-black text-white text-xs flex-shrink-0"
                        style={{ background: `linear-gradient(135deg, ${ROLE_COLORS[m.role] || '#AD5CFF'}, #F97316)` }}>
                        {m.name?.[0]?.toUpperCase() || '?'}
                      </div>
                      <div>
                        <p className="font-sans font-medium" style={{ fontSize: '12px', color: 'var(--text-primary)' }}>{m.name}</p>
                        <p className="font-mono" style={{ fontSize: '9px', color: 'var(--text-subtle)' }}>{new Date(m.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </td>

                  {/* Email */}
                  <td style={{ padding: '10px 14px', fontSize: '11px', color: 'var(--text-muted)', maxWidth: '180px' }}>
                    <span className="truncate block">{m.email}</span>
                  </td>

                  {/* Role */}
                  <td style={{ padding: '10px 14px' }}>
                    {isLeader ? (
                      <div className="relative">
                        <select value={m.role} onChange={e => updateRole(m.id, e.target.value)}
                          style={{ ...inp, padding: '4px 24px 4px 8px', fontSize: '10px', cursor: 'pointer', appearance: 'none' }}>
                          {ROLES.map(r => <option key={r} value={r}>{r.replace(/_/g, ' ')}</option>)}
                        </select>
                        <ChevronDown size={10} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-subtle)' }} />
                      </div>
                    ) : (
                      <span className="font-mono font-bold uppercase px-2 py-0.5 rounded"
                        style={{ fontSize: '8px', background: (ROLE_COLORS[m.role] || '#AD5CFF') + '15', color: ROLE_COLORS[m.role] || '#AD5CFF' }}>
                        {m.role?.replace(/_/g, ' ')}
                      </span>
                    )}
                  </td>

                  {/* Department */}
                  <td style={{ padding: '10px 14px' }}>
                    {isLeader ? (
                      <div className="relative">
                        <select value={m.department || ''} onChange={e => updateDept(m.id, e.target.value)}
                          style={{ ...inp, padding: '4px 24px 4px 8px', fontSize: '10px', cursor: 'pointer', appearance: 'none' }}>
                          <option value="">None</option>
                          {DEPTS.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                        <ChevronDown size={10} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-subtle)' }} />
                      </div>
                    ) : (
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{m.department || '—'}</span>
                    )}
                  </td>

                  {/* Status */}
                  <td style={{ padding: '10px 14px' }}>
                    <span className="font-mono font-bold uppercase px-2 py-0.5 rounded"
                      style={{ fontSize: '8px', background: m.approved ? 'rgba(34,197,94,0.12)' : 'rgba(249,115,24,0.12)', color: m.approved ? '#22C55E' : '#F97316' }}>
                      {m.approved ? '✓ Approved' : '⏳ Pending'}
                    </span>
                  </td>

                  {/* Actions */}
                  <td style={{ padding: '10px 14px' }}>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {isLeader && !m.approved && (
                        <button onClick={() => approve(m.id)} title="Approve"
                          className="w-7 h-7 rounded-md flex items-center justify-center transition-all"
                          style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', cursor: 'pointer', color: '#22C55E' }}
                          onMouseEnter={e => { e.currentTarget.style.background = '#22C55E'; e.currentTarget.style.color = '#fff'; }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(34,197,94,0.1)'; e.currentTarget.style.color = '#22C55E'; }}>
                          <CheckCircle size={12} />
                        </button>
                      )}
                      {isLeader && m.approved && (
                        <button onClick={() => revoke(m.id)} title="Revoke Approval"
                          className="w-7 h-7 rounded-md flex items-center justify-center transition-all"
                          style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', cursor: 'pointer', color: '#EF4444' }}
                          onMouseEnter={e => { e.currentTarget.style.background = '#EF4444'; e.currentTarget.style.color = '#fff'; }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; e.currentTarget.style.color = '#EF4444'; }}>
                          <XCircle size={12} />
                        </button>
                      )}
                      {/* Send Badge Link */}
                      {isLeader && m.approved && (
                        <button onClick={() => sendBadgeLink(m)} title="Copy Badge Link"
                          className="w-7 h-7 rounded-md flex items-center justify-center transition-all"
                          style={{ background: copied === m.id ? 'rgba(34,197,94,0.15)' : 'rgba(173,92,255,0.1)', border: `1px solid ${copied === m.id ? 'rgba(34,197,94,0.3)' : 'rgba(173,92,255,0.3)'}`, cursor: 'pointer', color: copied === m.id ? '#22C55E' : '#AD5CFF' }}
                          onMouseEnter={e => { e.currentTarget.style.background = copied === m.id ? '#22C55E' : '#AD5CFF'; e.currentTarget.style.color = '#fff'; }}
                          onMouseLeave={e => { e.currentTarget.style.background = copied === m.id ? 'rgba(34,197,94,0.15)' : 'rgba(173,92,255,0.1)'; e.currentTarget.style.color = copied === m.id ? '#22C55E' : '#AD5CFF'; }}>
                          <Award size={12} />
                        </button>
                      )}
                      {/* Delete */}
                      {isLeader && m.id !== me?.id && (
                        <button onClick={() => setDeleteId(m.id)} title="Delete Member"
                          className="w-7 h-7 rounded-md flex items-center justify-center transition-all"
                          style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', cursor: 'pointer', color: '#EF4444' }}
                          onMouseEnter={e => { e.currentTarget.style.background = '#EF4444'; e.currentTarget.style.color = '#fff'; }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; e.currentTarget.style.color = '#EF4444'; }}>
                          <Trash2 size={11} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p className="font-mono" style={{ fontSize: '10px', color: 'var(--text-subtle)' }}>
        {filtered.length} member{filtered.length !== 1 ? 's' : ''} shown · Click <Award size={10} style={{ display: 'inline', color: '#AD5CFF' }} /> to copy a member's badge/verification link
      </p>

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
              <h3 className="font-mono font-extrabold uppercase" style={{ color: 'var(--text-primary)' }}>Delete Member?</h3>
              <p className="font-sans font-light mt-1" style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                This permanently removes the member account and all associated data. This cannot be undone.
              </p>
            </div>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setDeleteId(null)}
                className="px-5 py-2 rounded-md font-mono font-bold uppercase"
                style={{ fontSize: '10px', background: 'var(--surface-low)', border: '1px solid var(--border-muted)', color: 'var(--text-muted)', cursor: 'pointer' }}>
                Cancel
              </button>
              <button onClick={confirmDelete} disabled={deleting}
                className="px-5 py-2 rounded-md font-mono font-bold uppercase text-white"
                style={{ fontSize: '10px', background: '#EF4444', border: 'none', cursor: deleting ? 'not-allowed' : 'pointer', opacity: deleting ? 0.7 : 1 }}>
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
