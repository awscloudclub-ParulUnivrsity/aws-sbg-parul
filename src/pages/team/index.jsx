import React, { useState, useEffect } from 'react';
import { MemberCard } from '../../components/MemberCard';
import { supabase } from '../../lib/supabase';

export default function TeamPage() {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .select(`
          *,
          profile:profiles(
            id,
            name,
            email,
            role,
            department,
            avatar_url
          )
        `)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      setTeamMembers(data || []);
    } catch (error) {
      console.error('Error fetching team members:', error);
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

        {/* Team Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {teamMembers.map(member => (
            <MemberCard
              key={member.id}
              dev={{
                name: member.profile?.name || 'Team Member',
                role: member.role_title || member.profile?.role || 'Member',
                initial: member.profile?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'TM',
                linkedin: member.linkedin,
                github: member.github,
                department: member.department || member.profile?.department,
                gradient: 'linear-gradient(135deg, #AD5CFF, #F97316)',
                color: '#AD5CFF',
              }}
            />
          ))}
        </div>

        {teamMembers.length === 0 && (
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
