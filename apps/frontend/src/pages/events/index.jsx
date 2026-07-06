import { useState, useEffect } from 'react';
import { Calendar, MapPin, ArrowUpRight, Zap } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const MEETUP = 'https://www.meetup.com/aws-sbg-at-parul-university/';
const C = '#AD5CFF';

const TYPE_ICONS = {
  'Workshop':        '⚡',
  'Bootcamp':        '🎯',
  'Community Event': '🌐',
  'Tech Talk':       '💡',
  'Hackathon':       '🚀',
  'AWS Jam':         '🎮',
  'Study Group':     '📚',
};

const FILTERS = ['All', 'Upcoming', 'Past'];

/* ── Upcoming featured card ── */
function UpcomingCard({ event }) {
  // Split description into highlight bullets (sentences)
  const highlights = event.description
    ? event.description.split('.').map(s => s.trim()).filter(s => s.length > 10).slice(0, 4)
    : ['Hands-on AWS workshop', 'Live demos & labs', 'Open to all students', 'Free entry'];

  return (
    <div className="rounded-2xl border overflow-hidden relative"
      style={{ background: 'var(--card-bg)', borderColor: C + '50' }}>
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: `radial-gradient(ellipse at top left, ${C}12 0%, transparent 60%)` }} />
      <div className="h-1 w-full" style={{ background: `linear-gradient(to right, ${C}, #F97316)` }} />

      <div className="relative z-10 p-6 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="space-y-5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono font-bold uppercase px-2.5 py-1 rounded-md"
              style={{ fontSize: '9px', background: C, color: '#fff', letterSpacing: '0.08em' }}>
              ◉ UPCOMING
            </span>
            <span className="font-mono font-bold uppercase px-2.5 py-1 rounded-md border"
              style={{ fontSize: '9px', background: C + '15', borderColor: C + '40', color: C }}>
              {TYPE_ICONS[event.type] || '☁'} {event.type}
            </span>
          </div>

          <h2 className="font-extrabold uppercase leading-tight"
            style={{ fontSize: 'clamp(1.3rem, 3vw, 2rem)', color: 'var(--text-primary)' }}>
            {event.title}
          </h2>

          <p className="font-sans font-light leading-relaxed"
            style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            {event.description}
          </p>

          <div className="flex flex-wrap gap-x-5 gap-y-2 font-mono"
            style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
            <span className="flex items-center gap-1.5">
              <Calendar size={11} style={{ color: '#06B6D4' }} /> {event.date}
              {event.time && ` · ${event.time}`}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin size={11} style={{ color: '#F97316' }} /> {event.location}
            </span>
          </div>

          <a href={MEETUP} target="_blank" rel="noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-md font-mono font-bold uppercase text-white no-underline transition-all"
            style={{ fontSize: '11px', background: C, boxShadow: `0 0 24px ${C}40` }}
            onMouseEnter={e => e.currentTarget.style.background = '#9C47FF'}
            onMouseLeave={e => e.currentTarget.style.background = C}>
            Register on Meetup <ArrowUpRight size={13} />
          </a>
        </div>

        {/* Highlights grid */}
        <div className="grid grid-cols-2 gap-3">
          {highlights.map((h, i) => (
            <div key={i} className="rounded-xl border p-4 flex flex-col gap-2"
              style={{ background: C + '08', borderColor: C + '25' }}>
              <Zap size={14} style={{ color: C }} />
              <span className="font-sans font-medium leading-snug"
                style={{ fontSize: '11px', color: 'var(--text-primary)' }}>
                {h}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Past event grid card ── */
function EventCard({ event }) {
  const { dark } = useTheme();
  const desc = event.description || '';

  return (
    <div className="rounded-xl border overflow-hidden flex flex-col transition-all duration-300"
      style={{ background: 'var(--card-bg)', borderColor: 'var(--border-muted)' }}
      onMouseEnter={e => e.currentTarget.style.borderColor = C + '60'}
      onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-muted)'}>

      <div className="relative h-28 flex items-end p-4 overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${C}22, ${C}08)` }}>
        <span className="absolute top-3 right-4 text-4xl opacity-20 select-none">
          {TYPE_ICONS[event.type] || '☁'}
        </span>
        <div className="absolute top-0 left-0 w-12 h-0.5" style={{ background: C }} />
        <div className="absolute top-0 left-0 w-0.5 h-12" style={{ background: C }} />
        <div className="space-y-1 relative z-10">
          <span className="font-mono font-bold uppercase px-2 py-0.5 rounded border"
            style={{ fontSize: '8px', background: C + '20', borderColor: C + '40', color: C }}>
            {event.type}
          </span>
          <div className="flex items-center gap-1.5 font-mono"
            style={{ fontSize: '9px', color: 'var(--text-subtle)' }}>
            <Calendar size={9} style={{ color: C }} /> {event.date}
          </div>
        </div>
      </div>

      <div className="p-4 flex flex-col gap-3 flex-1">
        <h3 className="font-bold leading-snug"
          style={{ fontSize: '13px', color: 'var(--text-primary)', lineHeight: 1.4 }}>
          {event.title}
        </h3>
        <p className="font-sans font-light leading-relaxed flex-1"
          style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
          {desc.length > 110 ? desc.slice(0, 110) + '…' : desc}
        </p>

        <div className="flex items-center justify-between pt-2 border-t mt-auto"
          style={{ borderColor: 'var(--border-muted)' }}>
          <span className="flex items-center gap-1 font-mono"
            style={{ fontSize: '9px', color: 'var(--text-subtle)' }}>
            <MapPin size={9} style={{ color: 'var(--text-subtle)' }} /> {event.location || 'Parul University'}
          </span>
          <span className="font-mono font-bold uppercase px-2 py-0.5 rounded"
            style={{ fontSize: '8px', background: dark ? '#1E293B' : '#E2E8F0', color: 'var(--text-muted)' }}>
            ✓ Past
          </span>
        </div>
      </div>
    </div>
  );
}

import { api } from '../../lib/api';

export default function EventsPage() {
  const [filter,  setFilter]  = useState('All');
  const [events,  setEvents]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  const fetchEvents = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.getEvents();
      // Sort by date descending
      const sorted = (data || []).sort((a, b) => b.date.localeCompare(a.date));
      setEvents(sorted);
    } catch {
      setError('Failed to load events. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEvents(); }, []);

  const upcoming = events.filter(e => e.status === 'upcoming');
  const past     = events.filter(e => e.status === 'past');

  const showUpcoming = filter === 'All' || filter === 'Upcoming';
  const showPast     = filter === 'All' || filter === 'Past';
  const totalShown   = (showUpcoming ? upcoming.length : 0) + (showPast ? past.length : 0);

  if (loading) {
    return (
      <div className="min-h-screen pt-20 pb-20 flex items-center justify-center" style={{ background: 'var(--bg)' }}>
        <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
          style={{ borderColor: C, borderTopColor: 'transparent' }} />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-20" style={{ background: 'var(--bg)' }}>

      {/* Banner */}
      <div className="relative overflow-hidden border-b" style={{ borderColor: 'var(--border-muted)' }}>
        <div className="site-grid-pattern absolute inset-0 pointer-events-none opacity-60" />
        <div className="absolute top-0 right-1/3 w-80 h-80 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(173,92,255,0.08) 0%, transparent 70%)', filter: 'blur(50px)' }} />
        <div className="relative z-10 max-w-6xl mx-auto px-6 py-16 text-center space-y-3">
          <p className="font-mono font-bold uppercase tracking-widest" style={{ fontSize: '10px', color: C }}>
            EVENTS :: AWS_SBG_PU
          </p>
          <h1 className="font-extrabold uppercase text-3xl md:text-4xl" style={{ color: 'var(--text-primary)' }}>
            Workshops & Events
          </h1>
          <p className="font-sans font-light leading-relaxed mx-auto"
            style={{ fontSize: '14px', color: 'var(--text-muted)', maxWidth: '480px' }}>
            Hands-on workshops, bootcamps, and community events — built around real AWS tools.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 pt-10 space-y-12">

        {/* Error */}
        {error && (
          <div className="rounded-lg border px-4 py-3"
            style={{ background: 'rgba(239,68,68,0.08)', borderColor: 'rgba(239,68,68,0.3)', color: '#EF4444', fontSize: '13px', fontFamily: 'inherit' }}>
            {error}
          </div>
        )}

        {/* Filter bar */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex gap-2 font-mono">
            {FILTERS.map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className="px-4 py-1.5 rounded-md border font-bold uppercase transition-all"
                style={{
                  fontSize: '10px', letterSpacing: '0.06em', cursor: 'pointer',
                  background: filter === f ? C : 'transparent',
                  borderColor: filter === f ? C : 'var(--border-muted)',
                  color: filter === f ? '#fff' : 'var(--text-muted)',
                }}>
                {f}
              </button>
            ))}
          </div>
          <span className="font-mono" style={{ fontSize: '10px', color: 'var(--text-subtle)' }}>
            {totalShown} event{totalShown !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Upcoming */}
        {showUpcoming && upcoming.length > 0 && (
          <div className="space-y-4">
            <p className="font-mono font-bold uppercase tracking-widest" style={{ fontSize: '10px', color: C }}>
              ◉ Upcoming
            </p>
            {upcoming.map(e => <UpcomingCard key={e.id} event={e} />)}
          </div>
        )}

        {showUpcoming && upcoming.length === 0 && filter !== 'Past' && (
          <div className="text-center py-12">
            <p className="font-sans" style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              No upcoming events at the moment. Check back soon!
            </p>
          </div>
        )}

        {/* Past */}
        {showPast && past.length > 0 && (
          <div className="space-y-4">
            <p className="font-mono font-bold uppercase tracking-widest" style={{ fontSize: '10px', color: 'var(--text-subtle)' }}>
              ✓ Past Events — {past.length} total
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {past.map(e => <EventCard key={e.id} event={e} />)}
            </div>
          </div>
        )}

        {/* Meetup CTA */}
        <div className="rounded-xl border p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          style={{ background: 'rgba(173,92,255,0.04)', borderColor: 'rgba(173,92,255,0.2)' }}>
          <div>
            <p className="font-mono font-bold uppercase" style={{ fontSize: '11px', color: 'var(--text-primary)' }}>
              STAY UPDATED
            </p>
            <p className="font-sans font-light mt-1" style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Join our Meetup group to get notified about every upcoming event.
            </p>
          </div>
          <a href={MEETUP} target="_blank" rel="noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md font-mono font-bold uppercase text-white no-underline transition-all flex-shrink-0"
            style={{ fontSize: '10px', background: C, boxShadow: '0 0 20px rgba(173,92,255,0.15)' }}
            onMouseEnter={e => e.currentTarget.style.background = '#9C47FF'}
            onMouseLeave={e => e.currentTarget.style.background = C}>
            Join on Meetup <ArrowUpRight size={12} />
          </a>
        </div>
      </div>
    </div>
  );
}
