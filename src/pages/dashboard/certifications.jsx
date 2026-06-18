import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { CheckCircle, Copy, ExternalLink, RefreshCw, Search } from 'lucide-react';

const STATUS_COLOR = { pending:'#F97316', approved:'#22C55E', posted:'#AD5CFF' };

function generatePost(c) {
  return `🎉 Congratulations ${c.name}!

We're thrilled to announce that ${c.name} from ${c.department || 'Parul University'} has successfully earned the ${c.cert_title} certification! 🏅☁️

This achievement reflects their dedication to cloud learning and hands-on building with AWS.

🔗 Verify Badge: ${c.credly_link || 'N/A'}

#AWSStudentBuilderGroup #ParulUniversity #AWSCertified #CloudComputing #AWS #Vadodara`;
}

export default function CertificationsPage() {
  const [certs,   setCerts]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter,  setFilter]  = useState('all');
  const [copied,  setCopied]  = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from('certifications').select('*').order('created_at', { ascending: false });
    setCerts(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (id, status, post_draft) => {
    await supabase.from('certifications').update({ status, post_draft }).eq('id', id);
    load();
  };

  const copy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const filtered = certs.filter(c => {
    const matchFilter = filter === 'all' || c.status === filter;
    const matchSearch = !searchQuery || 
      c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.cert_title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="font-mono font-extrabold uppercase" style={{ color: 'var(--text-primary)' }}>Certifications</h2>
          <p className="font-mono" style={{ fontSize: '10px', color: 'var(--text-subtle)' }}>{filtered.length} of {certs.length} submissions</p>
        </div>
        <div className="flex gap-2 flex-wrap items-center">
          <div className="relative">
            <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-subtle)' }} />
            <input 
              value={searchQuery} 
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search..."
              style={{ 
                paddingLeft: '32px', 
                background: 'var(--surface-low)', 
                border: '1px solid var(--border-muted)',
                borderRadius: '6px', 
                padding: '6px 12px 6px 32px', 
                fontSize: '11px',
                color: 'var(--text-primary)', 
                outline: 'none', 
                width: '180px'
              }} 
            />
          </div>
          {['all','pending','approved','posted'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className="px-3 py-1.5 rounded-md border font-mono font-bold uppercase transition-all"
              style={{ fontSize: '9px', cursor: 'pointer', background: filter === f ? '#AD5CFF' : 'transparent', color: filter === f ? '#fff' : 'var(--text-muted)', borderColor: filter === f ? '#AD5CFF' : 'var(--border-muted)' }}>
              {f}
            </button>
          ))}
          <button onClick={load} className="w-8 h-8 rounded-md border flex items-center justify-center"
            style={{ background: 'transparent', borderColor: 'var(--border-muted)', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <RefreshCw size={13} />
          </button>
        </div>
      </div>

      {loading ? (
        <p className="font-mono text-center py-10" style={{ fontSize: '12px', color: 'var(--text-subtle)' }}>Loading...</p>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border p-10 text-center" style={{ background: 'var(--card-bg)', borderColor: 'var(--border-muted)' }}>
          <p className="font-mono" style={{ fontSize: '12px', color: 'var(--text-subtle)' }}>No {filter === 'all' ? '' : filter} submissions yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(c => {
            const post = c.post_draft || generatePost(c);
            return (
              <div key={c.id} className="rounded-xl border overflow-hidden transition-all"
                style={{ background: 'var(--card-bg)', borderColor: 'var(--border-muted)' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = '#AD5CFF40'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-muted)'}>
                <div className="h-0.5" style={{ background: STATUS_COLOR[c.status] }} />
                <div className="p-5 grid grid-cols-1 lg:grid-cols-2 gap-5">

                  {/* Member info */}
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
                    <div className="grid grid-cols-2 gap-2">
                      {[['Email', c.email],['Department', c.department],['Semester', c.semester],['Enrolment', c.enrolment],['Exam Date', c.exam_date],['Institute', c.institute]].map(([label, value]) => value ? (
                        <div key={label}>
                          <p className="font-mono font-bold uppercase" style={{ fontSize: '8px', color: 'var(--text-subtle)' }}>{label}</p>
                          <p className="font-sans" style={{ fontSize: '11px', color: 'var(--text-primary)' }}>{value}</p>
                        </div>
                      ) : null)}
                    </div>
                    {c.credly_link && (
                      <a href={c.credly_link} target="_blank" rel="noreferrer"
                        className="inline-flex items-center gap-1.5 font-mono font-bold uppercase no-underline"
                        style={{ fontSize: '9px', color: '#AD5CFF' }}>
                        <ExternalLink size={10} /> View Credly Badge
                      </a>
                    )}
                  </div>

                  {/* Post draft */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="font-mono font-bold uppercase" style={{ fontSize: '9px', color: 'var(--text-muted)' }}>Social Media Draft</p>
                      <button onClick={() => copy(post, c.id)}
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded font-mono font-bold uppercase transition-all"
                        style={{ fontSize: '8px', cursor: 'pointer', background: copied === c.id ? '#22C55E' : '#AD5CFF15', color: copied === c.id ? '#fff' : '#AD5CFF', border: '1px solid #AD5CFF30' }}>
                        <Copy size={10} /> {copied === c.id ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                    <textarea defaultValue={post} rows={8}
                      style={{ width: '100%', background: 'var(--surface-low)', border: '1px solid var(--border-muted)', borderRadius: '8px', padding: '10px 12px', fontSize: '11px', fontFamily: 'inherit', color: 'var(--text-muted)', outline: 'none', resize: 'vertical', lineHeight: 1.6 }} />
                    <div className="flex gap-2 flex-wrap">
                      {c.status === 'pending' && (
                        <button onClick={() => updateStatus(c.id, 'approved', post)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md font-mono font-bold uppercase"
                          style={{ fontSize: '9px', background: 'rgba(34,197,94,0.1)', color: '#22C55E', border: '1px solid rgba(34,197,94,0.3)', cursor: 'pointer' }}>
                          <CheckCircle size={11} /> Approve
                        </button>
                      )}
                      {c.status === 'approved' && (
                        <button onClick={() => updateStatus(c.id, 'posted', post)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md font-mono font-bold uppercase"
                          style={{ fontSize: '9px', background: 'rgba(173,92,255,0.1)', color: '#AD5CFF', border: '1px solid rgba(173,92,255,0.3)', cursor: 'pointer' }}>
                          ✓ Mark as Posted
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
