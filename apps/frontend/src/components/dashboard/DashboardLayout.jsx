import React, { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { LayoutDashboard, Users, Calendar, Award, Settings, Menu, X, Sun, Moon, LogOut, ChevronRight } from 'lucide-react';

export const DEPT_COLORS = {
  leader:       '#AD5CFF',
  social_media: '#EC4899',
  technical:    '#06B6D4',
  operations:   '#F97316',
  promotions:   '#F59E0B',
  member:       '#22C55E',
};

const MENU = {
  leader:       [
    { icon: LayoutDashboard, label: 'Overview',       href: '/dashboard' },
    { icon: Users,           label: 'Members',        href: '/dashboard/members' },
    { icon: Users,           label: 'Core Team',      href: '/dashboard/team' },
    { icon: Calendar,        label: 'Events',         href: '/dashboard/events' },
    { icon: Award,           label: 'Certifications', href: '/dashboard/certifications' },
    { icon: Settings,        label: 'Settings',       href: '/dashboard/settings' },
  ],
  social_media: [
    { icon: LayoutDashboard, label: 'Overview',       href: '/dashboard' },
    { icon: Award,           label: 'Certifications', href: '/dashboard/certifications' },
  ],
  technical: [
    { icon: LayoutDashboard, label: 'Overview',       href: '/dashboard' },
    { icon: Calendar,        label: 'Events',         href: '/dashboard/events' },
  ],
  operations: [
    { icon: LayoutDashboard, label: 'Overview',       href: '/dashboard' },
    { icon: Users,           label: 'Members',        href: '/dashboard/members' },
  ],
  promotions: [
    { icon: LayoutDashboard, label: 'Overview',       href: '/dashboard' },
    { icon: Award,           label: 'Certifications', href: '/dashboard/certifications' },
  ],
  member: [
    { icon: LayoutDashboard, label: 'My Profile',     href: '/dashboard' },
    { icon: Award,           label: 'My Badge',       href: '/dashboard/badge' },
  ],
};

function SidebarContent({ onClose }) {
  const { profile, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const role  = profile?.role || 'member';
  const menu  = MENU[role] || MENU.member;
  const color = DEPT_COLORS[role] || '#AD5CFF';

  const handleSignOut = async () => { await signOut(); navigate('/dashboard/login'); };

  return (
    <aside className="flex flex-col h-full w-56 border-r"
      style={{ background: 'var(--surface-low)', borderColor: 'var(--border-muted)' }}>

      <div className="flex items-center gap-3 px-4 py-4 border-b" style={{ borderColor: 'var(--border-muted)' }}>
        <img src="/SBGLOGO.png" alt="SBG" className="h-7 w-auto object-contain" />
        <div className="flex-1 min-w-0">
          <p className="font-mono font-black uppercase truncate" style={{ fontSize: '9px', color: 'var(--text-primary)', letterSpacing: '0.08em' }}>AWS SBG PU</p>
          <p className="font-mono font-bold uppercase truncate" style={{ fontSize: '8px', color }}>{role.replace('_',' ')} PANEL</p>
        </div>
        {onClose && (
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <X size={15} />
          </button>
        )}
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {menu.map(({ icon: Icon, label, href }) => {
          const active = location.pathname === href;
          return (
            <Link key={href} to={href} onClick={onClose}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg no-underline transition-all font-mono font-bold uppercase"
              style={{
                fontSize: '9px', letterSpacing: '0.06em',
                background: active ? color + '18' : 'transparent',
                color: active ? color : 'var(--text-muted)',
                borderLeft: `2px solid ${active ? color : 'transparent'}`,
              }}>
              <Icon size={13} /> {label}
              {active && <ChevronRight size={10} className="ml-auto" />}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t space-y-2" style={{ borderColor: 'var(--border-muted)' }}>
        <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg" style={{ background: color + '0A' }}>
          <div className="w-7 h-7 rounded-full flex items-center justify-center font-black text-white text-xs flex-shrink-0"
            style={{ background: `linear-gradient(135deg, ${color}, #F97316)` }}>
            {profile?.name?.[0]?.toUpperCase() || 'U'}
          </div>
          <div className="min-w-0">
            <p className="font-mono font-bold truncate" style={{ fontSize: '10px', color: 'var(--text-primary)' }}>{profile?.name || 'User'}</p>
            <p className="font-mono uppercase truncate" style={{ fontSize: '8px', color }}>{role.replace('_',' ')}</p>
          </div>
        </div>
        <button onClick={handleSignOut}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg font-mono font-bold uppercase transition-all"
          style={{ fontSize: '9px', color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; e.currentTarget.style.color = '#EF4444'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--text-muted)'; }}>
          <LogOut size={12} /> Sign Out
        </button>
      </div>
    </aside>
  );
}

export default function DashboardLayout() {
  const { profile } = useAuth();
  const { dark, toggle } = useTheme();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const role  = profile?.role || 'member';
  const color = DEPT_COLORS[role] || '#AD5CFF';
  const menu  = MENU[role] || MENU.member;
  const pageLabel = menu.find(m => m.href === location.pathname)?.label || 'Dashboard';

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--bg)' }}>

      {/* Desktop sidebar */}
      <div className="hidden md:flex flex-shrink-0">
        <SidebarContent />
      </div>

      {/* Mobile overlay */}
      {open && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <SidebarContent onClose={() => setOpen(false)} />
          <div className="flex-1 bg-black/50" onClick={() => setOpen(false)} />
        </div>
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="flex items-center justify-between px-4 md:px-6 h-14 border-b flex-shrink-0"
          style={{ background: 'var(--surface-low)', borderColor: 'var(--border-muted)' }}>
          <div className="flex items-center gap-3">
            <button className="md:hidden" onClick={() => setOpen(true)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-primary)' }}>
              <Menu size={18} />
            </button>
            <div>
              <p className="font-mono font-bold uppercase" style={{ fontSize: '12px', color: 'var(--text-primary)' }}>{pageLabel}</p>
              <p className="font-mono" style={{ fontSize: '9px', color: 'var(--text-subtle)' }}>AWS SBG PU :: {role.toUpperCase().replace('_',' ')}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={toggle}
              className="w-8 h-8 rounded-md border flex items-center justify-center"
              style={{ background: 'transparent', borderColor: 'var(--border-muted)', color: 'var(--text-muted)', cursor: 'pointer' }}>
              {dark ? <Sun size={14} /> : <Moon size={14} />}
            </button>
            <div className="w-8 h-8 rounded-full flex items-center justify-center font-black text-white text-xs"
              style={{ background: `linear-gradient(135deg, ${color}, #F97316)` }}>
              {profile?.name?.[0]?.toUpperCase() || 'U'}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
