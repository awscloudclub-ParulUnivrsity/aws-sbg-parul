import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Users, Award, Cpu } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const milestones = [
  { year: '2022', label: 'AWS Cloud Club Founded', desc: 'Dr. Vaibhav Gandhi established the AWS Cloud Club at Parul University, creating the first dedicated cloud computing community on campus.' },
  { year: '2023', label: 'First Cohort Launched', desc: 'Under founding Captain Rishabh Tanwar, the club ran its first structured learning cohort with hands-on EC2, S3, and IAM workshops.' },
  { year: '2024', label: 'Community Grows to 300+', desc: 'The club expanded across departments, hosting inter-college hackathons and partnering with AWS India for official resources and credits.' },
  { year: '2025', label: 'Rebranded to AWS SBG', desc: "The chapter evolved into the AWS Student Builder Group at Parul University under new leadership, aligning with AWS's global builder program." },
  { year: '2026', label: 'New Chapter, New Mission', desc: 'Under Chapter Lead Manish Kudtarkar, AWS SBG PU launched its flagship Cloud Ignite event and is driving CLF-C02 certification readiness across 500+ members.' },
];

const leaders = [
  {
    name: 'Dr. Vaibhav Gandhi',
    role: 'Faculty Founder',
    desc: 'Faculty member at Parul University who founded the AWS Cloud Club and continues to guide the community with industry expertise and academic mentorship.',
    gradient: 'linear-gradient(135deg, #06B6D4, #AD5CFF)',
    initial: 'VG',
    photo: '/about-us/vaibhav-gandhi-sir.png',
    color: '#06B6D4',
  },
  {
    name: 'Rishabh Tanwar',
    role: 'Founding Captain — AWS Cloud Club',
    desc: 'Led the AWS Cloud Club from its inception, building the foundational structure, first workshops, and the community culture that the group stands on today.',
    gradient: 'linear-gradient(135deg, #F97316, #F59E0B)',
    initial: 'RT',
    photo: '/about-us/rishabh-tanwar.png',
    color: '#F97316',
  },
  {
    name: 'Manish Kudtarkar',
    role: 'Chapter Lead — AWS SBG',
    desc: 'Current leader of the AWS Student Builder Group at Parul University, driving production-grade cloud workshops and CLF-C02 certification readiness across 500+ members.',
    gradient: 'linear-gradient(135deg, #AD5CFF, #F97316)',
    initial: 'MK',
    photo: '/about-us/manish-kudtarkar.png',
    color: '#AD5CFF',
  },
];

const values = [
  { icon: Cpu,   label: "Build, Don't Just Learn", desc: 'Every session ends with something deployed — real infrastructure on real AWS accounts.' },
  { icon: Users, label: 'Community First',          desc: 'Peer learning, code reviews, and shared goals keep every member growing together.' },
  { icon: Award, label: 'Certification Ready',      desc: 'Everything we do is mapped to CLF-C02 objectives so members gain credentials alongside skills.' },
];

function LeaderCard({ person }) {
  const { dark } = useTheme();
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <div
      className="rounded-2xl border overflow-hidden flex flex-col transition-all duration-300"
      style={{ background: 'var(--card-bg)', borderColor: 'var(--border-muted)' }}
      onMouseEnter={e => e.currentTarget.style.borderColor = person.color + '60'}
      onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-muted)'}
    >
      {/* Color top strip */}
      <div className="h-1 w-full" style={{ background: person.gradient }} />

      {/* Photo / fallback */}
      <div className="relative overflow-hidden flex items-center justify-center"
        style={{ height: '220px', background: dark ? '#0D1117' : '#F1F5F9' }}>
        {!imgFailed ? (
          <img
            src={person.photo}
            alt={person.name}
            className="w-full h-full object-cover object-top"
            onError={() => setImgFailed(true)}
          />
        ) : (
          <div className="w-24 h-24 rounded-2xl flex items-center justify-center font-black text-white text-3xl"
            style={{ background: person.gradient }}>
            {person.initial}
          </div>
        )}
        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-10 pointer-events-none"
          style={{ background: 'linear-gradient(to top, var(--card-bg), transparent)' }} />
      </div>

      {/* Info */}
      <div className="px-5 pt-3 pb-5 flex flex-col gap-2 flex-1">
        <span className="font-mono font-bold uppercase tracking-widest"
          style={{ fontSize: '8px', color: person.color }}>
          {person.role}
        </span>
        <h3 className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>
          {person.name}
        </h3>
        <p className="font-sans font-light leading-relaxed"
          style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
          {person.desc}
        </p>
      </div>
    </div>
  );
}

