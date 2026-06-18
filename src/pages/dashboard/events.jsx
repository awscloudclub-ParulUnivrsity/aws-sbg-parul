import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { Plus, Pencil, Trash2, X, Check } from 'lucide-react';

const EMPTY = { title:'', type:'Workshop', date:'', time:'', location:'Parul University, Vadodara', description:'', status:'upcoming', rsvp_count: 0 };
const TYPES  = ['Workshop','Bootcamp','Community Event','Tech Talk','Hackathon','AWS Jam','Study Group'];

const inp = {
  width: '100%', background: 'var(--surface-low)', border: '1px solid var(--border-muted)',
  borderRadius: '8px', padding: '8px 12px', fontSize: '12px',
  color: 'var(--text-primary)', outline: 'none', fontFamily: 'inherit',
};

const STATUS_COLOR = { upcoming: '#AD5CFF', past: '#64748B' };

export default function EventsPage() {
  const { profile } = useAuth();
  const canEdit = ['leader','technical'].includes(profile?.role);

  const [events,  setEvents]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal,   setModal]   = useState(null); // null | 'add' | event object
  const [form,    setForm]    = useState(EMPTY);
  const [saving,  setSaving]  = useState(false);
  const [filter,  setFilter]  = useState('all'); // all | upcoming | past

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from('events').select('*').order('created_at', { ascending: false });
    setEvents(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openAdd  = () => { setForm(EMPTY); setModal('add'); };
  const openEdit = (ev) => { setForm(ev); setModal(ev); };

  const save = async () => {
    setSaving(true);
    if (modal === 'add') {
      await supabase.from('events').insert({ ...form, created_by: profile.id });
    } else {
      await supabase.from('events').update(form).eq('id', modal.id);
    }
    setSaving(false);
    setModal(null);
    load();
  };

  const remove = async (id) => {
    if (!confirm('Delete this event?')) return;
    await supabase.from('events').delete().eq('id', id);
    load();
  };

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="font-mono font-extrabold uppercase" style={{ color: 'var(--text-primary)' }}>Events</h2>
          <p className="font-mono" style={{ fontSize: '10px', color: 'var(--text-subtle)' }}>{events.length} total</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {['all','upcoming','past'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className="px-3 py-1.5 rounded-md border font-mono font-bold uppercase transition-all"
              style={{ fontSize: '9px', cursor: 'pointer', background: filter === f ? '#06B6D4' : 'transparent', color: filter === f ? '#fff' : 'var(--text-muted)', borderColor: filter === f ? '#06B6D4' : 'var(--border-muted)' }}>
              {f}
            </button>
          ))}
          {canEdit && (
            <button onClick={openAdd}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md font-mono font-bold uppercase text-white transition-all"
              style={{ fontSize: '10px', background: '#AD5CFF', cursor: 'pointer', border: 'none', boxShadow: '0 0 16px rgba(173,92,255,0.2)' }}
              onMouseEnter={e => e.currentTarget.style.background = '#9C47FF'}
              onMouseLeave={e => e.currentTarget.style.background = '#AD5CFF'}>
              <Plus size={13} /> Add Event
            </button>
          )}
        </div>
      </div>

      {/* Cards grid */}
      {loading ? (
        <p className="font-mono text-center py-10" style={{ fontSize: '12px', color: 'var(--text-subtle)' }}>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {events.filter(ev => filter === 'all' || ev.status === filter).map(ev => (
            <div key={ev.id} className="rounded-xl border overflow-hidden flex flex-col transition-all"
              style={{ background: 'var(--card-bg)', borderColor: 'var(--border-muted)' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = '#AD5CFF50'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-muted)'}>
              <div className="h-1" style={{ background: 'linear-gradient(to right, #AD5CFF, #F97316)' }} />
              <div className="p-4 flex flex-col gap-2 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono font-bold uppercase px-2 py-0.5 rounded"
                    style={{ fontSize: '8px', background: '#AD5CFF15', color: '#AD5CFF' }}>{ev.type}</span>
                  <span className="font-mono font-bold uppercase px-2 py-0.5 rounded"
                    style={{ fontSize: '8px', background: STATUS_COLOR[ev.status] + '15', color: STATUS_COLOR[ev.status] }}>
                    {ev.status}
                  </span>
                </div>
                <h3 className="font-bold leading-snug" style={{ fontSize: '13px', color: 'var(--text-primary)' }}>{ev.title}</h3>
                <p className="font-mono" style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{ev.date}{ev.time ? ` · ${ev.time}` : ''}</p>
                <p className="font-sans font-light" style={{ fontSize: '11px', color: 'var(--text-subtle)' }}>{ev.location}</p>
                {ev.description && (
                  <p className="font-sans text-xs line-clamp-2" style={{ color: 'var(--text-muted)' }}>{ev.description}</p>
                )}
                {canEdit && (
                  <div className="flex gap-2 mt-auto pt-3 border-t" style={{ borderColor: 'var(--border-muted)' }}>
                    <button onClick={() => openEdit(ev)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-md font-mono font-bold uppercase transition-all"
                      style={{ fontSize: '9px', color: '#AD5CFF', background: '#AD5CFF10', border: '1px solid #AD5CFF30', cursor: 'pointer' }}>
                      <Pencil size={10} /> Edit
                    </button>
                    <button onClick={() => remove(ev.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-md font-mono font-bold uppercase transition-all"
                      style={{ fontSize: '9px', color: '#EF4444', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', cursor: 'pointer' }}>
                      <Trash2 size={10} /> Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="w-full max-w-lg rounded-2xl border p-6 space-y-4"
            style={{ background: 'var(--card-bg)', borderColor: 'var(--border-muted)' }}>
            <div className="flex items-center justify-between">
              <h3 className="font-mono font-extrabold uppercase" style={{ color: 'var(--text-primary)' }}>
                {modal === 'add' ? 'Add Event' : 'Edit Event'}
              </h3>
              <button onClick={() => setModal(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Title', key: 'title', col: '2' },
                { label: 'Date',  key: 'date' },
                { label: 'Time',  key: 'time' },
                { label: 'Location', key: 'location', col: '2' },
              ].map(({ label, key, col }) => (
                <div key={key} className={`space-y-1 ${col === '2' ? 'col-span-2' : ''}`}>
                  <label className="font-mono font-bold uppercase" style={{ fontSize: '9px', color: 'var(--text-muted)' }}>{label}</label>
                  <input value={form[key] || ''} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                    style={inp}
                    onFocus={e => e.target.style.borderColor = '#AD5CFF'}
                    onBlur={e => e.target.style.borderColor = 'var(--border-muted)'} />
                </div>
              ))}

              <div className="space-y-1">
                <label className="font-mono font-bold uppercase" style={{ fontSize: '9px', color: 'var(--text-muted)' }}>Type</label>
                <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} style={inp}>
                  {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-mono font-bold uppercase" style={{ fontSize: '9px', color: 'var(--text-muted)' }}>Status</label>
                <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} style={inp}>
                  <option value="upcoming">Upcoming</option>
                  <option value="past">Past</option>
                </select>
              </div>

              <div className="col-span-2 space-y-1">
                <label className="font-mono font-bold uppercase" style={{ fontSize: '9px', color: 'var(--text-muted)' }}>Description</label>
                <textarea rows={3} value={form.description || ''} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  style={{ ...inp, resize: 'vertical' }}
                  onFocus={e => e.target.style.borderColor = '#AD5CFF'}
                  onBlur={e => e.target.style.borderColor = 'var(--border-muted)'} />
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <button onClick={() => setModal(null)}
                className="px-4 py-2 rounded-md font-mono font-bold uppercase"
                style={{ fontSize: '10px', background: 'var(--surface-low)', border: '1px solid var(--border-muted)', color: 'var(--text-muted)', cursor: 'pointer' }}>
                Cancel
              </button>
              <button onClick={save} disabled={saving}
                className="flex items-center gap-2 px-4 py-2 rounded-md font-mono font-bold uppercase text-white"
                style={{ fontSize: '10px', background: '#AD5CFF', cursor: saving ? 'not-allowed' : 'pointer', border: 'none' }}>
                <Check size={12} /> {saving ? 'Saving...' : 'Save Event'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
