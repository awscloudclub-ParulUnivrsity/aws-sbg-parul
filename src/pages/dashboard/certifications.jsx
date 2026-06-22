import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { CheckCircle, Copy, ExternalLink, RefreshCw, Search, XCircle, Image, FileText } from 'lucide-react';

const STATUS_COLOR = { pending: '#F97316', approved: '#22C55E', posted: '#AD5CFF' };

function generatePost(c) {
  return `🎉 Congratulations ${c.name}!

We're thrilled to announce that ${c.name} from ${c.department || 'Parul University'} has successfully earned the ${c.cert_title} certification! 🏅☁️

This achievement reflects their dedication to cloud learning and hands-on building with AWS.

🔗 Verify Badge: ${c.credly_link || 'N/A'}

#AWSStudentBuilderGroup #ParulUniversity #AWSCertified #CloudComputing #AWS #Vadodara`;
}

function CertCard({ c, onStatusChange }) {
  const [draft, setDraft] = useState(c.post_draft || generatePost(c));
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(draft);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const updateStatus = async (status) => {
    setSaving(true);
    await supabase.from('certifications').update({ status, post_draft: draft }).eq('id', c.id);
    setSaving(false);
    onStatusChange();
  };

  return (
    <div className="rounded-xl border overflow-hidden transition-all"
      style={{ background: 'var(--card-bg)', borderColor: 'var(--border-muted)' }}
      onMouseEnter={e => e.currentTarget.style.borderColor = '#AD5CFF40'}
      onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-muted)'}>

      {/* Status bar */}
      <div className="h-0.5" style={{ background: STATUS_COLOR[c.status] }} />

      <div className="p-5 grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Left — member info */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono font-bold uppercase px-2 py-0.5 rounded"
              style={{ fontSize: '8px', background: STATUS_COLOR[c.status] + '15', color: STATUS_COLOR[c.status] }}>
              {c.status}
            </span>
            <span className="font-mono" style={{ fontSize: '10px', color: 'var(--text-subtle)' }}>
              {new Date(c.created_at).toLocaleDateString()}
            </span>
          </div>

          <div>
            <h3 className="font-bold" style={{ fontSize: '15px', color: 'var(--text-primary)' }}>{c.name}</h3>
            <p className="font-mono" style={{ fontSize: '10px', color: '#AD5CFF' }}>{c.cert_title}</p>
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            {[
              ['Email',      c.email],
              ['Parul Email', c.parul_email],
              ['Mobile',     c.mobile],
              ['Department', c.department],
              ['Semester',   c.semester],
              ['Enrolment',  c.enrolment],
              ['Exam Date',  c.exam_date],
              ['Institute',  c.institute],
            ].filter(([, v]) => v).map(([label, value]) => (
              <div key={label}>
                <p className="font-mono font-bold uppercase" style={{ fontSize: '8px', color: 'var(--text-subtle)' }}>{label}</p>
                <p className="font-sans" style={{ fontSize: '11px', color: 'var(--text-primary)' }}>{value}</p>
              </div>
            ))}
          </div>

          {/* Links */}
          <div className="flex flex-wrap gap-3">
            {c.credly_link && (
              <a href={c.credly_link} target="_blank" rel="noreferrer"
                className="inline-flex items-center gap-1.5 font-mono font-bold uppercase no-underline transition-colors"
                style={{ fontSize: '9px', color: '#AD5CFF' }}
                onMouseEnter={e => e.currentTarget.style.color = '#9C47FF'}
                onMouseLeave={e => e.currentTarget.style.color = '#AD5CFF'}>
                <ExternalLink size={10} /> Credly Badge
              </a>
            )}
            {c.result_url && (
              <a href={c.result_url} target="_blank" rel="noreferrer"
                className="inline-flex items-center gap-1.5 font-mono font-bold uppercase no-underline transition-colors"
                style={{ fontSize: '9px', color: '#06B6D4' }}>
                <FileText size={10} /> View Result
              </a>
            )}
            {c.photo_url && (
              <a href={c.photo_url} target="_blank" rel="noreferrer"
                className="inline-flex items-center gap-1.5 font-mono font-bold uppercase no-underline transition-colors"
                style={{ fontSize: '9px', color: '#22C55E' }}>
                <Image size={10} /> View Photo
              </a>
            )}
          </div>
        </div>

        {/* Right — editable post draft */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="font-mono font-bold uppercase" style={{ fontSize: '9px', color: 'var(--text-muted)' }}>
              Social Media Draft
            </p>
            <button onClick={copy}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded font-mono font-bold uppercase transition-all"
              style={{ fontSize: '8px', cursor: 'pointer', background: copied ? '#22C55E' : '#AD5CFF15', color: copied ? '#fff' : '#AD5CFF', border: '1px solid #AD5CFF30' }}>
              <Copy size={10} /> {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>

          <textarea
            value={draft}
            onChange={e => setDraft(e.target.value)}
            rows={8}
            style={{ width: '100%', background: 'var(--surface-low)', border: '1px solid var(--border-muted)', borderRadius: '8px', padding: '10px 12px', fontSize: '11px', fontFamily: 'inherit', color: 'var(--text-primary)', outline: 'none', resize: 'vertical', lineHeight: 1.6 }}
            onFocus={e => e.target.style.borderColor = '#AD5CFF'}
            onBlur={e => e.target.style.borderColor = 'var(--border-muted)'}
          />

          <div className="flex gap-2 flex-wrap">
            {c.status === 'pending' && (
              <>
                <button onClick={() => updateStatus('approved')} disabled={saving}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md font-mono font-bold uppercase transition-all"
                  style={{ fontSize: '9px', background: 'rgba(34,197,94,0.1)', color: '#22C55E', border: '1px solid rgba(34,197,94,0.3)', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1 }}>
                  <CheckCircle size={11} /> {saving ? 'Saving...' : 'Approve'}
                </button>
                <button onClick={() => updateStatus('pending')} disabled={saving}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md font-mono font-bold uppercase transition-all"
                  style={{ fontSize: '9px', background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.3)', cursor: saving ? 'not-allowed' : 'pointer' }}>
                  <XCircle size={11} /> Reset to Pending
                </button>
              </>
            )}
            {c.status === 'approved' && (
              <>
                <button onClick={() => updateStatus('posted')} disabled={saving}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md font-mono font-bold uppercase transition-all"
                  style={{ fontSize: '9px', background: 'rgba(173,92,255,0.1)', color: '#AD5CFF', border: '1px solid rgba(173,92,255,0.3)', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1 }}>
                  ✓ {saving ? 'Saving...' : 'Mark as Posted'}
                </button>
                <button onClick={() => updateStatus('pending')} disabled={saving}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md font-mono font-bold uppercase transition-all"
                  style={{ fontSize: '9px', background: 'rgba(249,115,24,0.1)', color: '#F97316', border: '1px solid rgba(249,115,24,0.3)', cursor: 'pointer' }}>
                  ↩ Undo
                </button>
              </>
            )}
            {c.status === 'posted' && (
              <button onClick={() => updateStatus('approved')} disabled={saving}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md font-mono font-bold uppercase"
                style={{ fontSize: '9px', background: 'var(--surface-low)', color: 'var(--text-muted)', border: '1px solid var(--border-muted)', cursor: 'pointer' }}>
                ↩ Reopen
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CertificationsPage() {
  const [certs,       setCerts]       = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [filter,      setFilter]      = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from('certifications').select('*').order('created_at', { ascending: false });
    setCerts(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const filtered = certs.filter(c => {
    const matchFilter = filter === 'all' || c.status === filter;
    const matchSearch = !searchQuery ||
      c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.cert_title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchFilter && matchSearch;
  });

  const counts = {
    all: certs.length,
    pending:  certs.filter(c => c.status === 'pending').length,
    approved: certs.filter(c => c.status === 'approved').length,
    posted:   certs.filter(c => c.status === 'posted').length,
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="font-mono font-extrabold uppercase" style={{ color: 'var(--text-primary)' }}>Certifications</h2>
          <p className="font-mono" style={{ fontSize: '10px', color: 'var(--text-subtle)' }}>
            {filtered.length} of {certs.length} submissions
          </p>
        </div>
        <div className="flex gap-2 flex-wrap items-center">
          <div className="relative">
            <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-subtle)' }} />
            <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search..."
              style={{ paddingLeft: '28px', background: 'var(--surface-low)', border: '1px solid var(--border-muted)', borderRadius: '6px', padding: '6px 12px 6px 28px', fontSize: '11px', color: 'var(--text-primary)', outline: 'none', width: '180px' }} />
          </div>
          {['all', 'pending', 'approved', 'posted'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className="px-3 py-1.5 rounded-md border font-mono font-bold uppercase transition-all"
              style={{ fontSize: '9px', cursor: 'pointer', background: filter === f ? '#AD5CFF' : 'transparent', color: filter === f ? '#fff' : 'var(--text-muted)', borderColor: filter === f ? '#AD5CFF' : 'var(--border-muted)' }}>
              {f} {counts[f] > 0 && <span style={{ opacity: 0.7 }}>({counts[f]})</span>}
            </button>
          ))}
          <button onClick={load} className="w-8 h-8 rounded-md border flex items-center justify-center transition-all"
            style={{ background: 'transparent', borderColor: 'var(--border-muted)', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <RefreshCw size={13} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: '#AD5CFF', borderTopColor: 'transparent' }} />
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border p-10 text-center" style={{ background: 'var(--card-bg)', borderColor: 'var(--border-muted)' }}>
          <p className="font-mono" style={{ fontSize: '12px', color: 'var(--text-subtle)' }}>No {filter === 'all' ? '' : filter} submissions yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(c => <CertCard key={c.id} c={c} onStatusChange={load} />)}
        </div>
      )}
    </div>
  );
}
