import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Zap } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const GithubIcon = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
  </svg>
);

export default function DevProfilePage() {
  const { slug } = useParams();
  const [dev, setDev] = useState(null);
  const [others, setOthers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetchMember();
  }, [slug]);

  const fetchMember = async () => {
    setLoading(true);
    setNotFound(false);

    const { data, error } = await supabase
      .from('team_members')
      .select(`*, profile:profiles(id, name, email, role, department, avatar_url, bio)`)
      .order('created_at', { ascending: true });

    if (error || !data) { setNotFound(true); setLoading(false); return; }

    // match by slug (name lowercased with hyphens)
    const match = data.find(m => {
      const name = m.profile?.name || '';
      return name.toLowerCase().replace(/\s+/g, '-') === slug;
    });

    if (!match) { setNotFound(true); setLoading(false); return; }

    const toDev = (m) => {
      const name = m.profile?.name || 'Team Member';
      return {
        slug: name.toLowerCase().replace(/\s+/g, '-'),
        name,
        initial: name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
        role: m.role_title || m.profile?.role || 'Member',
        title: m.department || m.profile?.department || '',
        photo: m.profile?.avatar_url || null,
        bio: m.profile?.bio || '',
        skills: m.skills ? String(m.skills).split(',').map(s => s.trim()) : [],
        linkedin: m.linkedin || '',
        github: m.github || '',
        gradient: 'linear-gradient(135deg, #AD5CFF, #F97316)',
        color: '#AD5CFF',
      };
    };

    setDev(toDev(match));
    setOthers(data.filter(m => m.id !== match.id).slice(0, 3).map(toDev));
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 pb-16 px-6 flex items-center justify-center" style={{ background: 'var(--bg)' }}>
        <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
          style={{ borderColor: '#AD5CFF', borderTopColor: 'transparent' }} />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen pt-20 pb-16 px-6 flex flex-col items-center justify-center gap-4" style={{ background: 'var(--bg)' }}>
        <p className="font-mono font-bold uppercase" style={{ fontSize: '12px', color: '#EF4444' }}>Profile not found</p>
        <Link to="/team" className="font-mono font-bold uppercase no-underline" style={{ fontSize: '10px', color: '#AD5CFF' }}>
          ← Back to Team
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-16 px-6 relative" style={{ background: 'var(--bg)' }}>
      <div className="relative z-10 max-w-4xl mx-auto space-y-8">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 font-mono pt-6" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
          <Link to="/" className="no-underline transition-colors" style={{ color: 'var(--text-muted)' }}
            onMouseEnter={e => e.currentTarget.style.color = '#AD5CFF'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>
            HOME
          </Link>
          <span>/</span>
          <Link to="/team" className="no-underline transition-colors" style={{ color: 'var(--text-muted)' }}
            onMouseEnter={e => e.currentTarget.style.color = '#AD5CFF'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>
            TEAM
          </Link>
          <span>/</span>
          <span style={{ color: dev.color }}>{dev.name.toUpperCase()}</span>
        </div>

        {/* Profile hero card */}
        <div className="rounded-2xl border overflow-hidden"
          style={{ background: 'var(--card-bg)', borderColor: 'var(--border-muted)' }}>

          <div className="h-24 w-full relative" style={{ background: dev.gradient, opacity: 0.85 }}>
            <div className="site-grid-pattern absolute inset-0 opacity-20" />
          </div>

          <div className="px-6 pb-6">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 -mt-10 mb-6">
              <div className="flex items-end gap-4">
                {dev.photo ? (
                  <img src={dev.photo} alt={dev.name}
                    className="w-20 h-20 rounded-2xl border-4 object-cover flex-shrink-0"
                    style={{ borderColor: 'var(--card-bg)' }}
                    onError={e => { e.target.style.display = 'none'; }} />
                ) : (
                  <div className="w-20 h-20 rounded-2xl border-4 flex items-center justify-center font-black text-white text-3xl flex-shrink-0"
                    style={{ background: dev.gradient, borderColor: 'var(--card-bg)' }}>
                    {dev.initial}
                  </div>
                )}
                <div className="pb-1">
                  <p className="font-mono font-bold uppercase tracking-widest"
                    style={{ fontSize: '9px', color: dev.color }}>
                    {dev.role}
                  </p>
                  <h1 className="font-extrabold text-2xl" style={{ color: 'var(--text-primary)' }}>
                    {dev.name}
                  </h1>
                  {dev.title && (
                    <p className="font-sans" style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      {dev.title}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex gap-2 pb-1">
                {dev.linkedin && (
                  <a href={dev.linkedin} target="_blank" rel="noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border font-mono font-bold uppercase no-underline transition-all"
                    style={{ fontSize: '9px', color: dev.color, borderColor: dev.color + '40', background: dev.color + '08' }}
                    onMouseEnter={e => { e.currentTarget.style.background = dev.color; e.currentTarget.style.color = '#fff'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = dev.color + '08'; e.currentTarget.style.color = dev.color; }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"/>
                      <rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>
                    </svg>
                    LinkedIn ↗
                  </a>
                )}
                {dev.github && (
                  <a href={dev.github} target="_blank" rel="noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border font-mono font-bold uppercase no-underline transition-all"
                    style={{ fontSize: '9px', color: 'var(--text-muted)', borderColor: 'var(--border-muted)', background: 'transparent' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'var(--surface-mid)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)'; }}>
                    <GithubIcon /> GitHub ↗
                  </a>
                )}
              </div>
            </div>

            {dev.bio && (
              <p className="font-sans leading-relaxed"
                style={{ fontSize: '13px', color: 'var(--text-muted)', maxWidth: '640px' }}>
                {dev.bio}
              </p>
            )}
          </div>
        </div>

        {/* Skills */}
        {dev.skills.length > 0 && (
          <div className="rounded-xl border p-6 font-mono"
            style={{ background: 'var(--card-bg)', borderColor: 'var(--border-muted)' }}>
            <h2 className="font-bold uppercase tracking-widest mb-4 flex items-center gap-2"
              style={{ fontSize: '10px', color: 'var(--text-primary)' }}>
              <Zap size={12} style={{ color: dev.color }} /> TECH STACK
            </h2>
            <div className="flex flex-wrap gap-2">
              {dev.skills.map(skill => (
                <span key={skill} className="px-3 py-1.5 rounded-md border font-sans font-medium"
                  style={{ fontSize: '12px', background: dev.color + '10', borderColor: dev.color + '30', color: dev.color }}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Other team members */}
        {others.length > 0 && (
          <div>
            <h2 className="font-mono font-bold uppercase tracking-widest mb-4"
              style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
              OTHER BUILDERS
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {others.map(other => (
                <Link key={other.slug} to={`/team/${other.slug}`}
                  className="rounded-xl border p-4 flex items-center gap-3 no-underline transition-all"
                  style={{ background: 'var(--card-bg)', borderColor: 'var(--border-muted)' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = '#AD5CFF50'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-muted)'}>
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-white text-sm flex-shrink-0"
                    style={{ background: other.gradient }}>
                    {other.initial}
                  </div>
                  <div className="min-w-0">
                    <p className="font-mono font-bold truncate" style={{ fontSize: '12px', color: 'var(--text-primary)' }}>
                      {other.name}
                    </p>
                    <p className="font-sans truncate" style={{ fontSize: '10px', color: '#AD5CFF' }}>
                      {other.role}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        <Link to="/team"
          className="inline-flex items-center gap-2 font-mono font-bold uppercase no-underline transition-colors"
          style={{ fontSize: '10px', color: 'var(--text-muted)' }}
          onMouseEnter={e => e.currentTarget.style.color = '#AD5CFF'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>
          <ArrowLeft size={12} /> Back to All Builders
        </Link>
      </div>
    </div>
  );
}
