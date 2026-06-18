import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { CheckCircle, XCircle, Search, ChevronDown, Download } from 'lucide-react';

const ROLES = ['member','social_media','technical','operations','promotions','leader'];
const DEPTS = ['General','Social Media','Technical','Operations','Promotions'];

const inp = {
  background: 'var(--surface-low)', border: '1px solid var(--border-muted)',
  borderRadius: '8px', padding: '8px 12px', fontSize: '12px',
  color: 'var(--text-primary)', outline: 'none', fontFamily: 'inherit',
};

export default function MembersPage() {
  const { profile: me } = useAuth();
  const isLeader = me?.role === 'leader';

  const [members, setMembers] = useState([]);
  const [query,   setQuery]   = useState('');
  const [filter,  setFilter]  = useState('all'); // all | pending | approved
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
    setMembers(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const approve = async (id) => {
    await supabase.from('profiles').update({ approved: true }).eq('id', id);
    load();
  };

  const reject = async (id) => {
    await supabase.from('profiles').update({ approved: false }).eq('id', id);
    load();
  };

  const updateRole = async (id, role) => {
    await supabase.from('profiles').update({ role }).eq('id', id);
    load();
  };

  const updateDept = async (id, department) => {
    await supabase.from('profiles').update({ department }).eq('id', id);
    load();
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
      m.name || '',
      m.email || '',
      m.role?.replace('_', ' ') || '',
      m.department || '',
      m.approved ? 'Approved' : 'Pending',
      new Date(m.created_at).toLocaleDateString()
    ]);
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `members-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const ROLE_COLORS = { leader:'#AD5CFF', social_media:'#EC4899', technical:'#06B6D4', operations:'#F97316', promotions:'#F59E0B', member:'#22C55E' };

  return (
    <div className="space-y-5">

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div className="relative flex-1 min-w-48 max-w-xs">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-subtle)' }} />
          <input value={query} onChange={e => setQuery(e.target.value)}
            placeholder="Search name or email..." style={{ ...inp, paddingLeft: '32px', width: '100%' }} />
        </div>
        <div className="flex gap-2 flex-wrap">
          {['all','pending','approved'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className="px-3 py-1.5 rounded-md border font-mono font-bold uppercase transition-all"
              style={{ fontSize: '9px', cursor: 'pointer', background: filter === f ? '#AD5CFF' : 'transparent', color: filter === f ? '#fff' : 'var(--text-muted)', borderColor: filter === f ? '#AD5CFF' : 'var(--border-muted)' }}>
              {f}
            </button>
          ))}
          {isLeader && (
            <button onClick={exportCSV} title="Export CSV"
              className="px-3 py-1.5 rounded-md border font-mono font-bold uppercase transition-all flex items-center gap-1.5"
              style={{ fontSize: '9px', cursor: 'pointer', background: 'transparent', color: 'var(--text-muted)', borderColor: 'var(--border-muted)' }}>
              <Download size={12} /> Export
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border overflow-hidden" style={{ background: 'var(--card-bg)', borderColor: 'var(--border-muted)' }}>
        <div className="overflow-x-auto">
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-muted)', background: 'var(--surface-low)' }}>
                {['Member','Email','Role','Department','Status','Actions'].map(h => (
                  <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: '9px', fontFamily: 'inherit', fontWeight: 700, color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} style={{ padding: '24px', textAlign: 'center', color: 'var(--text-subtle)', fontSize: '12px' }}>Loading...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} style={{ padding: '24px', textAlign: 'center', color: 'var(--text-subtle)', fontSize: '12px' }}>No members found.</td></tr>
              ) : filtered.map((m, i) => (
                <tr key={m.id} style={{ borderBottom: i < filtered.length - 1 ? '1px solid var(--border-muted)' : 'none' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-mid)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>

                  {/* Name */}
                  <td style={{ padding: '10px 14px' }}>
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center font-black text-white text-xs flex-shrink-0"
                        style={{ background: `linear-gradient(135deg, ${ROLE_COLORS[m.role] || '#AD5CFF'}, #F97316)` }}>
                        {m.name?.[0]?.toUpperCase() || '?'}
                      </div>
                      <span className="font-sans font-medium" style={{ fontSize: '12px', color: 'var(--text-primary)' }}>{m.name}</span>
                    </div>
                  </td>

                  {/* Email */}
                  <td style={{ padding: '10px 14px', fontSize: '11px', color: 'var(--text-muted)' }}>{m.email}</td>

                  {/* Role selector */}
                  <td style={{ padding: '10px 14px' }}>
                    {isLeader ? (
                      <div className="relative">
                        <select value={m.role} onChange={e => updateRole(m.id, e.target.value)}
                          style={{ ...inp, padding: '4px 8px', fontSize: '10px', cursor: 'pointer', appearance: 'none', paddingRight: '24px' }}>
                          {ROLES.map(r => <option key={r} value={r}>{r.replace('_',' ')}</option>)}
                        </select>
                        <ChevronDown size={10} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-subtle)' }} />
                      </div>
                    ) : (
                      <span className="font-mono font-bold uppercase px-2 py-0.5 rounded"
                        style={{ fontSize: '8px', background: (ROLE_COLORS[m.role] || '#AD5CFF') + '15', color: ROLE_COLORS[m.role] || '#AD5CFF' }}>
                        {m.role?.replace('_',' ')}
                      </span>
                    )}
                  </td>

                  {/* Dept selector */}
                  <td style={{ padding: '10px 14px' }}>
                    {isLeader ? (
                      <div className="relative">
                        <select value={m.department || ''} onChange={e => updateDept(m.id, e.target.value)}
                          style={{ ...inp, padding: '4px 8px', fontSize: '10px', cursor: 'pointer', appearance: 'none', paddingRight: '24px' }}>
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
                    {isLeader && (
                      <div className="flex gap-1.5">
                        {!m.approved && (
                          <button onClick={() => approve(m.id)} title="Approve"
                            className="w-7 h-7 rounded-md flex items-center justify-center transition-all"
                            style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', cursor: 'pointer', color: '#22C55E' }}
                            onMouseEnter={e => e.currentTarget.style.background = '#22C55E'}
                            onMouseLeave={e => e.currentTarget.style.background = 'rgba(34,197,94,0.1)'}>
                            <CheckCircle size={12} />
                          </button>
                        )}
                        {m.approved && (
                          <button onClick={() => reject(m.id)} title="Revoke"
                            className="w-7 h-7 rounded-md flex items-center justify-center transition-all"
                            style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', cursor: 'pointer', color: '#EF4444' }}
                            onMouseEnter={e => e.currentTarget.style.background = '#EF4444'}
                            onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.1)'}>
                            <XCircle size={12} />
                          </button>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p className="font-mono" style={{ fontSize: '10px', color: 'var(--text-subtle)' }}>
        {filtered.length} member{filtered.length !== 1 ? 's' : ''} shown
      </p>
    </div>
  );
}
