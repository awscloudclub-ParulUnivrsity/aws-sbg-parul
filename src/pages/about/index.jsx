import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Users, Award, Cpu } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const milestones = [
  { year: '2022', label: 'AWS Cloud Club Founded', desc: 'Dr. Vaibhav Gandhi established the AWS Cloud Club at Parul University, creating the first dedicated cloud computing community on campus.' },
  { year: '2023', label: 'First Cohort Launched', desc: 'Under Captain Rishabh Tanwar, the club ran its first structured learning cohort with hands-on EC2, S3, and IAM workshops.' },
  { year: '2024', label: 'Community Grows to 1000+', desc: 'The club expanded across departments, hosting inter-college hackathons and partnering with AWS India for official resources and credits.' },
  { year: '2025', label: 'Rebranded to AWS SBG', desc: "The chapter officially evolved into the AWS Student Builder Group at Parul University, aligning with AWS's global builder programme. Rishabh Tanwar led the club through this transformation." },
  { year: '2026', label: 'New Leader, New Mission', desc: 'Manish Kudtarkar takes charge as Chapter Lead of AWS SBG PU, driving CLF-C02 certification readiness and growing the community to 3000+ active members.' },
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
    role: 'Captain — AWS Cloud Club',
    desc: 'Led the AWS Cloud Club from 2022 to 2025, building the foundational structure, first workshops, and the community culture that the group stands on today.',
    gradient: 'linear-gradient(135deg, #F97316, #F59E0B)',
    initial: 'RT',
    photo: '/about-us/rishabh-tanwar.png',
    color: '#F97316',
  },
  {
    name: 'Manish Kudtarkar',
    role: 'Chapter Lead — AWS SBG (2026)',
    desc: 'Current leader of the AWS Student Builder Group at Parul University, driving production-grade cloud workshops and CLF-C02 certification readiness across 3000+ members.',
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

function RebrandPhoto({ photo, initial, gradient, dark }) {
  const [imgFailed, setImgFailed] = useState(false);
  return (
    <div className="relative rounded-xl overflow-hidden flex items-center justify-center"
      style={{ aspectRatio: '4/3', background: dark ? '#0D1117' : '#F1F5F9' }}>
      {!imgFailed ? (
        <img src={photo} alt={initial}
          className="absolute inset-0 w-full h-full object-cover object-center"
          onError={() => setImgFailed(true)} />
      ) : (
        <div className="w-20 h-20 rounded-2xl flex items-center justify-center font-black text-white text-2xl"
          style={{ background: gradient }}>
          {initial}
        </div>
      )}
      <div className="absolute bottom-0 left-0 right-0 h-12 pointer-events-none"
        style={{ background: 'linear-gradient(to top, var(--card-bg), transparent)' }} />
    </div>
  );
}

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
        style={{ aspectRatio: '4/3', background: dark ? '#0D1117' : '#F1F5F9' }}>
        {!imgFailed ? (
          <img
            src={person.photo}
            alt={person.name}
            className="absolute inset-0 w-full h-full object-cover object-center"
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

        {/* ── SECTION 1: Club Rebrand ── */}
        <div className="rounded-2xl border overflow-hidden"
          style={{ borderColor: 'rgba(249,115,24,0.3)', background: dark ? 'rgba(249,115,24,0.03)' : 'rgba(249,115,24,0.02)' }}>

          {/* Header bar */}
          <div className="flex items-center gap-3 px-6 py-3 border-b flex-wrap"
            style={{ borderColor: 'rgba(249,115,24,0.15)', background: 'rgba(249,115,24,0.06)' }}>
            <span className="font-mono font-bold uppercase tracking-widest px-2.5 py-1 rounded border"
              style={{ fontSize: '9px', color: '#F97316', borderColor: '#F9731640', background: '#F9731610' }}>
              OFFICIAL REBRAND
            </span>
            <span className="font-mono" style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
              2025 — Name &amp; Programme Transition
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr]">

            {/* Before */}
            <div className="p-6 md:p-8 space-y-4">
              <p className="font-mono font-bold uppercase tracking-widest" style={{ fontSize: '9px', color: '#F97316' }}>BEFORE — 2022 TO 2025</p>
              <div className="rounded-xl border p-5 space-y-3"
                style={{ background: dark ? '#0D1117' : '#FFF7ED', borderColor: '#F9731630' }}>
                <img src="/aws cloud club logo.png" alt="AWS Cloud Club"
                  className="h-12 w-auto object-contain" />
                <h3 className="font-bold text-base line-through" style={{ color: 'var(--text-muted)' }}>AWS Cloud Club</h3>
                <p className="font-sans font-light" style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  A campus-level cloud learning initiative running workshops and introductory sessions for engineering students.
                </p>
                <div className="space-y-1.5">
                  {['Campus-only reach', 'Workshop-based learning', 'Local resources only', 'Club programme'].map(t => (
                    <div key={t} className="flex items-center gap-2 font-mono" style={{ fontSize: '10px', color: 'var(--text-subtle)' }}>
                      <span>&#x25AA;</span> {t}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Arrow */}
            <div className="hidden md:flex flex-col items-center justify-center px-6 gap-3">
              <div className="w-px flex-1" style={{ background: 'repeating-linear-gradient(to bottom, #F9731650 0, #F9731650 6px, transparent 6px, transparent 12px)' }} />
              <div className="w-11 h-11 rounded-full border-2 flex items-center justify-center font-black"
                style={{ background: 'var(--bg)', borderColor: '#F97316', color: '#F97316', fontSize: '16px' }}>→</div>
              <div className="font-mono font-bold text-center px-2 py-1 rounded"
                style={{ fontSize: '8px', color: '#F97316', background: '#F9731610', border: '1px solid #F9731630' }}>
                2025<br/>REBRAND
              </div>
              <div className="w-px flex-1" style={{ background: 'repeating-linear-gradient(to bottom, #F9731650 0, #F9731650 6px, transparent 6px, transparent 12px)' }} />
            </div>
            <div className="md:hidden flex items-center justify-center py-4 gap-3 px-6">
              <div className="flex-1 h-px" style={{ background: '#F9731630' }} />
              <div className="w-9 h-9 rounded-full border-2 flex items-center justify-center font-black"
                style={{ background: 'var(--bg)', borderColor: '#F97316', color: '#F97316', fontSize: '14px' }}>↓</div>
              <div className="flex-1 h-px" style={{ background: '#F9731630' }} />
            </div>

            {/* After */}
            <div className="p-6 md:p-8 space-y-4 border-t md:border-t-0 md:border-l"
              style={{ borderColor: 'rgba(249,115,24,0.15)' }}>
              <p className="font-mono font-bold uppercase tracking-widest" style={{ fontSize: '9px', color: '#AD5CFF' }}>AFTER — 2026 ONWARDS</p>
              <div className="rounded-xl border p-5 space-y-3"
                style={{ background: dark ? '#0D1117' : '#FAF5FF', borderColor: '#AD5CFF30' }}>
                <img src="/SBGLOGO.png" alt="AWS Student Builder Group"
                  className="h-12 w-auto object-contain" />
                <h3 className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>AWS Student Builder Group</h3>
                <p className="font-sans font-light" style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  An official AWS-affiliated chapter with global programme access, AWS credits, and a certified builder network.
                </p>
                <div className="space-y-1.5">
                  {['Global AWS builder network', 'Production event cycles', 'AWS credits & resources', 'Official AWS programme'].map(t => (
                    <div key={t} className="flex items-center gap-2 font-mono" style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                      <span style={{ color: '#AD5CFF' }}>✓</span> {t}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── SECTION 2: Leadership Handover ── */}
        <div className="rounded-2xl border overflow-hidden"
          style={{ borderColor: 'rgba(173,92,255,0.3)', background: dark ? 'rgba(173,92,255,0.03)' : 'rgba(173,92,255,0.02)' }}>

          {/* Header bar */}
          <div className="flex items-center gap-3 px-6 py-3 border-b flex-wrap"
            style={{ borderColor: 'rgba(173,92,255,0.15)', background: 'rgba(173,92,255,0.06)' }}>
            <span className="font-mono font-bold uppercase tracking-widest px-2.5 py-1 rounded border"
              style={{ fontSize: '9px', color: '#AD5CFF', borderColor: '#AD5CFF40', background: '#AD5CFF10' }}>
              LEADERSHIP HANDOVER
            </span>
            <span className="font-mono" style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
              2026 — Captain to Chapter Lead
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr]">

            {/* Rishabh */}
            <div className="p-6 md:p-8 flex flex-col gap-4">
              <p className="font-mono font-bold uppercase tracking-widest" style={{ fontSize: '9px', color: '#F97316' }}>
                CAPTAIN — 2022 TO 2025
              </p>
              <RebrandPhoto photo="/about-us/rishabh-tanwar.png" initial="RT"
                gradient="linear-gradient(135deg, #F97316, #F59E0B)" dark={dark} />
              <div>
                <h3 className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>Rishabh Tanwar</h3>
                <p className="font-mono" style={{ fontSize: '10px', color: 'var(--text-subtle)' }}>AWS Cloud Club • 2022–2025</p>
                <p className="font-sans font-light leading-relaxed mt-2"
                  style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  Founded and led the AWS Cloud Club through its most formative years — building the workshops, culture,
                  and community that made the rebrand to AWS SBG possible.
                </p>
              </div>
              <div className="space-y-1.5">
                {['Club founded &amp; structured', 'First workshops launched', '1000+ members reached', 'Oversaw 2025 rebrand'].map(item => (
                  <div key={item} className="flex items-center gap-2 font-mono" style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                    <span style={{ color: '#F97316' }}>✓</span> <span dangerouslySetInnerHTML={{ __html: item }} />
                  </div>
                ))}
              </div>
            </div>

            {/* Arrow */}
            <div className="hidden md:flex flex-col items-center justify-center px-6 gap-3">
              <div className="w-px flex-1" style={{ background: 'repeating-linear-gradient(to bottom, #AD5CFF50 0, #AD5CFF50 6px, transparent 6px, transparent 12px)' }} />
              <div className="w-11 h-11 rounded-full border-2 flex items-center justify-center font-black"
                style={{ background: 'var(--bg)', borderColor: '#AD5CFF', color: '#AD5CFF', fontSize: '16px' }}>→</div>
              <div className="font-mono font-bold text-center px-2 py-1 rounded"
                style={{ fontSize: '8px', color: '#AD5CFF', background: '#AD5CFF10', border: '1px solid #AD5CFF30' }}>
                2026<br/>HANDOVER
              </div>
              <div className="w-px flex-1" style={{ background: 'repeating-linear-gradient(to bottom, #AD5CFF50 0, #AD5CFF50 6px, transparent 6px, transparent 12px)' }} />
            </div>
            <div className="md:hidden flex items-center justify-center py-4 gap-3 px-6">
              <div className="flex-1 h-px" style={{ background: '#AD5CFF30' }} />
              <div className="w-9 h-9 rounded-full border-2 flex items-center justify-center font-black"
                style={{ background: 'var(--bg)', borderColor: '#AD5CFF', color: '#AD5CFF', fontSize: '14px' }}>↓</div>
              <div className="flex-1 h-px" style={{ background: '#AD5CFF30' }} />
            </div>

            {/* Manish */}
            <div className="p-6 md:p-8 flex flex-col gap-4 border-t md:border-t-0 md:border-l"
              style={{ borderColor: 'rgba(173,92,255,0.15)' }}>
              <p className="font-mono font-bold uppercase tracking-widest" style={{ fontSize: '9px', color: '#AD5CFF' }}>
                CHAPTER LEAD — 2026 ONWARDS
              </p>
              <RebrandPhoto photo="/about-us/manish-kudtarkar.png" initial="MK"
                gradient="linear-gradient(135deg, #AD5CFF, #F97316)" dark={dark} />
              <div>
                <h3 className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>Manish Kudtarkar</h3>
                <p className="font-mono" style={{ fontSize: '10px', color: 'var(--text-subtle)' }}>AWS Student Builder Group • 2026–Present</p>
                <p className="font-sans font-light leading-relaxed mt-2"
                  style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  Leading AWS SBG PU into its next era — scaling the community to 3000+ members,
                  running production-grade cloud events, and driving CLF-C02 certification readiness.
                </p>
              </div>
              <div className="space-y-1.5">
                {['AWS SBG chapter launch', 'Cloud Ignite \'26 event', 'CLF-C02 readiness drive', '3000+ active builders'].map(item => (
                  <div key={item} className="flex items-center gap-2 font-mono" style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                    <span style={{ color: '#AD5CFF' }}>✓</span> {item}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Stats bar */}
          <div className="border-t px-6 py-4 grid grid-cols-2 md:grid-cols-4 gap-4 font-mono"
            style={{ borderColor: 'rgba(173,92,255,0.15)', background: 'rgba(173,92,255,0.04)' }}>
            {[
              { label: 'Founded', value: '2022' },
              { label: 'Total Members', value: '3000+' },
              { label: 'Events Hosted', value: '12+' },
              { label: 'Certified Builders', value: 'Growing' },
            ].map(({ label, value }) => (
              <div key={label} className="text-center">
                <p className="font-black" style={{ fontSize: '18px', color: '#AD5CFF' }}>{value}</p>
                <p className="font-bold uppercase tracking-widest" style={{ fontSize: '8px', color: 'var(--text-subtle)' }}>{label}</p>
              </div>
            ))}
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
