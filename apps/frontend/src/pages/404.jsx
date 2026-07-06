import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Home, Users, Calendar, Mail } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const quickLinks = [
  { icon: Home,     label: 'Home',    href: '/'        },
  { icon: Users,    label: 'Team',    href: '/team'    },
  { icon: Calendar, label: 'Events',  href: '/events'  },
  { icon: Mail,     label: 'Contact', href: '/contact' },
];

const LINES = [
  '> SYSTEM BOOT :: AWS_SBG_PU_NODE',
  '> Resolving route...',
  '> ERROR 404 :: PAGE_NOT_FOUND',
  '> The requested path does not exist in this deployment.',
  '> Suggest navigating back to a valid route.',
];

export default function NotFoundPage() {
  const { dark } = useTheme();
  const [visibleLines, setVisibleLines] = useState([]);

  useEffect(() => {
    LINES.forEach((line, i) => {
      setTimeout(() => {
        setVisibleLines(prev => [...prev, line]);
      }, i * 350);
    });
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-20 relative"
      style={{ background: 'var(--bg)' }}>

      {/* Grid background */}
      <div className="site-grid-pattern absolute inset-0 pointer-events-none opacity-60" />

      {/* Ambient orb */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(173,92,255,0.07) 0%, transparent 70%)', filter: 'blur(60px)' }} />

      <div className="relative z-10 w-full max-w-xl space-y-8 text-center">

        {/* 404 heading */}
        <div className="space-y-2">
          <p className="font-mono font-bold uppercase tracking-widest"
            style={{ fontSize: '10px', color: '#F97316' }}>
            ERROR :: ROUTE_NOT_FOUND
          </p>
          <h1 className="font-black uppercase leading-none"
            style={{ fontSize: 'clamp(5rem, 20vw, 9rem)', color: 'var(--text-primary)', letterSpacing: '-0.04em' }}>
            4<span style={{ color: '#AD5CFF' }}>0</span>4
          </h1>
          <p className="font-sans font-light" style={{ fontSize: '15px', color: 'var(--text-muted)' }}>
            This page doesn't exist or has been moved.
          </p>
        </div>

        {/* Terminal log */}
        <div className="rounded-xl border text-left font-mono overflow-hidden"
          style={{ background: dark ? '#070A13' : 'var(--surface-low)', borderColor: 'var(--border-muted)' }}>

          {/* Title bar */}
          <div className="flex items-center gap-2 px-4 py-2 border-b"
            style={{ background: 'var(--surface-low)', borderColor: 'var(--border-muted)' }}>
            <div className="flex gap-1.5">
              {['#FF5F57','#FEBC2E','#28C840'].map(c => (
                <span key={c} className="w-3 h-3 rounded-full inline-block" style={{ background: c }} />
              ))}
            </div>
            <span className="font-bold uppercase ml-2" style={{ fontSize: '9px', color: 'var(--text-subtle)' }}>
              aws-sbg-pu — 404 — bash
            </span>
          </div>

          {/* Log lines */}
          <div className="p-4 space-y-1 min-h-32">
            {visibleLines.map((line, i) => (
              <p key={i} style={{
                fontSize: '11px',
                margin: 0,
                color: line.includes('ERROR') ? '#EF4444'
                  : line.startsWith('> SYSTEM') ? '#06B6D4'
                  : line.startsWith('> Suggest') ? '#AD5CFF'
                  : 'var(--text-muted)',
              }}>
                {line}
              </p>
            ))}
            {/* Blinking cursor */}
            {visibleLines.length < LINES.length ? null : (
              <p style={{ fontSize: '11px', margin: 0, color: '#AD5CFF' }}>
                $ <span className="animate-pulse">_</span>
              </p>
            )}
          </div>
        </div>

        {/* Quick nav */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {quickLinks.map(({ icon: Icon, label, href }) => (
            <Link key={href} to={href}
              className="flex flex-col items-center gap-2 py-4 rounded-xl border font-mono font-bold uppercase no-underline transition-all"
              style={{ fontSize: '9px', letterSpacing: '0.08em', background: 'var(--card-bg)', borderColor: 'var(--border-muted)', color: 'var(--text-muted)' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#AD5CFF'; e.currentTarget.style.color = '#AD5CFF'; e.currentTarget.style.background = 'rgba(173,92,255,0.05)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-muted)'; e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'var(--card-bg)'; }}>
              <Icon size={16} />
              {label}
            </Link>
          ))}
        </div>

        {/* Back link */}
        <button onClick={() => window.history.back()}
          className="inline-flex items-center gap-2 font-mono font-bold uppercase transition-colors"
          style={{ fontSize: '10px', color: 'var(--text-subtle)', background: 'none', border: 'none', cursor: 'pointer' }}
          onMouseEnter={e => e.currentTarget.style.color = '#AD5CFF'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-subtle)'}>
          <ArrowLeft size={12} /> Go Back
        </button>
      </div>
    </div>
  );
}
