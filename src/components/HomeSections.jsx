import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, ArrowUpRight, Clock, Users } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const C = '#AD5CFF'; // single brand color for all cards

/* ─────────────────────────────────────────
   UPCOMING EVENTS
───────────────────────────────────────── */
const UPCOMING = [
  {
    title: 'Explore Cloud With AWS',
    type: 'Workshop',
    date: 'MON, JUNE 8, 2026',
    time: 'TBA',
    location: 'Parul University, Vadodara',
    desc: 'Explore the fundamentals of cloud computing with AWS — hands-on labs, live demos, and guided walkthroughs for students at all levels.',
    href: '/events',
  },
];

export function UpcomingEvents() {
  return (
    <section className="py-20 border-t" style={{ borderColor: 'var(--border-muted)' }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-end justify-between mb-10 gap-4 flex-wrap">
          <div className="space-y-1">
            <p className="font-mono font-bold uppercase tracking-widest" style={{ fontSize: '10px', color: C }}>
              UPCOMING
            </p>
            <h2 className="text-2xl font-extrabold uppercase" style={{ color: 'var(--text-primary)' }}>
              Next Events
            </h2>
          </div>
          <Link to="/events"
            className="inline-flex items-center gap-1.5 font-mono font-bold uppercase no-underline transition-colors"
            style={{ fontSize: '10px', color: 'var(--text-muted)' }}
            onMouseEnter={e => e.currentTarget.style.color = C}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>
            All Events <ArrowUpRight size={12} />
          </Link>
        </div>

        <div className="space-y-5">
          {UPCOMING.map(ev => (
            <div key={ev.title}
              className="rounded-2xl border overflow-hidden transition-all duration-300"
              style={{ background: 'var(--card-bg)', borderColor: 'var(--border-muted)' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = C + '60'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-muted)'}>

              <div className="h-1 w-full" style={{ background: `linear-gradient(to right, ${C}, #F97316)` }} />

              <div className="p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-6">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono font-bold uppercase px-2 py-0.5 rounded border"
                      style={{ fontSize: '8px', background: C + '15', borderColor: C + '40', color: C }}>
                      {ev.type}
                    </span>
                    <span className="font-mono font-bold uppercase px-2 py-0.5 rounded"
                      style={{ fontSize: '8px', background: C, color: '#fff' }}>
                      ◉ UPCOMING
                    </span>
                  </div>
                  <h3 className="font-extrabold text-xl uppercase" style={{ color: 'var(--text-primary)' }}>
                    {ev.title}
                  </h3>
                  <p className="font-sans font-light leading-relaxed"
                    style={{ fontSize: '13px', color: 'var(--text-muted)', maxWidth: '560px' }}>
                    {ev.desc}
                  </p>
                  <div className="flex flex-wrap gap-x-5 gap-y-1.5 font-mono"
                    style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                    <span className="flex items-center gap-1.5"><Calendar size={11} style={{ color: C }} />{ev.date}</span>
                    <span className="flex items-center gap-1.5"><MapPin size={11} style={{ color: '#F97316' }} />{ev.location}</span>
                  </div>
                </div>
                <Link to={ev.href}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-md font-mono font-bold uppercase text-white no-underline transition-all flex-shrink-0 self-start md:self-center"
                  style={{ fontSize: '10px', background: C, boxShadow: `0 0 20px ${C}30` }}
                  onMouseEnter={e => e.currentTarget.style.background = '#9C47FF'}
                  onMouseLeave={e => e.currentTarget.style.background = C}>
                  Learn More <ArrowUpRight size={12} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   PAST EVENTS
───────────────────────────────────────── */
const PAST = [
  {
    title: 'Cloud Verse 2.0',
    type: 'Community Event',
    date: 'MAR 2, 2026',
    location: 'Parul University, Vadodara',
    desc: 'The second edition of Cloud Verse — a community gathering celebrating cloud builders, live project showcases, and networking.',
    photo: '/photos/events/cloud-verse-2.jpg',
  },
  {
    title: 'AWS Academy & AWS Certification Bootcamp',
    type: 'Bootcamp',
    date: 'JAN 10, 2026',
    location: 'Parul University, Vadodara',
    desc: 'Intensive certification bootcamp covering AWS Academy curriculum and CLF-C02 exam preparation strategies.',
    photo: '/photos/events/certification-bootcamp.jpg',
  },
  {
    title: 'Introduction to AWS Academy',
    type: 'Workshop',
    date: 'DEC 26, 2025',
    location: 'Parul University, Vadodara',
    desc: 'Onboarding session introducing students to AWS Academy resources, learning paths, and cloud fundamentals.',
    photo: '/photos/events/aws-academy-intro.jpg',
  },
];

function PastCard({ ev }) {
  const { dark } = useTheme();
  const [imgFailed, setImgFailed] = React.useState(false);

  return (
    <div className="rounded-xl border overflow-hidden flex flex-col transition-all duration-300"
      style={{ background: 'var(--card-bg)', borderColor: 'var(--border-muted)' }}
      onMouseEnter={e => e.currentTarget.style.borderColor = C + '60'}
      onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-muted)'}>

      <div className="relative overflow-hidden flex items-center justify-center"
        style={{ aspectRatio: '16/9', background: dark ? '#0D1117' : '#F1F5F9' }}>
        {!imgFailed ? (
          <img src={ev.photo} alt={ev.title}
            className="absolute inset-0 w-full h-full object-cover object-center"
            onError={() => setImgFailed(true)} />
        ) : (
          <Calendar size={28} style={{ color: C + '80' }} />
        )}
        <div className="absolute top-3 left-3 font-mono font-bold uppercase px-2 py-0.5 rounded"
          style={{ fontSize: '8px', background: dark ? '#1E293B' : '#E2E8F0', color: 'var(--text-muted)' }}>
          ✓ PAST
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-8 pointer-events-none"
          style={{ background: 'linear-gradient(to top, var(--card-bg), transparent)' }} />
      </div>

      <div className="p-4 flex flex-col gap-2 flex-1">
        <span className="font-mono font-bold uppercase" style={{ fontSize: '8px', color: C }}>{ev.type}</span>
        <h3 className="font-bold leading-snug" style={{ fontSize: '13px', color: 'var(--text-primary)' }}>{ev.title}</h3>
        <p className="font-sans font-light leading-relaxed flex-1" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{ev.desc}</p>
        <div className="flex flex-col gap-1 font-mono pt-1" style={{ fontSize: '9px', color: 'var(--text-subtle)' }}>
          <span className="flex items-center gap-1.5"><Calendar size={9} style={{ color: C }} />{ev.date}</span>
          <span className="flex items-center gap-1.5"><MapPin size={9} style={{ color: C }} />{ev.location}</span>
        </div>
      </div>
    </div>
  );
}

export function PastEvents() {
  return (
    <section className="py-20 border-t" style={{ borderColor: 'var(--border-muted)' }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-end justify-between mb-10 gap-4 flex-wrap">
          <div className="space-y-1">
            <p className="font-mono font-bold uppercase tracking-widest" style={{ fontSize: '10px', color: C }}>
              ARCHIVE
            </p>
            <h2 className="text-2xl font-extrabold uppercase" style={{ color: 'var(--text-primary)' }}>
              Past Events
            </h2>
          </div>
          <Link to="/events"
            className="inline-flex items-center gap-1.5 font-mono font-bold uppercase no-underline transition-colors"
            style={{ fontSize: '10px', color: 'var(--text-muted)' }}
            onMouseEnter={e => e.currentTarget.style.color = C}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>
            View All <ArrowUpRight size={12} />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PAST.map(ev => <PastCard key={ev.title} ev={ev} />)}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   COMMUNITY COLLABORATIONS
───────────────────────────────────────── */
const COLLABS = [
  {
    name: 'AWS UG Ahmedabad',
    handle: '@awsugahmedabad',
    desc: 'The Ahmedabad AWS User Group — one of the most active AWS communities in Gujarat, connecting cloud professionals, builders, and students across the city.',
    url: 'https://www.meetup.com/amazon-web-services-ahmedabad/',
    initial: 'AHM',
    logo: '/logos/aws-ug-ahmedabad.png',
  },
  {
    name: 'AWS UG Vadodara',
    handle: '@awsugvadodara',
    desc: 'The Vadodara AWS User Group — our local chapter partner driving cloud adoption and knowledge sharing in the Baroda region, right in our backyard.',
    url: 'https://www.meetup.com/awsugvadodara/',
    initial: 'VDR',
    logo: '/logos/aws-ug-vadodara.png',
  },
];

function CollabCard({ collab }) {
  const [imgFailed, setImgFailed] = React.useState(false);

  return (
    <div className="rounded-2xl border overflow-hidden flex flex-col md:flex-row transition-all duration-300"
      style={{ background: 'var(--card-bg)', borderColor: 'var(--border-muted)' }}
      onMouseEnter={e => e.currentTarget.style.borderColor = C + '60'}
      onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-muted)'}>

      <div className="w-full md:w-1 md:h-auto h-1 flex-shrink-0"
        style={{ background: `linear-gradient(to bottom, ${C}, #F97316)` }} />

      <div className="p-6 flex flex-col sm:flex-row items-start sm:items-center gap-5 flex-1">
        <div className="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden border"
          style={{ background: C + '12', borderColor: C + '30' }}>
          {!imgFailed ? (
            <img src={collab.logo} alt={collab.name}
              className="w-full h-full object-contain p-2"
              onError={() => setImgFailed(true)} />
          ) : (
            <span className="font-mono font-black text-xs" style={{ color: C }}>{collab.initial}</span>
          )}
        </div>

        <div className="flex-1 space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-bold" style={{ fontSize: '15px', color: 'var(--text-primary)' }}>
              {collab.name}
            </h3>
            <span className="font-mono" style={{ fontSize: '10px', color: C }}>
              {collab.handle}
            </span>
          </div>
          <p className="font-sans font-light leading-relaxed"
            style={{ fontSize: '12px', color: 'var(--text-muted)', maxWidth: '480px' }}>
            {collab.desc}
          </p>
        </div>

        <a href={collab.url} target="_blank" rel="noreferrer"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md font-mono font-bold uppercase no-underline transition-all flex-shrink-0 self-start sm:self-center"
          style={{ fontSize: '9px', color: C, border: '1px solid', borderColor: C + '40', background: C + '08' }}
          onMouseEnter={e => { e.currentTarget.style.background = C; e.currentTarget.style.color = '#fff'; }}
          onMouseLeave={e => { e.currentTarget.style.background = C + '08'; e.currentTarget.style.color = C; }}>
          Visit <ArrowUpRight size={11} />
        </a>
      </div>
    </div>
  );
}

export function CommunityCollabs() {
  return (
    <section className="py-20 border-t" style={{ borderColor: 'var(--border-muted)' }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-10 space-y-2">
          <p className="font-mono font-bold uppercase tracking-widest" style={{ fontSize: '10px', color: C }}>
            NETWORK :: COMMUNITY_PARTNERS
          </p>
          <h2 className="text-2xl font-extrabold uppercase" style={{ color: 'var(--text-primary)' }}>
            Community Collaborations
          </h2>
          <p className="font-sans font-light"
            style={{ fontSize: '13px', color: 'var(--text-muted)', maxWidth: '460px', margin: '0 auto' }}>
            We work alongside these AWS User Groups to connect our members with the wider Gujarat cloud ecosystem.
          </p>
        </div>

        <div className="space-y-5">
          {COLLABS.map(c => <CollabCard key={c.name} collab={c} />)}
        </div>

        <div className="mt-8 rounded-xl border p-5 flex items-center gap-4"
          style={{ background: C + '06', borderColor: C + '25' }}>
          <Users size={18} style={{ color: C, flexShrink: 0 }} />
          <p className="font-sans font-light" style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            AWS User Groups are free, community-led groups open to everyone — students, professionals, and enthusiasts.{' '}
            <a href="https://aws.amazon.com/developer/community/usergroups/" target="_blank" rel="noreferrer"
              className="no-underline font-semibold transition-colors"
              style={{ color: C }}
              onMouseEnter={e => e.currentTarget.style.color = '#9C47FF'}
              onMouseLeave={e => e.currentTarget.style.color = C}>
              Find your local group →
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
