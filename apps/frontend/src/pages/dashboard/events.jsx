import React, { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { Plus, Pencil, Trash2, X, Check, AlertTriangle } from 'lucide-react';

const EMPTY = { title: '', type: 'Workshop', date: '', time: '', location: 'Parul University, Vadodara', description: '', status: 'upcoming' };
const TYPES = ['Workshop', 'Bootcamp', 'Community Event', 'Tech Talk', 'Hackathon', 'AWS Jam', 'Study Group'];

const inp = {
  width: '100%', background: 'var(--surface-low)', border: '1px solid var(--border-muted)',
  borderRadius: '8px', padding: '8px 12px', fontSize: '12px',
  color: 'var(--text-primary)', outline: 'none', fontFamily: 'inherit',
};

const STATUS_COLOR = { upcoming: '#AD5CFF', past: '#64748B' };

export default function EventsPage() {
  const { profile } = useAuth();
  const canEdit = ['leader', 'technical'].includes(profile?.role);

  const [events,    setEvents]    = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [modal,     setModal]     = useState(null); // null | 'add' | event object
  const [deleteId,  setDeleteId]  = useState(null); // id of event pending delete
  const [form,      setForm]      = useState(EMPTY);
  const [saving,    setSaving]    = useState(false);
  const [deleting,  setDeleting]  = useState(false);
  const [saveError, setSaveError] = useState('');
  const [filter,    setFilter]    = useState('all');

  const load = async () => {
    setLoading(true);
    try {
      const data = await api.getEvents();
      const sorted = (data || []).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      setEvents(sorted);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openAdd  = () => { setForm(EMPTY); setSaveError(''); setModal('add'); };
  const openEdit = (ev) => { setForm({ ...ev }); setSaveError(''); setModal(ev); };

  const save = async () => {
    if (!form.title.trim()) { setSaveError('Title is required.'); return; }
    if (!form.date.trim())  { setSaveError('Date is required.');  return; }
    setSaving(true);
    setSaveError('');

    try {
      if (modal === 'add') {
        await api.createEvent(form);
      } else {
        await api.updateEvent(modal.id, {
          title: form.title, type: form.type, date: form.date,
          time: form.time, location: form.location, description: form.description, status: form.status,
        });
      }
    } catch (err) {
      setSaveError(err.message);
      setSaving(false);
      return;
    }

    setSaving(false);
    setModal(null);
    load();
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await api.deleteEvent(deleteId);
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(false);
      setDeleteId(null);
      load();
    }
  };

  const filtered = events.filter(ev => filter === 'all' || ev.status === filter);

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="font-mono font-extrabold uppercase" style={{ color: 'var(--text-primary)' }}>Events</h2>
          <p className="font-mono" style={{ fontSize: '10px', color: 'var(--text-subtle)' }}>{events.length} total</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {['all', 'upcoming', 'past'].map(f => (
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
        <div className="flex items-center justify-center py-16">
          <div className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: '#AD5CFF', borderTopColor: 'transparent' }} />
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border p-10 text-center" style={{ background: 'var(--card-bg)', borderColor: 'var(--border-muted)' }}>
          <p className="font-mono" style={{ fontSize: '12px', color: 'var(--text-subtle)' }}>
            No {filter === 'all' ? '' : filter} events yet.{canEdit ? ' Click "Add Event" to create one.' : ''}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(ev => (
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
                    style={{ fontSize: '8px', background: STATUS_COLOR[ev.status] + '20', color: STATUS_COLOR[ev.status] }}>
                    {ev.status}
                  </span>
                </div>
                <h3 className="font-bold leading-snug" style={{ fontSize: '13px', color: 'var(--text-primary)' }}>{ev.title}</h3>
                <p className="font-mono" style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                  {ev.date}{ev.time ? ` · ${ev.time}` : ''}
                </p>
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
                    <button onClick={() => setDeleteId(ev.id)}
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

      {/* Add / Edit Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="w-full max-w-lg rounded-2xl border p-6 space-y-4 max-h-[90vh] overflow-y-auto"
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
                { label: 'Title *', key: 'title', col: '2' },
                { label: 'Date *', key: 'date' },
                { label: 'Time',   key: 'time' },
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
                <textarea rows={4} value={form.description || ''} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  style={{ ...inp, resize: 'vertical' }}
                  onFocus={e => e.target.style.borderColor = '#AD5CFF'}
                  onBlur={e => e.target.style.borderColor = 'var(--border-muted)'} />
              </div>
            </div>

            {saveError && (
              <p className="font-sans text-xs px-3 py-2 rounded-md"
                style={{ color: '#EF4444', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
                {saveError}
              </p>
            )}

            <div className="flex gap-3 justify-end">
              <button onClick={() => setModal(null)}
                className="px-4 py-2 rounded-md font-mono font-bold uppercase"
                style={{ fontSize: '10px', background: 'var(--surface-low)', border: '1px solid var(--border-muted)', color: 'var(--text-muted)', cursor: 'pointer' }}>
                Cancel
              </button>
              <button onClick={save} disabled={saving}
                className="flex items-center gap-2 px-4 py-2 rounded-md font-mono font-bold uppercase text-white"
                style={{ fontSize: '10px', background: '#AD5CFF', cursor: saving ? 'not-allowed' : 'pointer', border: 'none', opacity: saving ? 0.7 : 1 }}>
                <Check size={12} /> {saving ? 'Saving...' : 'Save Event'}
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
              <h3 className="font-mono font-extrabold uppercase" style={{ color: 'var(--text-primary)' }}>Delete Event?</h3>
              <p className="font-sans font-light mt-1" style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                This action cannot be undone. The event will be permanently removed.
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
