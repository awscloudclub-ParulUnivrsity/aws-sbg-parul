import React, { useState } from 'react';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const navLinks = [
  { label: 'Home',    href: '/'        },
  { label: 'About',   href: '/about'   },
  { label: 'Events',  href: '/events'  },
  { label: 'Team',    href: '/team'    },
  { label: 'Certify',    href: '/certify'    },
  { label: 'Certified',  href: '/certified'  },
  { label: 'Contact',    href: '/contact'    },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const t = { nav: 'rgba(7,10,19,0.88)', border: '#1E293B', text: '#94A3B8', mob: '#070A13' };

  const isActive = (href) => location.pathname === href || (href !== '/' && location.pathname.startsWith(href));

  return (
    <header className="fixed top-0 left-0 w-full z-50 border-b backdrop-blur-md"
      style={{ background: t.nav, borderColor: t.border }}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center h-14">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 no-underline">
          <img src="/SBGLOGO.png" alt="AWS SBG Logo" className="h-8 w-auto object-contain" />
          <div className="flex flex-col text-left">
            <span className="font-black uppercase tracking-wider leading-tight"
              style={{ fontSize: '11px', color: 'var(--text-primary)' }}>
              AWS Student Builder Group
            </span>
            <span className="font-bold uppercase tracking-widest leading-tight"
              style={{ fontSize: '8px', color: 'var(--text-muted)' }}>
              Parul University
            </span>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1 font-sans text-xs font-medium">
          {navLinks.map(({ label, href }) => (
            <Link key={label} to={href}
              className="py-1.5 px-3 rounded-md transition-all no-underline font-medium"
              style={{ color: isActive(href) ? '#AD5CFF' : t.text }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = ''; e.currentTarget.style.color = isActive(href) ? '#AD5CFF' : t.text; }}>
              {label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Link to="/dashboard"
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-md font-mono font-bold uppercase transition-all no-underline"
            style={{ fontSize: '10px', letterSpacing: '0.08em', color: '#94A3B8', border: '1px solid #1E293B', background: 'transparent' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#AD5CFF'; e.currentTarget.style.color = '#AD5CFF'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#1E293B'; e.currentTarget.style.color = '#94A3B8'; }}>
            Dashboard
          </Link>

          <a href="https://www.meetup.com/aws-sbg-at-parul-university/" target="_blank" rel="noreferrer"
            className="hidden md:flex items-center gap-1.5 px-4 py-2 rounded-md font-mono font-bold uppercase text-white transition-all no-underline"
            style={{ fontSize: '10px', letterSpacing: '0.08em', background: '#AD5CFF', boxShadow: '0 0 20px rgba(173,92,255,0.15)' }}
            onMouseEnter={e => e.currentTarget.style.background = '#9C47FF'}
            onMouseLeave={e => e.currentTarget.style.background = '#AD5CFF'}>
            Join Group <ArrowUpRight size={12} />
          </a>

          <button className="md:hidden p-1" style={{ color: 'var(--text-primary)' }} onClick={() => setOpen(!open)}>
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t px-6 py-4 flex flex-col gap-2 font-sans text-sm"
          style={{ borderColor: t.border, background: t.mob }}>
          {navLinks.map(({ label, href }) => (
            <Link key={label} to={href}
              className="py-2 px-3 rounded-md no-underline transition-all"
              style={{ color: isActive(href) ? '#AD5CFF' : 'var(--text-muted)', background: isActive(href) ? 'rgba(173,92,255,0.06)' : 'transparent' }}
              onClick={() => setOpen(false)}>
              {label}
            </Link>
          ))}
          <Link to="/dashboard"
            className="mt-2 flex items-center justify-center gap-1.5 py-2.5 rounded-md font-mono font-bold uppercase no-underline"
            style={{ fontSize: '10px', color: '#94A3B8', border: '1px solid #1E293B', background: 'transparent' }}
            onClick={() => setOpen(false)}>
            Dashboard
          </Link>
          <a href="https://www.meetup.com/aws-sbg-at-parul-university/" target="_blank" rel="noreferrer"
            className="mt-2 flex items-center justify-center gap-1.5 py-2.5 rounded-md font-mono font-bold uppercase text-white no-underline"
            style={{ fontSize: '10px', background: '#AD5CFF' }}>
            Join Group <ArrowUpRight size={12} />
          </a>
        </div>
      )}
    </header>
  );
}
