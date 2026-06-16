import React from 'react';
import { MemberCard } from '../../components/MemberCard';
import { TEAM } from '../../data/team';

export default function TeamPage() {
  const manish = TEAM[0];

  return (
    <div className="min-h-screen pt-20 pb-16 px-6" style={{ background: 'var(--bg)' }}>
      <div className="max-w-6xl mx-auto space-y-10">

        {/* Header */}
        <div className="pt-8 text-center space-y-3">
          <p className="font-mono font-bold uppercase tracking-widest"
            style={{ fontSize: '10px', color: '#AD5CFF' }}>
            AWS_SBG :: PARUL_UNIVERSITY :: LEADERSHIP
          </p>
          <h1 className="font-extrabold uppercase text-3xl md:text-4xl"
            style={{ color: 'var(--text-primary)' }}>
            Our Team
          </h1>
          <p className="font-sans font-light"
            style={{ fontSize: '13px', color: 'var(--text-muted)', maxWidth: '420px', margin: '0 auto' }}>
            Meet the chapter lead steering cloud education at Parul University.
          </p>
        </div>

        {/* Single centered card */}
        <div className="flex justify-center">
          <div className="w-full max-w-xs">
            <MemberCard dev={manish} />
          </div>
        </div>
      </div>
    </div>
  );
}
