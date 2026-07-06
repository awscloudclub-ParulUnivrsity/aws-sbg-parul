import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield } from 'lucide-react';
import { TerminalConsole } from '../../components/TerminalConsole';

export default function PortalPage() {
  return (
    <div className="min-h-screen pt-20 pb-16 px-6" style={{ background: 'var(--bg)' }}>
      <div className="max-w-4xl mx-auto space-y-8">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 font-mono pt-6" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
          <Link to="/" className="flex items-center gap-1 no-underline transition-colors"
            style={{ color: 'var(--text-muted)' }}
            onMouseEnter={e => e.currentTarget.style.color = '#AD5CFF'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>
            <ArrowLeft size={12} /> HOME
          </Link>
          <span>/</span>
          <span style={{ color: '#AD5CFF' }}>MEMBER_PORTAL</span>
        </div>

        {/* Heading */}
        <div className="font-mono space-y-1">
          <p className="font-bold uppercase tracking-widest" style={{ fontSize: '10px', color: '#AD5CFF' }}>
            AUTHORIZED_ACCESS :: PU_NODE
          </p>
          <h1 className="text-2xl font-extrabold uppercase" style={{ color: 'var(--text-primary)' }}>
            Member Portal Console
          </h1>
          <p className="font-sans font-light" style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            Your personal AWS SBG dashboard — run commands, check sprints, and verify credentials.
          </p>
        </div>

        {/* Terminal */}
        <TerminalConsole />

        {/* Verify credential CTA */}
        <div className="rounded-xl border p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-mono"
          style={{ background: 'rgba(173,92,255,0.04)', borderColor: 'rgba(173,92,255,0.2)' }}>
          <div className="flex items-start gap-3">
            <Shield size={18} className="flex-shrink-0 mt-0.5" style={{ color: '#AD5CFF' }} />
            <div>
              <p className="font-bold uppercase" style={{ fontSize: '11px', color: 'var(--text-primary)' }}>
                CREDENTIAL VERIFICATION
              </p>
              <p className="font-sans font-light mt-1" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                Have a PU-AWS certificate token? Verify it against the central registry.
              </p>
            </div>
          </div>
          <Link to="/portal/verify"
            className="inline-flex items-center px-5 py-2.5 rounded-md font-bold uppercase text-white no-underline transition-all flex-shrink-0"
            style={{ fontSize: '10px', letterSpacing: '0.08em', background: '#AD5CFF', boxShadow: '0 0 20px rgba(173,92,255,0.15)' }}
            onMouseEnter={e => e.currentTarget.style.background = '#9C47FF'}
            onMouseLeave={e => e.currentTarget.style.background = '#AD5CFF'}>
            Verify Credential →
          </Link>
        </div>
      </div>
    </div>
  );
}