export default function AboutPage() {
  const { dark } = useTheme();

  return (
    <div className="min-h-screen pt-20 pb-20" style={{ background: 'var(--bg)' }}>

      {/* Hero banner */}
      <div className="relative overflow-hidden border-b" style={{ borderColor: 'var(--border-muted)' }}>
        <div className="site-grid-pattern absolute inset-0 pointer-events-none opacity-60" />
        <div className="absolute top-0 left-1/3 w-96 h-96 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(173,92,255,0.07) 0%, transparent 70%)', filter: 'blur(50px)' }} />
        <div className="relative z-10 max-w-5xl mx-auto px-6 py-20 text-center space-y-4">
          <p className="font-mono font-bold uppercase tracking-widest" style={{ fontSize: '10px', color: '#AD5CFF' }}>
            OUR STORY :: AWS_SBG_PU
          </p>
          <h1 className="font-extrabold uppercase text-3xl md:text-5xl leading-tight" style={{ color: 'var(--text-primary)' }}>
            From Cloud Club<br />
            <span className="text-shimmer">to Student Builder Group</span>
          </h1>
          <p className="font-sans font-light leading-relaxed mx-auto"
            style={{ fontSize: '15px', color: 'var(--text-muted)', maxWidth: '580px' }}>
            What started as a small faculty-led initiative in 2022 has grown into Parul University's
            most active cloud engineering community — now officially part of the AWS Student Builder Group programme.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 space-y-20 pt-16">

        {/* Rebrand callout */}
        <div className="rounded-2xl border p-8 md:p-10 relative overflow-hidden"
          style={{ background: dark ? 'rgba(173,92,255,0.04)' : 'rgba(173,92,255,0.03)', borderColor: 'rgba(173,92,255,0.25)' }}>
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(173,92,255,0.08) 0%, transparent 70%)', filter: 'blur(40px)' }} />
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <span className="inline-block font-mono font-bold uppercase tracking-widest px-3 py-1 rounded-md border"
                style={{ fontSize: '9px', color: '#F97316', borderColor: '#F97316' + '40', background: '#F97316' + '10' }}>
                OFFICIAL REBRAND
              </span>
              <h2 className="font-extrabold text-2xl uppercase" style={{ color: 'var(--text-primary)' }}>
                AWS Cloud Club → AWS Student Builder Group
              </h2>
              <p className="font-sans leading-relaxed" style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                The <strong style={{ color: 'var(--text-primary)' }}>AWS Cloud Club at Parul University</strong> has
                officially transitioned into the <strong style={{ color: '#AD5CFF' }}>AWS Student Builder Group at Parul University</strong>.
                This isn't just a name change — it's an elevation of our mission, scope, and resources.
              </p>
              <p className="font-sans leading-relaxed" style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                The AWS Student Builder Group programme gives us direct access to AWS credits,
                official programme support, and a global network of cloud builders.
              </p>
            </div>
            <div className="flex flex-col gap-3 font-mono">
              {[
                { old: 'AWS Cloud Club',          now: 'AWS Student Builder Group' },
                { old: 'Captain Rishabh Tanwar',  now: 'Chapter Lead Manish Kudtarkar' },
                { old: 'Workshop-based learning', now: 'Production event cycles' },
                { old: 'Campus-only community',   now: 'Global AWS builder network' },
              ].map(({ old, now }) => (
                <div key={old} className="flex items-center gap-3 text-xs">
                  <span className="line-through" style={{ color: 'var(--text-subtle)', minWidth: '160px' }}>{old}</span>
                  <span style={{ color: '#AD5CFF' }}>→</span>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{now}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Leadership */}
        <div>
          <div className="text-center mb-10 space-y-2">
            <p className="font-mono font-bold uppercase tracking-widest" style={{ fontSize: '10px', color: '#AD5CFF' }}>
              THE PEOPLE BEHIND IT
            </p>
            <h2 className="font-extrabold text-2xl uppercase" style={{ color: 'var(--text-primary)' }}>
              Our Leadership
            </h2>
            <p className="font-sans font-light" style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              Add photos to <code className="font-mono" style={{ color: '#AD5CFF' }}>public/about-us/</code>
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {leaders.map(person => <LeaderCard key={person.name} person={person} />)}
          </div>
        </div>

        {/* Timeline */}
        <div>
          <div className="text-center mb-10 space-y-2">
            <p className="font-mono font-bold uppercase tracking-widest" style={{ fontSize: '10px', color: '#06B6D4' }}>
              TIMELINE
            </p>
            <h2 className="font-extrabold text-2xl uppercase" style={{ color: 'var(--text-primary)' }}>
              Our Journey
            </h2>
          </div>

          <div className="relative">
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px"
              style={{ background: 'var(--border-muted)', transform: 'translateX(-50%)' }} />

            <div className="space-y-8">
              {milestones.map((m, i) => (
                <div key={m.year} className="relative pl-12 md:pl-0">
                  {/* Dot */}
                  <div className="absolute left-4 md:left-1/2 w-3 h-3 rounded-full border-2 top-5 -translate-x-1/2"
                    style={{ background: '#AD5CFF', borderColor: 'var(--bg)' }} />

                  {/* Card — alternating sides on desktop */}
                  <div className={`md:w-[46%] ${i % 2 === 0 ? 'md:ml-0' : 'md:ml-auto'}`}>
                    <div className="rounded-xl border p-5 transition-all"
                      style={{ background: 'var(--card-bg)', borderColor: 'var(--border-muted)' }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-active)'}
                      onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-muted)'}>
                      <span className="font-mono font-bold" style={{ fontSize: '10px', color: '#AD5CFF' }}>
                        {m.year}
                      </span>
                      <h3 className="font-bold mt-1 mb-1.5" style={{ fontSize: '14px', color: 'var(--text-primary)' }}>
                        {m.label}
                      </h3>
                      <p className="font-sans font-light leading-relaxed"
                        style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                        {m.desc}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Values */}
        <div>
          <div className="text-center mb-10 space-y-2">
            <p className="font-mono font-bold uppercase tracking-widest" style={{ fontSize: '10px', color: '#F97316' }}>
              WHAT WE STAND FOR
            </p>
            <h2 className="font-extrabold text-2xl uppercase" style={{ color: 'var(--text-primary)' }}>
              Our Values
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map(({ icon: Icon, label, desc }) => (
              <div key={label} className="rounded-xl border p-6 text-center space-y-3 transition-all"
                style={{ background: 'var(--card-bg)', borderColor: 'var(--border-muted)' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-active)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-muted)'}>
                <div className="w-10 h-10 rounded-xl mx-auto flex items-center justify-center"
                  style={{ background: 'rgba(173,92,255,0.1)', color: '#AD5CFF' }}>
                  <Icon size={18} />
                </div>
                <h3 className="font-bold font-mono uppercase" style={{ fontSize: '11px', color: 'var(--text-primary)' }}>
                  {label}
                </h3>
                <p className="font-sans font-light leading-relaxed"
                  style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center space-y-4 pb-4">
          <h2 className="font-extrabold text-xl uppercase" style={{ color: 'var(--text-primary)' }}>
            Ready to Build with Us?
          </h2>
          <div className="flex flex-wrap justify-center gap-4 font-mono">
            <Link to="/events"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-md font-bold uppercase text-white no-underline transition-all"
              style={{ fontSize: '11px', background: '#AD5CFF', boxShadow: '0 0 20px rgba(173,92,255,0.2)' }}
              onMouseEnter={e => e.currentTarget.style.background = '#9C47FF'}
              onMouseLeave={e => e.currentTarget.style.background = '#AD5CFF'}>
              View Events <ArrowUpRight size={13} />
            </Link>
            <Link to="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-md font-bold uppercase no-underline transition-all"
              style={{ fontSize: '11px', background: 'var(--surface-low)', border: '1px solid var(--border-muted)', color: 'var(--text-primary)' }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-mid)'}
              onMouseLeave={e => e.currentTarget.style.background = 'var(--surface-low)'}>
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
