import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { Plus, Pencil, Trash2, X, Check, AlertTriangle, Download, RefreshCw, MapPin, Calendar, Clock } from 'lucide-react';

const EMPTY = { title: '', type: 'Workshop', date: '', time: '', location: 'Parul University, Vadodara', description: '', status: 'upcoming' };
const TYPES = ['Workshop', 'Bootcamp', 'Community Event', 'Tech Talk', 'Hackathon', 'AWS Jam', 'Study Group'];
const STATUS_COLOR = { upcoming: '#AD5CFF', past: '#64748B' };

const inp = {
  width: '100%', background: 'var(--surface-low)', border: '1px solid var(--border-muted)',
  borderRadius: '8px', padding: '8px 12px', fontSize: '12px',
  color: 'var(--text-primary)', outline: 'none', fontFamily: 'inherit',
};

// Parse Meetup RSS XML into event objects
function parseMeetupRSS(xml, forcedStatus) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, 'text/xml');
  const items = Array.from(doc.querySelectorAll('item'));
  return items.map(item => {
    const title   = item.querySelector('title')?.textContent?.trim() || '';
    const link    = item.querySelector('link')?.textContent?.trim() || '';
    const pubDate = item.querySelector('pubDate')?.textContent?.trim() || '';

    // Get raw description text (strip HTML tags)
    const rawDesc = item.querySelector('description')?.textContent || '';
    const tmp = document.createElement('div');
    tmp.innerHTML = rawDesc;
    const text = tmp.textContent || '';

    // Extract date — look for patterns like "Date: 5th July 2026" or "5th - 11th July 2026"
    // Also handles emoji prefix lines like "📅 Date: ..."
    const dateLineMatch = text.match(/(?:Date|📅)[^:\n]*:\s*([^\n\r]+)/i);
    let dateStr = dateLineMatch ? dateLineMatch[1].trim() : '';
    // Strip range part e.g. "5th − 11th July 2026" → "5th July 2026"
    dateStr = dateStr.replace(/\s*[\u2013\u2014\-–—]\s*\d+\w*\s+/, ' ').trim();
    // Remove ordinal suffixes for parsing: "5th" → "5"
    const parseable = dateStr.replace(/(\d+)(st|nd|rd|th)/gi, '$1');
    const parsedDate = parseable ? new Date(parseable) : null;
    const validDate = parsedDate && !isNaN(parsedDate);

    const date = validDate
      ? parsedDate.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
      : dateStr || (pubDate ? new Date(pubDate).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }) : '');

    // Extract time — "Time: 9:00PM to 11PM" or "⏰ Time: ..."
    const timeLineMatch = text.match(/(?:Time|⏰)[^:\n]*:\s*([^\n\r]+)/i)
      || text.match(/(\d{1,2}:\d{2}\s*(?:AM|PM)[^\n\r]{0,30})/i);
    const time = timeLineMatch ? timeLineMatch[1].trim().slice(0, 50) : '';

    // Extract location/mode
    const locMatch = text.match(/(?:Mode|Location|Venue|Where)[^:\n]*:\s*([^\n\r]+)/i);
    const location = locMatch ? locMatch[1].trim() : 'Online';

    // Extract image from raw HTML description
    const imgMatch = rawDesc.match(/<img[^>]+src=["']([^"']+)["']/i);
    const photo = imgMatch ? imgMatch[1] : null;

    // Status: use forcedStatus if provided (past/upcoming feed), else derive from date
    const status = forcedStatus || (validDate && parsedDate < new Date() ? 'past' : 'upcoming');

    return { title, link, date, time, location, photo, status, description: text.slice(0, 300).trim() };
  }).filter(e => e.title);
}

