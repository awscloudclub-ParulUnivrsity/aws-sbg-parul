import React, { useState } from 'react';
import { ArrowUpRight, Menu, X, Sun, Moon } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const navLinks = [
  { label: 'Home',    href: '/',        internal: true  },
  { label: 'About',   href: '/about',   internal: true  },
  { label: 'Events',  href: '/events',  internal: true  },
  { label: 'Team',    href: '/team',    internal: true  },
  { label: 'Contact', href: '/contact', internal: true  },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { dark, toggle } = useTheme();
  const location = useLocation();

  const t = dark
    ? { nav: 'rgba(7,10,19,0.88)', border: '#1E293B', text: '#94A3B8', mob: '#070A13' }
    : { nav: 'rgba(241,245,249,0.92)', border: '#CBD5E1', text: '#475569', mob: '#F8FAFC' };

  const isActive = (href) => location.pathname === href;

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
              style={{ fontSize: '8px' }}>
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
              onMouseEnter={e => { e.currentTarget.style.background = dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = ''; e.currentTarget.style.color = isActive(href) ? '#AD5CFF' : t.text; }}>
              {label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button onClick={toggle}
            className="w-8 h-8 rounded-md border flex items-center justify-center transition-all"
            style={{ background: 'transparent', borderColor: t.border, color: t.text }}
            onMouseEnter={e => e.currentTarget.style.borderColor = '#AD5CFF'}
            onMouseLeave={e => e.currentTarget.style.borderColor = t.border}
            aria-label="Toggle theme">
            {dark ? <Sun size={14} /> : <Moon size={14} />}
          </button>

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
