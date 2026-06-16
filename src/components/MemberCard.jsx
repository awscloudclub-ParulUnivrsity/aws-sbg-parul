import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export function MemberCard({ dev }) {
  const { dark } = useTheme();
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <div
      className="rounded-xl border overflow-hidden flex flex-col transition-all duration-300"
      style={{ background: 'var(--card-bg)', borderColor: 'var(--border-muted)' }}
      onMouseEnter={e => e.currentTarget.style.borderColor = dev.color + '60'}
      onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-muted)'}
    >
      {/* Gradient top strip */}
      <div className="h-1 w-full" style={{ background: dev.gradient }} />

      {/* Photo / avatar */}
      <div className="relative overflow-hidden flex items-center justify-center"
        style={{ height: '200px', background: dark ? '#0D1117' : '#F1F5F9' }}>

        {!imgFailed ? (
          <img
            src={dev.photo}
            alt={dev.name}
            className="w-full h-full object-cover object-top"
            onError={() => setImgFailed(true)}
          />
        ) : (
          <div className="w-24 h-24 rounded-2xl flex items-center justify-center font-black text-white text-3xl"
            style={{ background: dev.gradient }}>
            {dev.initial}
          </div>
        )}

        {/* Bottom fade into card bg */}
        <div className="absolute bottom-0 left-0 right-0 h-10 pointer-events-none"
          style={{ background: `linear-gradient(to top, var(--card-bg), transparent)` }} />
      </div>

      {/* Info */}
      <div className="px-4 pt-3 pb-4 flex flex-col gap-3 flex-1">
        <div>
          <p className="font-mono font-bold uppercase tracking-widest mb-0.5"
            style={{ fontSize: '8px', color: dev.color }}>
            {dev.role}
          </p>
          <h3 className="font-bold" style={{ fontSize: '15px', color: 'var(--text-primary)' }}>
            {dev.name}
          </h3>
          <p className="font-sans truncate mt-0.5" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            {dev.title}
          </p>
        </div>

        {/* Skills */}
        <div className="flex flex-wrap gap-1.5">
          {dev.skills.slice(0, 3).map(s => (
            <span key={s} className="px-2 py-0.5 rounded border font-mono"
              style={{ fontSize: '9px', background: dev.color + '10', borderColor: dev.color + '25', color: dev.color }}>
              {s}
            </span>
          ))}
          {dev.skills.length > 3 && (
            <span className="px-2 py-0.5 rounded border font-mono"
              style={{ fontSize: '9px', background: 'var(--surface-mid)', borderColor: 'var(--border-muted)', color: 'var(--text-subtle)' }}>
              +{dev.skills.length - 3}
            </span>
          )}
        </div>

        {/* CTA */}
        <Link to={`/team/${dev.slug}`}
          className="mt-auto flex items-center justify-between px-3 py-2 rounded-md border font-mono font-bold uppercase no-underline transition-all"
          style={{ fontSize: '9px', letterSpacing: '0.08em', color: dev.color, borderColor: dev.color + '30', background: dev.color + '08' }}
          onMouseEnter={e => { e.currentTarget.style.background = dev.color; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = dev.color; }}
          onMouseLeave={e => { e.currentTarget.style.background = dev.color + '08'; e.currentTarget.style.color = dev.color; e.currentTarget.style.borderColor = dev.color + '30'; }}>
          View Full Profile <ArrowUpRight size={11} />
        </Link>
      </div>
    </div>
  );
}
