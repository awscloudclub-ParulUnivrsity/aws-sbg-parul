import React, { useState, useEffect } from 'react';
import { MemberCard } from '../../components/MemberCard';
import { supabase } from '../../lib/supabase';

export default function TeamPage() {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [debugInfo, setDebugInfo] = useState(null);

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .select(`
          *,
          profile:profiles!team_members_profile_id_fkey(
            id,
            name,
            email,
            role,
            department,
            avatar_url,
            bio
          )
        `)
        .order('created_at', { ascending: true });

      console.log('[TeamPage] data:', data, 'error:', error);
      setDebugInfo({ data, error: error?.message || null });

      if (error) throw error;
      setTeamMembers(data || []);
    } catch (err) {
      console.error('[TeamPage] fetch failed:', err);
      setError(`Failed to load team members: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 pb-16 px-6 flex items-center justify-center" style={{ background: 'var(--bg)' }}>
        <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
          style={{ borderColor: '#AD5CFF', borderTopColor: 'transparent' }} />
      </div>
    );
  }

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
            Meet the team leading cloud education at Parul University.
          </p>
        </div>

        {error && (
          <div className="text-center py-4 px-4 rounded-lg border"
            style={{ background: 'rgba(239,68,68,0.08)', borderColor: 'rgba(239,68,68,0.3)', color: '#EF4444', fontSize: '13px' }}>
            {error}
          </div>
        )}

        {/* Debug panel — remove after fixing */}
        {debugInfo && (
          <div className="rounded-lg border p-4 font-mono"
            style={{ background: 'rgba(0,0,0,0.3)', borderColor: 'rgba(173,92,255,0.3)', fontSize: '11px', color: '#AD5CFF' }}>
            <p className="font-bold mb-1">DEBUG (remove later):</p>
            <p>Error: {debugInfo.error || 'none'}</p>
            <p>Row count: {debugInfo.data?.length ?? 'null'}</p>
            {debugInfo.data?.length > 0 && (
              <p>First row keys: {Object.keys(debugInfo.data[0]).join(', ')}</p>
            )}
          </div>
        )}

        {/* Team Grid */}
        {teamMembers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {teamMembers.map(member => {
              const name = member.profile?.name || 'Team Member';
              const slug = name.toLowerCase().replace(/\s+/g, '-');
              return (
                <MemberCard
                  key={member.id}
                  dev={{
                    slug,
                    name,
                    role: member.role_title || member.profile?.role || 'Member',
                    title: member.department || member.profile?.department || '',
                    initial: name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
                    photo: member.profile?.avatar_url || null,
                    skills: member.skills ? String(member.skills).split(',').map(s => s.trim()) : [],
                    linkedin: member.linkedin,
                    github: member.github,
                    gradient: 'linear-gradient(135deg, #AD5CFF, #F97316)',
                    color: '#AD5CFF',
                  }}
                />
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="font-sans" style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              Team information coming soon!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
