import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';
import { DEPT_COLORS } from '../../components/dashboard/DashboardLayout';
import { Users, Calendar, Award, CheckCircle, Clock, ArrowUpRight, Activity } from 'lucide-react';

function StatCard({ label, value, icon: Icon, color, to }) {
  const inner = (
    <div className="rounded-xl border p-5 flex items-center gap-4 transition-all cursor-pointer"
      style={{ background: 'var(--card-bg)', borderColor: 'var(--border-muted)' }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = color + '60'; e.currentTarget.style.background = color + '08'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-muted)'; e.currentTarget.style.background = 'var(--card-bg)'; }}>
      <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: color + '18' }}>
        <Icon size={20} style={{ color }} />
      </div>
      <div>
        <p className="font-mono font-black text-2xl" style={{ color }}>{value ?? '—'}</p>
        <p className="font-mono font-bold uppercase" style={{ fontSize: '9px', color: 'var(--text-subtle)', letterSpacing: '0.08em' }}>{label}</p>
      </div>
    </div>
  );
  return to ? <Link to={to} className="no-underline block">{inner}</Link> : inner;
}

export default function DashboardOverview() {
  const { profile } = useAuth();
  const role  = profile?.role || 'member';
  const color = DEPT_COLORS[role] || '#AD5CFF';
  const isLeader = role === 'leader';

  const [stats, setStats]    = useState({ members: 0, events: 0, certs: 0, approved: 0, pending: 0, upcoming: 0, pendingMembers: 0 });
  const [recent, setRecent]  = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const queries = [
          api.getProfiles().catch(() => []),
          api.getEvents().catch(() => []),
          api.getCertifications().catch(() => []),
        ];
        const [profiles, events, certs] = await Promise.all(queries);

        setStats({
          members: profiles.length,
          events: events.length,
          certs: certs.length,
          approved: profiles.filter(p => p.approved).length,
          pending: certs.filter(c => c.status === 'pending').length,
          upcoming: events.filter(e => e.status === 'upcoming').length,
          pendingMembers: profiles.filter(p => !p.approved).length,
        });

        if (['leader', 'operations', 'social_media', 'promotions'].includes(role)) {
          const sorted = [...certs].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
          setRecent(sorted.slice(0, 6));
        }
      } catch (err) {
        console.error('Error loading dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [role]);

  const STATUS_COLOR = { pending: '#F97316', approved: '#22C55E', posted: '#AD5CFF' };

  return (
    <div className="space-y-6">

      {/* Welcome banner */}
      <div className="rounded-2xl border p-6 relative overflow-hidden"
        style={{ background: 'var(--card-bg)', borderColor: color + '40' }}>
        <div className="absolute top-0 right-0 w-64 h-64 pointer-events-none"
          style={{ background: `radial-gradient(circle, ${color}12 0%, transparent 70%)`, filter: 'blur(30px)' }} />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="font-mono font-bold uppercase tracking-widest mb-1" style={{ fontSize: '9px', color }}>
              WELCOME BACK
            </p>
            <h1 className="font-extrabold text-2xl" style={{ color: 'var(--text-primary)' }}>
              {profile?.name || 'Builder'} 👋
            </h1>
            <p className="font-sans font-light mt-1" style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              Logged in as <strong style={{ color }}>{role.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</strong> · AWS SBG Parul University
            </p>
          </div>
          {isLeader && stats.pendingMembers > 0 && (
            <Link to="/dashboard/members"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg font-mono font-bold uppercase text-white no-underline flex-shrink-0 transition-all"
              style={{ fontSize: '10px', background: '#F97316', boxShadow: '0 0 16px rgba(249,115,24,0.3)' }}
              onMouseEnter={e => e.currentTarget.style.background = '#EA6A00'}
              onMouseLeave={e => e.currentTarget.style.background = '#F97316'}>
              <Clock size={13} /> {stats.pendingMembers} Pending Approval
            </Link>
          )}
        </div>
      </div>

      {/* Stats — Leader / Operations */}
      {['leader', 'operations'].includes(role) && !loading && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total Members"    value={stats.members}       icon={Users}       color="#AD5CFF" to="/dashboard/members" />
          <StatCard label="Approved Members" value={stats.approved}      icon={CheckCircle} color="#22C55E" to="/dashboard/members" />
          <StatCard label="Total Events"     value={stats.events}        icon={Calendar}    color="#06B6D4" to="/dashboard/events" />
          <StatCard label="Certifications"   value={stats.certs}         icon={Award}       color="#F97316" to="/dashboard/certifications" />
        </div>
      )}

      {/* Stats — Social / Promotions */}
      {['social_media', 'promotions'].includes(role) && !loading && (
        <div className="grid grid-cols-2 gap-4">
          <StatCard label="Total Submissions" value={stats.certs}   icon={Award}       color="#F97316" to="/dashboard/certifications" />
          <StatCard label="Pending Review"    value={stats.pending} icon={Clock}       color="#AD5CFF" to="/dashboard/certifications" />
        </div>
      )}

      {/* Stats — Technical */}
      {role === 'technical' && !loading && (
        <div className="grid grid-cols-2 gap-4">
          <StatCard label="Total Events"    value={stats.events}   icon={Calendar} color="#06B6D4" to="/dashboard/events" />
          <StatCard label="Upcoming Events" value={stats.upcoming} icon={Activity} color="#F97316" to="/dashboard/events" />
        </div>
      )}

      {/* Member profile */}
      {role === 'member' && (
        <div className="rounded-xl border p-5 space-y-3" style={{ background: 'var(--card-bg)', borderColor: 'var(--border-muted)' }}>
          <h2 className="font-mono font-bold uppercase" style={{ fontSize: '11px', color: 'var(--text-primary)' }}>Your Profile</h2>
          {[
            { label: 'Name',       value: profile?.name },
            { label: 'Email',      value: profile?.email },
            { label: 'Department', value: profile?.department || '—' },
            { label: 'Status',     value: profile?.approved ? '✓ Approved' : '⏳ Pending Approval' },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between py-2 border-b"
              style={{ borderColor: 'var(--border-muted)' }}>
              <span className="font-mono font-bold uppercase" style={{ fontSize: '9px', color: 'var(--text-subtle)' }}>{label}</span>
              <span className="font-sans" style={{ fontSize: '12px', color: 'var(--text-primary)' }}>{value}</span>
            </div>
          ))}
          <div className="flex gap-3 pt-2">
            <Link to="/dashboard/badge"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md font-mono font-bold uppercase text-white no-underline transition-all"
              style={{ fontSize: '10px', background: '#AD5CFF' }}
              onMouseEnter={e => e.currentTarget.style.background = '#9C47FF'}
              onMouseLeave={e => e.currentTarget.style.background = '#AD5CFF'}>
              <Award size={12} /> My Badge
            </Link>
            <Link to="/dashboard/settings"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md font-mono font-bold uppercase no-underline transition-all"
              style={{ fontSize: '10px', background: 'var(--surface-low)', border: '1px solid var(--border-muted)', color: 'var(--text-primary)' }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-mid)'}
              onMouseLeave={e => e.currentTarget.style.background = 'var(--surface-low)'}>
              Edit Profile
            </Link>
          </div>
        </div>
      )}

      {/* Quick Actions — Leader */}
      {isLeader && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: 'Manage Members',   href: '/dashboard/members',        color: '#AD5CFF', desc: 'Approve, assign roles' },
            { label: 'Manage Events',    href: '/dashboard/events',          color: '#06B6D4', desc: 'Add, edit, delete events' },
            { label: 'Review Certs',     href: '/dashboard/certifications',  color: '#F97316', desc: 'Approve & generate posts' },
            { label: 'Core Team',        href: '/dashboard/team',            color: '#22C55E', desc: 'Add team members' },
          ].map(({ label, href, color: c, desc }) => (
            <Link key={label} to={href}
              className="rounded-xl border p-4 no-underline transition-all flex flex-col gap-1"
              style={{ background: 'var(--card-bg)', borderColor: 'var(--border-muted)' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = c + '60'; e.currentTarget.style.background = c + '08'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-muted)'; e.currentTarget.style.background = 'var(--card-bg)'; }}>
              <div className="flex items-center justify-between">
                <p className="font-mono font-bold uppercase" style={{ fontSize: '10px', color: c }}>{label}</p>
                <ArrowUpRight size={12} style={{ color: c }} />
              </div>
              <p className="font-sans font-light" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{desc}</p>
            </Link>
          ))}
        </div>
      )}

      {/* Recent Certifications */}
      {recent.length > 0 && (
        <div className="rounded-xl border overflow-hidden" style={{ background: 'var(--card-bg)', borderColor: 'var(--border-muted)' }}>
          <div className="flex items-center justify-between px-5 py-3 border-b" style={{ borderColor: 'var(--border-muted)', background: 'var(--surface-low)' }}>
            <h2 className="font-mono font-bold uppercase" style={{ fontSize: '11px', color: 'var(--text-primary)' }}>Recent Certifications</h2>
            <Link to="/dashboard/certifications"
              className="font-mono font-bold uppercase no-underline transition-colors flex items-center gap-1"
              style={{ fontSize: '9px', color: '#AD5CFF' }}>
              View All <ArrowUpRight size={10} />
            </Link>
          </div>
          <div className="divide-y" style={{ borderColor: 'var(--border-muted)' }}>
            {recent.map((c, i) => (
              <div key={i} className="flex items-center justify-between px-5 py-3"
                onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-mid)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <div>
                  <p className="font-sans font-medium" style={{ fontSize: '12px', color: 'var(--text-primary)' }}>{c.name}</p>
                  <p className="font-mono" style={{ fontSize: '9px', color: 'var(--text-muted)' }}>{c.certificate_title} · {c.department}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold uppercase px-2 py-0.5 rounded"
                    style={{ fontSize: '8px', background: STATUS_COLOR[c.status] + '15', color: STATUS_COLOR[c.status] }}>
                    {c.status}
                  </span>
                  <span className="font-mono" style={{ fontSize: '9px', color: 'var(--text-subtle)' }}>
                    {new Date(c.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="rounded-xl border p-5 space-y-2" style={{ background: 'var(--card-bg)', borderColor: 'var(--border-muted)' }}>
        <h2 className="font-mono font-bold uppercase mb-3" style={{ fontSize: '11px', color: 'var(--text-primary)' }}>Quick Tips</h2>
        {role === 'member' && ['📌 Keep your profile updated in Settings', '🎯 Attend workshops to learn AWS', '🏅 Get AWS certified and submit via Certify page'].map((t, i) => (
          <p key={i} className="font-sans" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{t}</p>
        ))}
        {['leader', 'operations'].includes(role) && ['✅ Review pending member approvals in Members', '📅 Add upcoming events in Events panel', '🎓 Approve certification submissions'].map((t, i) => (
          <p key={i} className="font-sans" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{t}</p>
        ))}
        {role === 'technical' && ['🛠️ Create hands-on workshops in Events', '📚 Add descriptions with learning objectives', '💡 Mark completed events as Past'].map((t, i) => (
          <p key={i} className="font-sans" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{t}</p>
        ))}
        {['social_media', 'promotions'].includes(role) && ['📱 Review pending certifications', '🎨 Edit & copy the generated social media post', '🌟 Mark posts as Posted after publishing'].map((t, i) => (
          <p key={i} className="font-sans" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{t}</p>
        ))}
      </div>
    </div>
  );
}
