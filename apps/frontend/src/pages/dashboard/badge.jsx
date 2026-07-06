import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';
import { Download, Share2, Award, CheckCircle, Calendar } from 'lucide-react';

export default function BadgePage() {
  const { profile } = useAuth();
  const [certCount, setCertCount] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function loadCerts() {
      try {
        const data = await api.verify(profile.email);
        setCertCount(data?.length || 0);
      } catch (err) {
        console.error(err);
      }
    }
    if (profile?.email) loadCerts();
  }, [profile]);

  const badgeUrl = `${window.location.origin}/portal/verify?email=${encodeURIComponent(profile?.email || '')}`;

  const copyBadgeLink = () => {
    navigator.clipboard.writeText(badgeUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadBadge = () => {
    // Simple badge download implementation
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 600;
    const ctx = canvas.getContext('2d');
    
    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, 800, 600);
    gradient.addColorStop(0, '#AD5CFF');
    gradient.addColorStop(1, '#F97316');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 800, 600);
    
    // Text
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('AWS STUDENT BUILDER', 400, 200);
    ctx.fillText('GROUP', 400, 260);
    
    ctx.font = '32px Arial';
    ctx.fillText('Parul University', 400, 320);
    
    ctx.font = 'bold 36px Arial';
    ctx.fillText(profile?.name || 'Member', 400, 400);
    
    ctx.font = '24px Arial';
    ctx.fillText(profile?.department || 'AWS Builder', 400, 450);
    
    const link = document.createElement('a');
    link.download = `AWS-SBG-Badge-${profile?.name || 'member'}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">

      {/* Badge Card */}
      <div className="rounded-2xl border overflow-hidden" 
        style={{ background: 'var(--card-bg)', borderColor: 'var(--border-muted)' }}>
        
        {/* Gradient header */}
        <div className="relative p-8 overflow-hidden" 
          style={{ background: 'linear-gradient(135deg, #AD5CFF, #F97316)' }}>
          <div className="absolute inset-0 opacity-10" 
            style={{ backgroundImage: 'url(/SBGLOGO.png)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
          <div className="relative z-10 text-center space-y-3">
            <div className="w-24 h-24 mx-auto rounded-full border-4 border-white flex items-center justify-center font-black text-white text-4xl"
              style={{ background: 'rgba(0,0,0,0.2)' }}>
              {profile?.name?.[0]?.toUpperCase() || '?'}
            </div>
            <h1 className="font-extrabold text-3xl text-white">{profile?.name || 'AWS Builder'}</h1>
            <p className="font-mono font-bold uppercase text-white/90" style={{ fontSize: '12px', letterSpacing: '0.1em' }}>
              AWS Student Builder Group Member
            </p>
            <p className="font-sans text-white/80" style={{ fontSize: '14px' }}>
              Parul University, Vadodara
            </p>
          </div>
        </div>

        {/* Info section */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="text-center p-4 rounded-xl" style={{ background: 'var(--surface-low)' }}>
              <Award size={20} className="mx-auto mb-2" style={{ color: '#F97316' }} />
              <p className="font-black text-2xl" style={{ color: '#F97316' }}>{certCount}</p>
              <p className="font-mono font-bold uppercase" style={{ fontSize: '9px', color: 'var(--text-subtle)' }}>Certifications</p>
            </div>

            <div className="text-center p-4 rounded-xl" style={{ background: 'var(--surface-low)' }}>
              <CheckCircle size={20} className="mx-auto mb-2" style={{ color: '#22C55E' }} />
              <p className="font-black text-2xl" style={{ color: '#22C55E' }}>
                {profile?.approved ? '✓' : '⏳'}
              </p>
              <p className="font-mono font-bold uppercase" style={{ fontSize: '9px', color: 'var(--text-subtle)' }}>
                {profile?.approved ? 'Verified' : 'Pending'}
              </p>
            </div>

            <div className="text-center p-4 rounded-xl col-span-2 md:col-span-1" style={{ background: 'var(--surface-low)' }}>
              <Calendar size={20} className="mx-auto mb-2" style={{ color: '#AD5CFF' }} />
              <p className="font-black text-lg" style={{ color: '#AD5CFF' }}>
                {profile?.created_at ? new Date(profile.created_at).getFullYear() : '2025'}
              </p>
              <p className="font-mono font-bold uppercase" style={{ fontSize: '9px', color: 'var(--text-subtle)' }}>Member Since</p>
            </div>
          </div>

          {/* Profile details */}
          <div className="rounded-xl border p-4 space-y-2" style={{ borderColor: 'var(--border-muted)' }}>
            <h3 className="font-mono font-bold uppercase" style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Profile Details</h3>
            {[
              { label: 'Email', value: profile?.email },
              { label: 'Department', value: profile?.department || 'General' },
              { label: 'Role', value: profile?.role?.replace('_', ' ') || 'Member' },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between py-2 border-b"
                style={{ borderColor: 'var(--border-muted)', fontSize: '12px' }}>
                <span className="font-mono font-bold uppercase" style={{ fontSize: '9px', color: 'var(--text-subtle)' }}>{label}</span>
                <span className="font-sans" style={{ color: 'var(--text-primary)' }}>{value}</span>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            <button onClick={downloadBadge}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-mono font-bold uppercase text-white transition-all"
              style={{ fontSize: '10px', background: '#AD5CFF', cursor: 'pointer', border: 'none', minWidth: '140px' }}
              onMouseEnter={e => e.currentTarget.style.background = '#9C47FF'}
              onMouseLeave={e => e.currentTarget.style.background = '#AD5CFF'}>
              <Download size={14} /> Download Badge
            </button>

            <button onClick={copyBadgeLink}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-mono font-bold uppercase transition-all"
              style={{ 
                fontSize: '10px', 
                background: copied ? '#22C55E' : 'var(--surface-low)', 
                color: copied ? '#fff' : 'var(--text-primary)',
                cursor: 'pointer', 
                border: '1px solid var(--border-muted)',
                minWidth: '140px'
              }}>
              <Share2 size={14} /> {copied ? 'Copied!' : 'Share Link'}
            </button>
          </div>

          {profile?.approved && (
            <div className="rounded-lg p-3 flex items-start gap-3"
              style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)' }}>
              <CheckCircle size={16} style={{ color: '#22C55E', flexShrink: 0, marginTop: '2px' }} />
              <div>
                <p className="font-mono font-bold" style={{ fontSize: '11px', color: '#22C55E' }}>Verified Member</p>
                <p className="font-sans" style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                  Your membership has been verified. You can share your badge link to showcase your AWS SBG membership!
                </p>
              </div>
            </div>
          )}

          {!profile?.approved && (
            <div className="rounded-lg p-3 flex items-start gap-3"
              style={{ background: 'rgba(249,115,24,0.08)', border: '1px solid rgba(249,115,24,0.2)' }}>
              <Award size={16} style={{ color: '#F97316', flexShrink: 0, marginTop: '2px' }} />
              <div>
                <p className="font-mono font-bold" style={{ fontSize: '11px', color: '#F97316' }}>Pending Verification</p>
                <p className="font-sans" style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                  Your membership is under review. Once approved, you'll be able to share your verified badge!
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Share Instructions */}
      <div className="rounded-xl border p-5 space-y-3"
        style={{ background: 'var(--card-bg)', borderColor: 'var(--border-muted)' }}>
        <h3 className="font-mono font-bold uppercase" style={{ fontSize: '11px', color: 'var(--text-primary)' }}>How to Share</h3>
        <div className="space-y-2">
          {[
            'Download your badge and add it to your resume or portfolio',
            'Share your verification link on LinkedIn or other social media',
            'Include your badge in email signatures to showcase AWS expertise',
            'Display your membership on your personal website or blog',
          ].map((tip, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="font-mono font-bold" style={{ fontSize: '11px', color: '#AD5CFF' }}>{i + 1}.</span>
              <p className="font-sans" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{tip}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
