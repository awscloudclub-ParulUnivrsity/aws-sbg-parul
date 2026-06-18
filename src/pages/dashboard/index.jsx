import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import { DEPT_COLORS } from '../../components/dashboard/DashboardLayout';
import { Users, Calendar, Award, CheckCircle } from 'lucide-react';

function StatCard({ label, value, icon: Icon, color }) {
  return (
    <div className="rounded-xl border p-5 flex items-center gap-4 transition-all"
      style={{ background: 'var(--card-bg)', borderColor: 'var(--border-muted)' }}
      onMouseEnter={e => e.currentTarget.style.borderColor = color + '50'}
      onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-muted)'}>
      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: color + '15' }}>
        <Icon size={18} style={{ color }} />
      </div>
      <div>
        <p className="font-mono font-black text-2xl" style={{ color }}>{value ?? '—'}</p>
        <p className="font-mono font-bold uppercase" style={{ fontSize: '9px', color: 'var(--text-subtle)', letterSpacing: '0.08em' }}>{label}</p>
      </div>
    </div>
  );
}

export default function DashboardOverview() {
  const { profile } = useAuth();
  const role  = profile?.role || 'member';
  const color = DEPT_COLORS[role] || '#AD5CFF';

  const [stats, setStats] = useState({ members: 0, events: 0, certs: 0, approved: 0, pending: 0, upcoming: 0 });
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    async function load() {
      const [m, e, c, a, p, u] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('events').select('id', { count: 'exact', head: true }),
        supabase.from('certifications').select('id', { count: 'exact', head: true }),
        supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('approved', true),
        supabase.from('certifications').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('events').select('id', { count: 'exact', head: true }).eq('status', 'upcoming'),
      ]);
      setStats({ members: m.count, events: e.count, certs: c.count, approved: a.count, pending: p.count, upcoming: u.count });
      
      // Load recent activity
      if (['leader', 'operations'].includes(role)) {
        const { data: recent } = await supabase
          .from('certifications')
          .select('name, cert_title, created_at')
          .order('created_at', { ascending: false })
          .limit(5);
        setRecentActivity(recent || []);
      }
    }
    load();
  }, [role]);

  return (
    <div className="space-y-6">

      {/* Welcome */}
      <div className="rounded-2xl border p-6 relative overflow-hidden"
        style={{ background: 'var(--card-bg)', borderColor: color + '30' }}>
        <div className="absolute top-0 right-0 w-48 h-48 pointer-events-none"
          style={{ background: `radial-gradient(circle, ${color}10 0%, transparent 70%)`, filter: 'blur(20px)' }} />
        <div className="relative z-10">
          <p className="font-mono font-bold uppercase tracking-widest mb-1" style={{ fontSize: '9px', color }}>
            WELCOME BACK
          </p>
          <h1 className="font-extrabold text-2xl" style={{ color: 'var(--text-primary)' }}>
            {profile?.name || 'Builder'} 👋
          </h1>
          <p className="font-sans font-light mt-1" style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            You're logged in as <strong style={{ color }}>{role.replace('_', ' ')}</strong> — AWS SBG Parul University
          </p>
        </div>
      </div>

      {/* Stats grid — only show relevant stats by role */}
      {['leader', 'operations'].includes(role) && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total Members"    value={stats.members}  icon={Users}       color="#AD5CFF" />
          <StatCard label="Approved Members" value={stats.approved} icon={CheckCircle} color="#22C55E" />
          <StatCard label="Events"           value={stats.events}   icon={Calendar}    color="#06B6D4" />
          <StatCard label="Certifications"   value={stats.certs}    icon={Award}       color="#F97316" />
        </div>
      )}

      {['social_media', 'promotions'].includes(role) && (
        <div className="grid grid-cols-2 gap-4">
          <StatCard label="Certifications"       value={stats.certs}   icon={Award}   color="#F97316" />
          <StatCard label="Pending Review"       value={stats.pending} icon={Award}   color="#AD5CFF" />
        </div>
      )}

      {role === 'technical' && (
        <div className="grid grid-cols-2 gap-4">
          <StatCard label="Total Events"    value={stats.events}   icon={Calendar} color="#06B6D4" />
          <StatCard label="Upcoming Events" value={stats.upcoming} icon={Calendar} color="#F97316" />
        </div>
      )}

      {role === 'member' && (
        <div className="rounded-xl border p-5 space-y-3"
          style={{ background: 'var(--card-bg)', borderColor: 'var(--border-muted)' }}>
          <h2 className="font-mono font-bold uppercase" style={{ fontSize: '11px', color: 'var(--text-primary)' }}>Your Profile</h2>
          {[
            { label: 'Name',       value: profile?.name },
            { label: 'Email',      value: profile?.email },
            { label: 'Department', value: profile?.department || '—' },
            { label: 'Status',     value: profile?.approved ? '✓ Approved' : '⏳ Pending' },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between py-2 border-b"
              style={{ borderColor: 'var(--border-muted)', fontSize: '12px' }}>
              <span className="font-mono font-bold uppercase" style={{ fontSize: '9px', color: 'var(--text-subtle)' }}>{label}</span>
              <span className="font-sans" style={{ color: 'var(--text-primary)' }}>{value}</span>
            </div>
          ))}
        </div>
      )}

      {/* Recent Activity - for leaders/ops */}
      {['leader', 'operations'].includes(role) && recentActivity.length > 0 && (
        <div className="rounded-xl border p-5 space-y-4"
          style={{ background: 'var(--card-bg)', borderColor: 'var(--border-muted)' }}>
          <h2 className="font-mono font-bold uppercase" style={{ fontSize: '11px', color: 'var(--text-primary)' }}>Recent Certifications</h2>
          <div className="space-y-2">
            {recentActivity.map((cert, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b"
                style={{ borderColor: 'var(--border-muted)' }}>
                <div>
                  <p className="font-sans font-medium" style={{ fontSize: '12px', color: 'var(--text-primary)' }}>{cert.name}</p>
                  <p className="font-mono" style={{ fontSize: '9px', color: 'var(--text-muted)' }}>{cert.cert_title}</p>
                </div>
                <span className="font-mono" style={{ fontSize: '9px', color: 'var(--text-subtle)' }}>
                  {new Date(cert.created_at).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="rounded-xl border p-5"
        style={{ background: 'var(--card-bg)', borderColor: 'var(--border-muted)' }}>
        <h2 className="font-mono font-bold uppercase mb-3" style={{ fontSize: '11px', color: 'var(--text-primary)' }}>Quick Tips</h2>
        <div className="space-y-2">
          {role === 'member' && [
            '📌 Keep your profile updated',
            '🎯 Attend workshops to learn AWS',
            '🏅 Get AWS certified and submit here',
          ].map((tip, i) => (
            <p key={i} className="font-sans" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{tip}</p>
          ))}
          {['leader', 'operations'].includes(role) && [
            '✅ Review pending member approvals',
            '📅 Schedule upcoming events',
            '🎓 Approve certification submissions',
          ].map((tip, i) => (
            <p key={i} className="font-sans" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{tip}</p>
          ))}
          {role === 'technical' && [
            '🛠️ Create hands-on workshops',
            '📚 Prepare technical content',
            '💡 Share AWS best practices',
          ].map((tip, i) => (
            <p key={i} className="font-sans" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{tip}</p>
          ))}
          {['social_media', 'promotions'].includes(role) && [
            '📱 Review certification posts',
            '🎨 Create engaging content',
            '🌟 Promote upcoming events',
          ].map((tip, i) => (
            <p key={i} className="font-sans" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{tip}</p>
          ))}
        </div>
      </div>
    </div>
  );
}
