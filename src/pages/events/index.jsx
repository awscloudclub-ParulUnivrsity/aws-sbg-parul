import React, { useState } from 'react';
import { Calendar, MapPin, ArrowUpRight, Clock, Zap } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const MEETUP = 'https://www.meetup.com/aws-sbg-at-parul-university/';

const TYPE_ICONS = {
  'Workshop':       '⚡',
  'Bootcamp':       '🎯',
  'Community Event':'🌐',
  'Tech Talk':      '💡',
};

const EVENTS = [
  { id: 1,  status: 'upcoming', title: 'Explore Cloud With AWS', type: 'Workshop', date: 'JUN 8, 2026', location: 'Parul University, Vadodara', description: 'Explore the fundamentals of cloud computing with AWS — hands-on labs, live demos, and guided walkthroughs designed for students at all experience levels.', highlights: ['AWS core services intro', 'Hands-on lab sessions', 'Live Q&A with builders', 'Free tier walkthrough'], color: '#AD5CFF', registerUrl: MEETUP },
  { id: 2,  status: 'past', title: 'Cloud Verse 2.0', type: 'Community Event', date: 'MAR 2, 2026', location: 'Parul University, Vadodara', description: 'The second edition of Cloud Verse — a community gathering celebrating cloud builders with live project showcases, networking sessions, and talks from AWS practitioners.', highlights: ['Project showcases', 'Community networking', 'AWS practitioner talks', 'Builder recognition'], color: '#AD5CFF', registerUrl: null },
  { id: 3,  status: 'past', title: 'AWS Academy & AWS Certification Bootcamp', type: 'Bootcamp', date: 'JAN 10, 2026', location: 'Parul University, Vadodara', description: 'Intensive certification-focused bootcamp covering the full AWS Academy curriculum with targeted CLF-C02 exam preparation, mock tests, and hands-on service walkthroughs.', highlights: ['CLF-C02 exam prep', 'AWS Academy curriculum', 'Mock tests & review', 'Service walkthroughs'], color: '#06B6D4', registerUrl: null },
  { id: 4,  status: 'past', title: 'Introduction to AWS Academy', type: 'Workshop', date: 'DEC 26, 2025', location: 'Parul University, Vadodara', description: 'Onboarding session introducing students to AWS Academy learning resources, cloud certification pathways, and hands-on lab environments available through the programme.', highlights: ['AWS Academy onboarding', 'Learning path overview', 'Lab environment setup', 'Certification roadmap'], color: '#F97316', registerUrl: null },
  { id: 5,  status: 'past', title: 'AWS Student Community Day', type: 'Community Event', date: 'DEC 13, 2025', location: 'Parul University, Vadodara', description: 'A full community day bringing together AWS student builders from across the region for sessions, demos, and collaboration — celebrating the student builder ecosystem.', highlights: ['Student builder sessions', 'Cross-campus networking', 'AWS community demos', 'Collaborative workshops'], color: '#22C55E', registerUrl: null },
  { id: 6,  status: 'past', title: 'CloudCraft: Build Your AWS Foundation', type: 'Workshop', date: 'OCT 13, 2025', location: 'Parul University, Vadodara', description: 'A hands-on workshop guiding students through building their foundational AWS skill set — covering core infrastructure services, IAM, and storage with live exercises.', highlights: ['IAM & permissions', 'EC2 fundamentals', 'S3 storage basics', 'Live infrastructure labs'], color: '#F59E0B', registerUrl: null },
  { id: 7,  status: 'past', title: 'Build & Deploy: Hands-on with Amazon Q, EC2 & VPC', type: 'Workshop', date: 'JUL 23, 2025', location: 'Parul University, Vadodara', description: 'Practical session focused on building and deploying cloud applications using Amazon Q Developer, EC2 instances, and VPC networking — with live deployments by attendees.', highlights: ['Amazon Q Developer', 'EC2 deployment', 'VPC configuration', 'Live deploy session'], color: '#06B6D4', registerUrl: null },
  { id: 8,  status: 'past', title: 'AWS Cloud Club Presents DevOps Meets AI', type: 'Tech Talk', date: 'JUN 23, 2025', location: 'Parul University, Vadodara', description: 'An exploration of how DevOps practices and AI capabilities converge on AWS — covering CodePipeline, CodeBuild, and AI-powered automation tools in real-world workflows.', highlights: ['DevOps on AWS', 'AI-powered pipelines', 'CodePipeline & CodeBuild', 'Real-world use cases'], color: '#EC4899', registerUrl: null },
  { id: 9,  status: 'past', title: 'Cloud Climber - AWS Certification Edition', type: 'Bootcamp', date: 'MAY 31, 2025', location: 'Parul University, Vadodara', description: 'A certification-focused event helping students climb the AWS certification ladder — from Cloud Practitioner fundamentals through structured study sessions and exam tips.', highlights: ['Certification guidance', 'Study session structure', 'Exam tips & strategies', 'Peer study groups'], color: '#AD5CFF', registerUrl: null },
  { id: 10, status: 'past', title: 'AWS Cloud Practitioner Preparation by AWS Cloud Club', type: 'Bootcamp', date: 'MAR 9, 2025', location: 'Parul University, Vadodara', description: 'Dedicated CLF-C02 preparation session run by the AWS Cloud Club — covering all exam domains with practice questions, service deep-dives, and hands-on labs.', highlights: ['All CLF-C02 domains', 'Practice questions', 'Service deep-dives', 'Hands-on labs'], color: '#F97316', registerUrl: null },
  { id: 11, status: 'past', title: 'AWS Essentials: Build, Deploy, Scale - A Hands-on Workshop', type: 'Workshop', date: 'MAR 1, 2025', location: 'Parul University, Vadodara', description: 'End-to-end hands-on workshop taking students through the full lifecycle of a cloud application — from building and deploying to scaling with AWS managed services.', highlights: ['Build to deploy lifecycle', 'Auto Scaling groups', 'Load balancing', 'Managed services overview'], color: '#06B6D4', registerUrl: null },
  { id: 12, status: 'past', title: 'AWS CloudVerse 2025 – Explore, Connect, and Build in the AWS Universe', type: 'Community Event', date: 'FEB 15, 2025', location: 'Parul University, Vadodara', description: 'The inaugural CloudVerse event — an immersive community experience bringing together students and cloud enthusiasts to explore, connect, and build across the AWS ecosystem.', highlights: ['Community expo', 'Builder showcases', 'AWS ecosystem overview', 'Networking & connects'], color: '#22C55E', registerUrl: null },
];

