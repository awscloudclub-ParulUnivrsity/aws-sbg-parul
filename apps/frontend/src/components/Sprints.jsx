import React from 'react';
import { Calendar, MapPin, CheckSquare, ArrowUpRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const checklist = [
  'Deploy your first web app live on AWS compute infrastructure',
  'Practice hands-on with EC2, AWS Lambda & S3 storage',
  'Prep for Cloud Practitioner (CLF-C02) certification paths',
  'Access official AWS community resources, pathways & credits',
];

export function Sprints() {
  const { dark } = useTheme();

  return (
    <section id="events" className="py-24 border-t relative"
      style={{ borderColor: 'var(--border-muted)' }}>
      <div className="max-w-6xl mx-auto px-6">

        <div className="text-center mb-16 space-y-2 font-mono">
          <p className="font-bold uppercase tracking-widest" style={{ fontSize: '10px', color: '#F97316' }}>
            PIPELINE :: ACTIVE_SPRINTS
          </p>
          <h2 className="text-2xl md:text-3xl font-extrabold uppercase" style={{ color: 'var(--text-primary)' }}>
            Engineering Sprints
          </h2>
          <p className="font-sans max-w-xl mx-auto" style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            Level up your architecture expertise by participating in our live local community bootcamp challenges.
          </p>
        </div>

        <div className="max-w-4xl mx-auto rounded-xl border overflow-hidden relative p-6 md:p-8 font-mono"
          style={{ background: 'var(--card-bg)', borderColor: 'var(--border-muted)' }}>

          <div className="absolute top-4 right-4 border font-bold rounded px-2 py-0.5"
            style={{ fontSize: '10px', background: 'rgba(173,92,255,0.1)', borderColor: '#AD5CFF', color: '#AD5CFF' }}>
            +50 EXPERIENCE XP
          </div>

          <div className="space-y-5 text-left">
            <div>
              <span className="font-bold uppercase tracking-widest block mb-1"
                style={{ fontSize: '10px', color: '#F97316' }}>
                FLAGSHIP LAUNCH CHALLENGE
              </span>
              <h3 className="text-xl md:text-2xl font-bold uppercase" style={{ color: 'var(--text-primary)' }}>
                AWS Cloud Ignite '26 — Parul Campus
              </h3>
            </div>

            <p className="font-sans font-light leading-relaxed max-w-3xl"
              style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              The grand inaugural assembly of the AWS Student Builder Group at Parul University.
              This challenge-driven intensive bootcamp introduces core serverless tools, storage
              infrastructure models, and builds cloud computing readiness.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 font-sans"
              style={{ fontSize: '11px', color: 'var(--text-primary)' }}>
              {checklist.map((point, i) => (
                <div key={i} className="flex items-start gap-2">
                  <CheckSquare size={13} className="shrink-0 mt-0.5" style={{ color: '#AD5CFF' }} />
                  <span>{point}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-y-2 gap-x-6 pt-5 border-t"
              style={{ borderColor: 'var(--border-muted)', fontSize: '10px', color: 'var(--text-muted)' }}>
              <div className="flex items-center gap-1.5">
                <Calendar size={13} style={{ color: '#06B6D4' }} />
                <span>SAT, JUNE 20, 2026</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin size={13} style={{ color: '#F97316' }} />
                <span className="uppercase">Seminar Hall, Computer Science Block, Parul University Campus</span>
              </div>
            </div>

            <a href="https://www.meetup.com" target="_blank" rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-md font-bold uppercase text-white no-underline transition-all"
              style={{ fontSize: '10px', letterSpacing: '0.08em', background: '#AD5CFF', boxShadow: '0 0 20px rgba(173,92,255,0.15)' }}
              onMouseEnter={e => e.currentTarget.style.background = '#9C47FF'}
              onMouseLeave={e => e.currentTarget.style.background = '#AD5CFF'}>
              Register for Sprint <ArrowUpRight size={12} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
