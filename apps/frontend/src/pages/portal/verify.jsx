import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, Loader, AlertCircle } from 'lucide-react';
import { api } from '../../lib/api';

const STATUS = { idle: 'idle', loading: 'loading', valid: 'valid', invalid: 'invalid' };

const MOCK_LOGS = [
  '> Connecting to PU_CREDENTIAL_REGISTRY...',
  '> Authenticating request pipeline...',
  '> Querying certificate hash index...',
  '> Cross-referencing member token table...',
];

export default function VerifyPage() {
  const [searchParams] = useSearchParams();
  const [token, setToken] = useState(searchParams.get('email') || '');
  const [status, setStatus] = useState(STATUS.idle);
  const [logs, setLogs] = useState([]);
  const [result, setResult] = useState(null);

  const verify = async (input) => {
    const query = (input || token).trim();
    if (!query) return;
    setStatus(STATUS.loading);
    setLogs([]);
    setResult(null);

    MOCK_LOGS.forEach((line, i) => {
      setTimeout(() => setLogs(l => [...l, line]), i * 400);
    });

    await new Promise(r => setTimeout(r, MOCK_LOGS.length * 400 + 300));

    try {
      const data = await api.verify(query);

      if (data && data.length > 0) {
        setStatus(STATUS.valid);
        setResult(data);
        setLogs(l => [...l, `> MATCH FOUND — ${data.length} certified credential(s) verified. ✓`]);
      } else {
        setStatus(STATUS.invalid);
        setLogs(l => [...l, '> NO MATCH — Token not found in registry. ✗']);
      }
    } catch {
      setStatus(STATUS.invalid);
      setLogs(l => [...l, '> ERROR — Could not reach registry. ✗']);
    }
  };

  // Auto-verify if email passed via query param
  useEffect(() => {
    const email = searchParams.get('email');
    if (email) verify(email);
  }, []);

  const reset = () => { setStatus(STATUS.idle); setLogs([]); setToken(''); setResult(null); };

  return (
    <div className="min-h-screen pt-20 pb-16 px-6" style={{ background: 'var(--bg)' }}>
      <div className="max-w-2xl mx-auto space-y-8">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 font-mono pt-6" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
          <Link to="/portal" className="flex items-center gap-1 no-underline transition-colors"
            style={{ color: 'var(--text-muted)' }}
            onMouseEnter={e => e.currentTarget.style.color = '#AD5CFF'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>
            <ArrowLeft size={12} /> PORTAL
          </Link>
          <span>/</span>
          <span style={{ color: '#F97316' }}>VERIFY_CREDENTIAL</span>
        </div>

        {/* Heading */}
        <div className="font-mono space-y-1">
          <p className="font-bold uppercase tracking-widest" style={{ fontSize: '10px', color: '#F97316' }}>
            SECURE_PIPELINE :: CREDENTIAL_LOOKUP
          </p>
          <h1 className="text-2xl font-extrabold uppercase" style={{ color: 'var(--text-primary)' }}>
            Verify Certificate
          </h1>
          <p className="font-sans font-light" style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            Enter an email address to verify AWS certifications against the official registry.
          </p>
        </div>

        {/* Input form */}
        <div className="rounded-xl border p-6 space-y-4 font-mono"
          style={{ background: 'var(--card-bg)', borderColor: 'var(--border-muted)' }}>
          <label className="block font-bold uppercase tracking-widest" style={{ fontSize: '10px', color: 'var(--text-primary)' }}>
            EMAIL / CREDENTIAL INPUT
          </label>
          <input
            value={token}
            onChange={e => setToken(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && status === STATUS.idle && verify()}
            placeholder="member@paruluniversity.ac.in"
            disabled={status === STATUS.loading}
            className="w-full rounded-md border px-4 py-3 font-mono outline-none transition-all"
            style={{
              fontSize: '13px',
              background: 'var(--surface-low)',
              borderColor: status === STATUS.valid ? '#22C55E'
                : status === STATUS.invalid ? '#EF4444'
                : 'var(--border-muted)',
              color: 'var(--text-primary)',
              caretColor: '#AD5CFF',
            }}
            spellCheck={false}
            autoComplete="off"
          />
          <button
            onClick={status === STATUS.idle ? () => verify() : reset}
            disabled={status === STATUS.loading || (!token.trim() && status === STATUS.idle)}
            className="w-full py-3 rounded-md font-bold uppercase transition-all font-mono flex items-center justify-center gap-2"
            style={{
              fontSize: '11px',
              letterSpacing: '0.08em',
              background: status === STATUS.valid ? '#16A34A'
                : status === STATUS.invalid ? '#DC2626'
                : '#AD5CFF',
              color: '#fff',
              opacity: (status === STATUS.idle && !token.trim()) ? 0.5 : 1,
              cursor: (status === STATUS.idle && !token.trim()) ? 'not-allowed' : 'pointer',
              border: 'none',
              boxShadow: '0 0 20px rgba(173,92,255,0.12)',
            }}>
            {status === STATUS.loading && <Loader size={13} className="animate-spin" />}
            {status === STATUS.idle && 'Verify Pipeline'}
            {status === STATUS.loading && 'Processing...'}
            {status === STATUS.valid && <><ShieldCheck size={13} /> Verified — Run Another</>}
            {status === STATUS.invalid && <><AlertCircle size={13} /> Not Found — Try Again</>}
          </button>
        </div>

        {/* Terminal log */}
        {logs.length > 0 && (
          <div className="rounded-xl border p-4 font-mono space-y-1"
            style={{ background: 'var(--surface-low)', borderColor: 'var(--border-muted)' }}>
            <p className="font-bold uppercase tracking-widest mb-3" style={{ fontSize: '9px', color: 'var(--text-subtle)' }}>
              PIPELINE_OUTPUT_LOG
            </p>
            {logs.map((line, i) => (
              <p key={i} style={{
                fontSize: '12px',
                margin: 0,
                color: line.includes('✓') ? '#22C55E'
                  : line.includes('✗') || line.includes('ERROR') ? '#EF4444'
                  : '#06B6D4',
              }}>
                {line}
              </p>
            ))}
          </div>
        )}

        {/* Result */}
        {status === STATUS.valid && result && (
          <div className="rounded-xl border overflow-hidden"
            style={{ borderColor: 'rgba(34,197,94,0.3)' }}>
            <div className="px-5 py-3 border-b flex items-center gap-2"
              style={{ background: 'rgba(34,197,94,0.08)', borderColor: 'rgba(34,197,94,0.2)' }}>
              <ShieldCheck size={16} style={{ color: '#22C55E' }} />
              <p className="font-mono font-bold uppercase" style={{ fontSize: '10px', color: '#22C55E' }}>
                CREDENTIAL_VERIFIED — {result.length} certification{result.length > 1 ? 's' : ''}
              </p>
            </div>
            <div className="divide-y" style={{ borderColor: 'var(--border-muted)' }}>
              {result.map((c, i) => (
                <div key={i} className="p-4 space-y-1" style={{ background: 'var(--card-bg)' }}>
                  <p className="font-bold" style={{ fontSize: '14px', color: 'var(--text-primary)' }}>{c.name}</p>
                  <p className="font-mono" style={{ fontSize: '10px', color: '#AD5CFF' }}>{c.certificate_title}</p>
                  <div className="flex flex-wrap gap-4 font-mono" style={{ fontSize: '9px', color: 'var(--text-subtle)' }}>
                    {c.department && <span>Dept: {c.department}</span>}
                    {c.exam_date && <span>Exam: {c.exam_date}</span>}
                    {c.credly_link && (
                      <a href={c.credly_link} target="_blank" rel="noreferrer"
                        className="no-underline" style={{ color: '#AD5CFF' }}>
                        View Badge ↗
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {status === STATUS.invalid && (
          <div className="rounded-xl border p-5 font-mono flex items-start gap-4"
            style={{ background: 'rgba(239,68,68,0.05)', borderColor: 'rgba(239,68,68,0.3)' }}>
            <AlertCircle size={20} style={{ color: '#EF4444', flexShrink: 0 }} />
            <div className="space-y-1">
              <p className="font-bold uppercase" style={{ fontSize: '11px', color: '#EF4444' }}>
                CREDENTIAL_NOT_FOUND
              </p>
              <p className="font-sans font-light" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                No approved certifications found for "{token}". Check spelling or contact awssbgpu@gmail.com.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