const FILTERS = ['All', 'Upcoming', 'Past'];

/* ── Upcoming featured card ── */
function UpcomingCard({ event }) {
  return (
    <div className="rounded-2xl border overflow-hidden relative"
      style={{ background: 'var(--card-bg)', borderColor: event.color + '50' }}>

      {/* Gradient glow background */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: `radial-gradient(ellipse at top left, ${event.color}12 0%, transparent 60%)` }} />

      {/* Top bar */}
      <div className="h-1 w-full" style={{ background: `linear-gradient(to right, ${event.color}, #F97316)` }} />

      <div className="relative z-10 p-6 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Left */}
        <div className="space-y-5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono font-bold uppercase px-2.5 py-1 rounded-md"
              style={{ fontSize: '9px', background: '#AD5CFF', color: '#fff', letterSpacing: '0.08em' }}>
              ◉ UPCOMING
            </span>
            <span className="font-mono font-bold uppercase px-2.5 py-1 rounded-md border"
              style={{ fontSize: '9px', background: event.color + '15', borderColor: event.color + '40', color: event.color }}>
              {TYPE_ICONS[event.type]} {event.type}
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
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin size={11} style={{ color: '#F97316' }} /> {event.location}
            </span>
          </div>

          <a href={event.registerUrl} target="_blank" rel="noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-md font-mono font-bold uppercase text-white no-underline transition-all"
            style={{ fontSize: '11px', background: event.color, boxShadow: `0 0 24px ${event.color}40` }}
            onMouseEnter={e => e.currentTarget.style.background = '#9C47FF'}
            onMouseLeave={e => e.currentTarget.style.background = event.color}>
            Register on Meetup <ArrowUpRight size={13} />
          </a>
        </div>

        {/* Right — highlights */}
        <div className="grid grid-cols-2 gap-3">
          {event.highlights.map((h, i) => (
            <div key={i} className="rounded-xl border p-4 flex flex-col gap-2"
              style={{ background: event.color + '08', borderColor: event.color + '25' }}>
              <Zap size={14} style={{ color: event.color }} />
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

  return (
    <div className="rounded-xl border overflow-hidden flex flex-col transition-all duration-300 group"
      style={{ background: 'var(--card-bg)', borderColor: 'var(--border-muted)' }}
      onMouseEnter={e => e.currentTarget.style.borderColor = event.color + '60'}
      onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-muted)'}>

      {/* Card header with gradient */}
      <div className="relative h-28 flex items-end p-4 overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${event.color}22, ${event.color}08)` }}>
        {/* Large muted type icon */}
        <span className="absolute top-3 right-4 text-4xl opacity-20 select-none">
          {TYPE_ICONS[event.type] || '☁'}
        </span>
        {/* Corner line accent */}
        <div className="absolute top-0 left-0 w-12 h-0.5" style={{ background: event.color }} />
        <div className="absolute top-0 left-0 w-0.5 h-12" style={{ background: event.color }} />

        <div className="space-y-1 relative z-10">
          <span className="font-mono font-bold uppercase px-2 py-0.5 rounded border"
            style={{ fontSize: '8px', background: event.color + '20', borderColor: event.color + '40', color: event.color }}>
            {event.type}
          </span>
          <div className="flex items-center gap-1.5 font-mono"
            style={{ fontSize: '9px', color: 'var(--text-subtle)' }}>
            <Calendar size={9} style={{ color: event.color }} /> {event.date}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col gap-3 flex-1">
        <h3 className="font-bold leading-snug"
          style={{ fontSize: '13px', color: 'var(--text-primary)', lineHeight: 1.4 }}>
          {event.title}
        </h3>

        <p className="font-sans font-light leading-relaxed flex-1"
          style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
          {event.description.length > 110 ? event.description.slice(0, 110) + '…' : event.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {event.highlights.slice(0, 2).map(h => (
            <span key={h} className="font-mono px-2 py-0.5 rounded"
              style={{ fontSize: '8px', background: event.color + '12', color: event.color }}>
              {h}
            </span>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t mt-auto"
          style={{ borderColor: 'var(--border-muted)' }}>
          <span className="flex items-center gap-1 font-mono"
            style={{ fontSize: '9px', color: 'var(--text-subtle)' }}>
            <MapPin size={9} style={{ color: 'var(--text-subtle)' }} /> Parul University
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

export default function EventsPage() {
  const [filter, setFilter] = useState('All');

  const upcoming = EVENTS.filter(e => e.status === 'upcoming');
  const past = EVENTS.filter(e => e.status === 'past');

  const showUpcoming = filter === 'All' || filter === 'Upcoming';
  const showPast = filter === 'All' || filter === 'Past';

  const totalShown = (showUpcoming ? upcoming.length : 0) + (showPast ? past.length : 0);

  return (
    <div className="min-h-screen pt-20 pb-20" style={{ background: 'var(--bg)' }}>

      {/* Banner */}
      <div className="relative overflow-hidden border-b" style={{ borderColor: 'var(--border-muted)' }}>
        <div className="site-grid-pattern absolute inset-0 pointer-events-none opacity-60" />
        <div className="absolute top-0 right-1/3 w-80 h-80 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(173,92,255,0.08) 0%, transparent 70%)', filter: 'blur(50px)' }} />
        <div className="relative z-10 max-w-6xl mx-auto px-6 py-16 text-center space-y-3">
          <p className="font-mono font-bold uppercase tracking-widest" style={{ fontSize: '10px', color: '#AD5CFF' }}>
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

        {/* Filter bar */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex gap-2 font-mono">
            {FILTERS.map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className="px-4 py-1.5 rounded-md border font-bold uppercase transition-all"
                style={{
                  fontSize: '10px',
                  letterSpacing: '0.06em',
                  background: filter === f ? '#AD5CFF' : 'transparent',
                  borderColor: filter === f ? '#AD5CFF' : 'var(--border-muted)',
                  color: filter === f ? '#fff' : 'var(--text-muted)',
                  cursor: 'pointer',
                }}>
                {f}
              </button>
            ))}
          </div>
          <span className="font-mono" style={{ fontSize: '10px', color: 'var(--text-subtle)' }}>
            {totalShown} event{totalShown !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Upcoming — full-width featured */}
        {showUpcoming && upcoming.length > 0 && (
          <div className="space-y-4">
            <p className="font-mono font-bold uppercase tracking-widest"
              style={{ fontSize: '10px', color: '#AD5CFF' }}>
              ◉ Upcoming
            </p>
            {upcoming.map(e => <UpcomingCard key={e.id} event={e} />)}
          </div>
        )}

        {/* Past — 3-col grid */}
        {showPast && past.length > 0 && (
          <div className="space-y-4">
            <p className="font-mono font-bold uppercase tracking-widest"
              style={{ fontSize: '10px', color: 'var(--text-subtle)' }}>
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
            style={{ fontSize: '10px', background: '#AD5CFF', boxShadow: '0 0 20px rgba(173,92,255,0.15)' }}
            onMouseEnter={e => e.currentTarget.style.background = '#9C47FF'}
            onMouseLeave={e => e.currentTarget.style.background = '#AD5CFF'}>
            Join on Meetup <ArrowUpRight size={12} />
          </a>
        </div>
      </div>
    </div>
  );
}
