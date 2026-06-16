import React from 'react';
import { Mail, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const pageLinks = [
  { label: 'About Us',         href: '/about'   },
  { label: 'Events',           href: '/events'  },
  { label: 'Our Team',         href: '/team'    },
  { label: 'Contact',          href: '/contact' },
  { label: 'AWS Student Programs', href: 'https://aws.amazon.com/developer/community/students/' },
];

export function Footer() {
  return (
    <footer className="font-mono border-t pt-12 pb-6"
      style={{ background: 'var(--surface-low)', borderColor: 'var(--border-muted)' }}>
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10 border-b pb-12"
        style={{ borderColor: 'var(--border-muted)' }}>

        {/* Brand */}
        <div className="space-y-3 text-left">
          <img src="/SBGLOGO.png" alt="AWS SBG Logo" className="h-8 w-auto object-contain mb-1" />
          <span className="font-extrabold tracking-tight block uppercase text-sm"
            style={{ color: 'var(--text-primary)' }}>
            AWS SBG @ PARUL UNIVERSITY
          </span>
          <p className="font-sans font-light leading-relaxed"
            style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            Parul University's official AWS Student Builder Group — empowering students
            to build production-level cloud solutions in Vadodara and beyond.
          </p>
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
                <a href="mailto:awssbgpu@gmail.com"
                  className="font-sans no-underline transition-colors"
                  style={{ color: 'var(--text-muted)' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#AD5CFF'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>
                  awssbgpu@gmail.com
                </a>
              </div>
            </li>
            <li className="flex gap-3 items-start">
              <MapPin size={15} className="shrink-0 mt-0.5" style={{ color: '#F97316' }} />
              <div>
                <p className="uppercase tracking-widest mb-0.5"
                  style={{ fontSize: '9px', color: 'var(--text-subtle)' }}>Location</p>
                <span className="font-sans font-light leading-relaxed">
                  Parul University, Vadodara, Gujarat, India.
                </span>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 pt-6 flex flex-col md:flex-row justify-between items-center gap-2"
        style={{ fontSize: '10px', color: 'var(--text-subtle)' }}>
        <span>© 2026 AWS Student Builder Group • Parul University Chapter</span>
        <span className="italic">Chapter Lead: Manish Kudtarkar</span>
      </div>
    </footer>
  );
}