export default function EventsPage() {
  const { profile } = useAuth();
  const isLeader = profile?.role === 'leader';
  const canEdit  = ['leader', 'technical'].includes(profile?.role);

  const [events,       setEvents]       = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [modal,        setModal]        = useState(null);
  const [deleteId,     setDeleteId]     = useState(null);
  const [form,         setForm]         = useState(EMPTY);
  const [saving,       setSaving]       = useState(false);
  const [deleting,     setDeleting]     = useState(false);
  const [saveError,    setSaveError]    = useState('');
  const [filter,       setFilter]       = useState('all');

  // Meetup fetch state
  const [meetupModal,  setMeetupModal]  = useState(false);
  const [meetupEvents, setMeetupEvents] = useState([]);
  const [meetupLoading,setMeetupLoading]= useState(false);
  const [meetupError,  setMeetupError]  = useState('');
  const [importing,    setImporting]    = useState(new Set());
  const [imported,     setImported]     = useState(new Set());

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('events').select('*').order('created_at', { ascending: false });
    if (!error) setEvents(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const fetchMeetup = async () => {
    setMeetupLoading(true);
    setMeetupError('');
    setMeetupEvents([]);
    setImported(new Set());
    try {
      const [upRes, pastRes] = await Promise.all([
        fetch('/meetup-rss/aws-sbg-at-parul-university/events/rss/?type=upcoming'),
        fetch('/meetup-rss/aws-sbg-at-parul-university/events/rss/?type=past'),
      ]);
      const [upXml, pastXml] = await Promise.all([upRes.text(), pastRes.text()]);
      const upcoming = parseMeetupRSS(upXml, 'upcoming');
      const past     = parseMeetupRSS(pastXml, 'past');
      const all = [...upcoming, ...past];
      if (!all.length) throw new Error('No events found in feed');
      setMeetupEvents(all);
    } catch (err) {
      setMeetupError('Could not fetch Meetup events. ' + err.message);
    } finally {
      setMeetupLoading(false);
    }
  };

  const importEvent = async (ev) => {
    setImporting(prev => new Set(prev).add(ev.link));
    const { error } = await supabase.from('events').insert({
      title: ev.title,
      type: 'Community Event',
      date: ev.date,
      time: ev.time,
      location: ev.location,
      description: ev.description,
      status: ev.status,
      created_by: profile.id,
    });
    setImporting(prev => { const s = new Set(prev); s.delete(ev.link); return s; });
    if (!error) {
      setImported(prev => new Set(prev).add(ev.link));
      load();
    }
  };

  const openAdd  = () => { setForm(EMPTY); setSaveError(''); setModal('add'); };
  const openEdit = (ev) => { setForm({ ...ev }); setSaveError(''); setModal(ev); };

  const save = async () => {
    if (!form.title.trim()) { setSaveError('Title is required.'); return; }
    if (!form.date.trim())  { setSaveError('Date is required.');  return; }
    setSaving(true); setSaveError('');
    let error;
    if (modal === 'add') {
      ({ error } = await supabase.from('events').insert({ ...form, created_by: profile.id }));
    } else {
      ({ error } = await supabase.from('events').update({
        title: form.title, type: form.type, date: form.date,
        time: form.time, location: form.location, description: form.description, status: form.status,
      }).eq('id', modal.id));
    }
    setSaving(false);
    if (error) { setSaveError(error.message); return; }
    setModal(null); load();
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    await supabase.from('events').delete().eq('id', deleteId);
    setDeleting(false); setDeleteId(null); load();
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
          {isLeader && (
            <button onClick={() => { setMeetupModal(true); fetchMeetup(); }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md font-mono font-bold uppercase transition-all"
              style={{ fontSize: '10px', background: '#ED6E47', color: '#fff', cursor: 'pointer', border: 'none', boxShadow: '0 0 16px rgba(237,110,71,0.25)' }}>
              <Download size={13} /> Fetch from Meetup
            </button>
          )}
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
              <div className="h-1" style={{ background: 'linear-gradient(to right, #AD5CFF, #d34af9)' }} />
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

      {/* ── Meetup Fetch Modal ── */}
      {meetupModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
          <div className="w-full max-w-2xl rounded-2xl border flex flex-col" style={{ background: 'var(--card-bg)', borderColor: '#ED6E4740', maxHeight: '85vh' }}>

            {/* Modal header */}
            <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: 'var(--border-muted)' }}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#ED6E4720' }}>
                  <Download size={15} style={{ color: '#ED6E47' }} />
                </div>
                <div>
                  <h3 className="font-mono font-extrabold uppercase" style={{ fontSize: '12px', color: 'var(--text-primary)' }}>Fetch from Meetup</h3>
                  <p className="font-mono" style={{ fontSize: '9px', color: 'var(--text-subtle)' }}>aws-sbg-at-parul-university</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={fetchMeetup} disabled={meetupLoading}
                  className="w-8 h-8 rounded-md border flex items-center justify-center transition-all"
                  style={{ borderColor: 'var(--border-muted)', color: 'var(--text-muted)', cursor: meetupLoading ? 'not-allowed' : 'pointer', background: 'transparent' }}>
                  <RefreshCw size={13} className={meetupLoading ? 'animate-spin' : ''} />
                </button>
                <button onClick={() => setMeetupModal(false)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Modal body */}
            <div className="overflow-y-auto flex-1 p-5 space-y-3">
              {meetupLoading ? (
                <div className="flex flex-col items-center justify-center py-16 gap-3">
                  <div className="w-7 h-7 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: '#ED6E47', borderTopColor: 'transparent' }} />
                  <p className="font-mono" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Fetching from Meetup RSS...</p>
                </div>
              ) : meetupError ? (
                <div className="rounded-xl border p-6 text-center space-y-2" style={{ borderColor: 'rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.05)' }}>
                  <p className="font-mono font-bold" style={{ fontSize: '11px', color: '#EF4444' }}>{meetupError}</p>
                  <button onClick={fetchMeetup}
                    className="px-4 py-2 rounded-md font-mono font-bold uppercase text-white"
                    style={{ fontSize: '10px', background: '#ED6E47', border: 'none', cursor: 'pointer' }}>
                    Retry
                  </button>
                </div>
              ) : meetupEvents.length === 0 ? (
                <p className="font-mono text-center py-10" style={{ fontSize: '11px', color: 'var(--text-subtle)' }}>No events found.</p>
              ) : meetupEvents.map((ev, i) => (
                <div key={i} className="rounded-xl border overflow-hidden flex gap-0 transition-all"
                  style={{ background: 'var(--surface-low)', borderColor: 'var(--border-muted)' }}>

                  {/* Photo */}
                  {ev.photo ? (
                    <img src={ev.photo} alt={ev.title}
                      className="w-24 h-24 object-cover flex-shrink-0" style={{ minWidth: '96px' }} />
                  ) : (
                    <div className="w-24 h-24 flex-shrink-0 flex items-center justify-center" style={{ background: '#ED6E4715', minWidth: '96px' }}>
                      <Calendar size={24} style={{ color: '#ED6E47', opacity: 0.5 }} />
                    </div>
                  )}

                  {/* Info */}
                  <div className="flex-1 p-3 flex flex-col justify-between min-w-0">
                    <div>
                      <p className="font-bold leading-snug truncate" style={{ fontSize: '13px', color: 'var(--text-primary)' }}>{ev.title}</p>
                      <div className="flex items-center gap-3 mt-1 flex-wrap">
                        <span className="flex items-center gap-1 font-mono" style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                          <Calendar size={10} /> {ev.date}
                        </span>
                        {ev.time && (
                          <span className="flex items-center gap-1 font-mono" style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                            <Clock size={10} /> {ev.time}
                          </span>
                        )}
                        <span className="flex items-center gap-1 font-mono" style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                          <MapPin size={10} /> {ev.location}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="font-mono font-bold uppercase px-2 py-0.5 rounded"
                        style={{ fontSize: '8px', background: STATUS_COLOR[ev.status] + '20', color: STATUS_COLOR[ev.status] }}>
                        {ev.status}
                      </span>
                      <button
                        onClick={() => importEvent(ev)}
                        disabled={importing.has(ev.link) || imported.has(ev.link)}
                        className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-md font-mono font-bold uppercase transition-all"
                        style={{
                          fontSize: '9px', cursor: imported.has(ev.link) ? 'default' : 'pointer', border: 'none',
                          background: imported.has(ev.link) ? 'rgba(34,197,94,0.15)' : '#ED6E47',
                          color: imported.has(ev.link) ? '#22C55E' : '#fff',
                          opacity: importing.has(ev.link) ? 0.6 : 1,
                        }}>
                        {importing.has(ev.link) ? 'Importing...' : imported.has(ev.link) ? '✓ Imported' : 'Import'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
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
                { label: 'Date *',  key: 'date' },
                { label: 'Time',    key: 'time' },
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
            <div className="w-12 h-12 rounded-full mx-auto flex items-center justify-center" style={{ background: 'rgba(239,68,68,0.1)' }}>
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
