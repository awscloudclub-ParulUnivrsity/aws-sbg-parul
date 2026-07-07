import React from 'react';
import { Mail, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const pageLinks = [
  { label: 'About Us',             href: '/about'    },
  { label: 'Events',               href: '/events'   },
  { label: 'Our Team',             href: '/team'     },
  { label: 'Submit Certification', href: '/certify'  },
  { label: 'Contact',              href: '/contact'  },
  { label: 'AWS Student Programs', href: 'https://aws.amazon.com/developer/community/students/' },
];

const socials = [
  {
    label: 'Meetup',
    href: 'https://www.meetup.com/aws-sbg-at-parul-university/',
    icon: () => (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.24 12.58a3.74 3.74 0 0 0-.72-2.35 3.76 3.76 0 0 0-1.98-1.3 4.07 4.07 0 0 0 .09-.87 4.14 4.14 0 0 0-4.14-4.14 4.14 4.14 0 0 0-3.82 2.56 2.76 2.76 0 0 0-.44-.04 2.77 2.77 0 0 0-2.72 2.24 3.3 3.3 0 0 0-.54-.05 3.32 3.32 0 0 0-3.32 3.32 3.32 3.32 0 0 0 3.32 3.32h12.18a2.6 2.6 0 0 0 2.6-2.6 2.6 2.6 0 0 0-1.5-2.09z"/>
      </svg>
    ),
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/aws.sbg_pu/',
    icon: () => (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
        <circle cx="12" cy="12" r="4"/>
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/company/aws-student-builder-group-parul-university/',
    icon: () => (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"/>
        <rect x="2" y="9" width="4" height="12"/>
        <circle cx="4" cy="4" r="2"/>
      </svg>
    ),
  },
];

export function Footer() {
  return (
    <footer className="font-mono border-t" style={{ background: 'var(--surface-low)', borderColor: 'var(--border-muted)' }}>

      {/* ── Quote banner ── */}
      <div className="relative overflow-hidden border-b" style={{ borderColor: 'var(--border-muted)' }}>
        {/* Subtle grid */}
        <div className="site-grid-pattern absolute inset-0 pointer-events-none opacity-40" />
        {/* Glow */}
        <div className="absolute left-1/2 top-0 -translate-x-1/2 w-96 h-32 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, rgba(173,92,255,0.08) 0%, transparent 70%)', filter: 'blur(20px)' }} />

        <div className="relative z-10 max-w-4xl mx-auto px-6 py-10 text-center space-y-3">
          {/* Opening quote mark */}
          <div className="font-mono font-black leading-none select-none"
            style={{ fontSize: '4rem', color: '#AD5CFF', opacity: 0.25, lineHeight: 1, marginBottom: '-8px' }}>
            "
          </div>
          <blockquote className="font-sans font-light leading-relaxed"
            style={{ fontSize: 'clamp(14px, 2vw, 18px)', color: 'var(--text-primary)', fontStyle: 'italic', maxWidth: '640px', margin: '0 auto' }}>
            The best way to predict the future is to build it —
            and we're building it on the cloud.
          </blockquote>
          <p className="font-mono font-bold uppercase tracking-widest"
            style={{ fontSize: '9px', color: '#AD5CFF' }}>
            — AWS Student Builder Group, Parul University
          </p>
        </div>
      </div>

      {/* ── Main grid ── */}
      <div className="max-w-6xl mx-auto px-6 pt-12 pb-10 grid grid-cols-1 md:grid-cols-3 gap-10 border-b"
        style={{ borderColor: 'var(--border-muted)' }}>

        {/* Brand + socials */}
        <div className="space-y-4 text-left">
          <img src="/SBGLOGO.png" alt="AWS SBG Logo" className="h-8 w-auto object-contain" />
          <span className="font-extrabold tracking-tight block uppercase text-sm"
            style={{ color: 'var(--text-primary)' }}>
            AWS SBG @ PARUL UNIVERSITY
          </span>
          <p className="font-sans font-light leading-relaxed"
            style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            Parul University's official AWS Student Builder Group — empowering students
            to build production-level cloud solutions in Vadodara and beyond.
          </p>

          {/* Social icons */}
          <div className="flex items-center gap-2 pt-1">
            {socials.map(({ label, href, icon: Icon }) => (
              <a key={label} href={href} target="_blank" rel="noreferrer"
                aria-label={label}
                className="w-8 h-8 rounded-md border flex items-center justify-center no-underline transition-all"
                style={{ borderColor: 'var(--border-muted)', color: 'var(--text-muted)', background: 'transparent' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#AD5CFF'; e.currentTarget.style.color = '#AD5CFF'; e.currentTarget.style.background = 'rgba(173,92,255,0.08)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-muted)'; e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'transparent'; }}>
                <Icon />
              </a>
            ))}
          </div>
        </div>

        {/* Pages */}
        <div className="text-left md:pl-8">
          <h3 className="font-bold uppercase tracking-widest mb-4 flex items-center gap-2"
            style={{ fontSize: '10px', color: 'var(--text-primary)' }}>
            <span className="w-2 h-2 rounded-full inline-block" style={{ background: '#AD5CFF' }} />
            PAGES
          </h3>
          <ul className="space-y-2 font-sans font-light" style={{ fontSize: '11px' }}>
            {pageLinks.map(({ label, href }) => (
              <li key={label}>
                {href.startsWith('http') ? (
                  <a href={href} target="_blank" rel="noreferrer"
                    className="no-underline transition-colors"
                    style={{ color: 'var(--text-muted)' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#AD5CFF'}
                    onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>
                    ▪ {label}
                  </a>
                ) : (
                  <Link to={href} className="no-underline transition-colors"
                    style={{ color: 'var(--text-muted)' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#AD5CFF'}
                    onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>
                    ▪ {label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div className="text-left">
          <h3 className="font-bold uppercase tracking-widest mb-4 flex items-center gap-2"
            style={{ fontSize: '10px', color: 'var(--text-primary)' }}>
            <span className="w-2 h-2 rounded-full inline-block" style={{ background: '#F97316' }} />
            CONTACT
          </h3>
          <ul className="space-y-4" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            <li className="flex gap-3 items-start">
              <Mail size={15} className="shrink-0 mt-0.5" style={{ color: '#AD5CFF' }} />
              <div>
                <p className="uppercase tracking-widest mb-0.5"
                  style={{ fontSize: '9px', color: 'var(--text-subtle)' }}>Email</p>
                <a href="mailto:awscloudclub@paruluniversity.ac.in"
                  className="font-sans no-underline transition-colors"
                  style={{ color: 'var(--text-muted)' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#AD5CFF'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>
                  awscloudclub@paruluniversity.ac.in
                </a>
              </div>
            </li>
            <li className="flex gap-3 items-start">
              <MapPin size={15} className="shrink-0 mt-0.5" style={{ color: '#F97316' }} />
              <div>
                <p className="uppercase tracking-widest mb-0.5"
                  style={{ fontSize: '9px', color: 'var(--text-subtle)' }}>Location</p>
                <span className="font-sans font-light leading-relaxed">
                  Parul University, L103, C.V. Raman Building, Vadodara, Gujarat, India.
                </span>
              </div>
            </li>
          </ul>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="max-w-6xl mx-auto px-6 pt-5 pb-6 flex flex-col md:flex-row justify-between items-center gap-3">
        <span style={{ fontSize: '10px', color: 'var(--text-subtle)' }}>
          © 2026 AWS Student Builder Group • Parul University Chapter
        </span>

        {/* Social labels row on mobile / inline on desktop */}
        <div className="flex items-center gap-3">
          {socials.map(({ label, href }) => (
            <a key={label} href={href} target="_blank" rel="noreferrer"
              className="no-underline transition-colors"
              style={{ fontSize: '9px', color: 'var(--text-subtle)', letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 700 }}
              onMouseEnter={e => e.currentTarget.style.color = '#AD5CFF'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-subtle)'}>
              {label}
            </a>
          ))}
        </div>

        <span className="italic" style={{ fontSize: '10px', color: 'var(--text-subtle)' }}>
          Chapter Lead: Manish Kudtarkar
        </span>
      </div>
    </footer>
  );
}
