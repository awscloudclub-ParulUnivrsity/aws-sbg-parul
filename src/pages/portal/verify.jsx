import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, Loader, AlertCircle } from 'lucide-react';

const MOCK_VALID = ['PU-AWS-2026-X77', 'PU-AWS-2026-A01', 'PU-AWS-2026-B12'];

const STATUS = { idle: 'idle', loading: 'loading', valid: 'valid', invalid: 'invalid' };

const MOCK_LOGS = [
  '> Connecting to PU_CREDENTIAL_REGISTRY...',
  '> Authenticating request pipeline...',
  '> Querying certificate hash index...',
  '> Cross-referencing member token table...',
];

export default function VerifyPage() {
  const [token, setToken] = useState('');
  const [status, setStatus] = useState(STATUS.idle);
  const [logs, setLogs] = useState([]);

  const verify = () => {
    if (!token.trim()) return;
    setStatus(STATUS.loading);
    setLogs([]);

    MOCK_LOGS.forEach((line, i) => {
      setTimeout(() => setLogs(l => [...l, line]), i * 500);
    });

    setTimeout(() => {
      const isValid = MOCK_VALID.includes(token.trim().toUpperCase());
      setStatus(isValid ? STATUS.valid : STATUS.invalid);
      setLogs(l => [...l, isValid
        ? '> MATCH FOUND — Certificate verified successfully. ✓'
        : '> NO MATCH — Token not found in registry. ✗'
      ]);
    }, MOCK_LOGS.length * 500 + 400);
  };

  const reset = () => { setStatus(STATUS.idle); setLogs([]); setToken(''); };

  return (
    <div className="min-h-screen pt-20 pb-16 px-6" style={{ background: '#070A13' }}>
      <div className="max-w-2xl mx-auto space-y-8">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 font-mono" style={{ fontSize: '11px', color: '#94A3B8' }}>
          <Link to="/portal" className="flex items-center gap-1 no-underline transition-colors"
            style={{ color: '#94A3B8' }}
            onMouseEnter={e => e.currentTarget.style.color = '#AD5CFF'}
            onMouseLeave={e => e.currentTarget.style.color = '#94A3B8'}>
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
          <h1 className="text-2xl font-extrabold text-white uppercase">Verify Certificate Token</h1>
          <p className="font-sans font-light" style={{ fontSize: '12px', color: '#94A3B8' }}>
            Enter your alpha-numeric token (e.g. PU-AWS-2026-X77) to verify against the central registry.
          </p>
        </div>

        {/* Input form */}
        <div className="rounded-xl border p-6 space-y-4 font-mono"
          style={{ background: '#111827', borderColor: '#1E293B' }}>
          <label className="block font-bold uppercase tracking-widest text-white" style={{ fontSize: '10px' }}>
            CERTIFICATE_TOKEN_INPUT
          </label>
          <input
            value={token}
            onChange={e => setToken(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && status === STATUS.idle && verify()}
            placeholder="PU-AWS-2026-XXXX"
            disabled={status === STATUS.loading}
            className="w-full rounded-md border px-4 py-3 font-mono outline-none transition-all"
            style={{
              fontSize: '13px',
              background: '#070A13',
              borderColor: status === STATUS.valid ? '#22C55E'
                : status === STATUS.invalid ? '#EF4444'
                : '#1E293B',
              color: '#E2E8F0',
              caretColor: '#AD5CFF',
              letterSpacing: '0.1em',
            }}
            spellCheck={false}
            autoComplete="off"
          />
          <button
            onClick={status === STATUS.idle ? verify : reset}
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
              boxShadow: '0 0 20px rgba(173,92,255,0.12)',
            }}>
            {status === STATUS.loading && <Loader size={13} className="animate-spin" />}
            {status === STATUS.idle && 'Verify System Pipeline'}
            {status === STATUS.loading && 'Processing...'}
            {status === STATUS.valid && <><ShieldCheck size={13} /> Verified — Run Another</>}
            {status === STATUS.invalid && <><AlertCircle size={13} /> Invalid — Try Again</>}
          </button>
        </div>

        {/* Terminal log output */}
        {logs.length > 0 && (
          <div className="rounded-xl border p-4 font-mono space-y-1"
            style={{ background: '#070A13', borderColor: '#1E293B' }}>
            <p className="font-bold uppercase tracking-widest mb-3" style={{ fontSize: '9px', color: '#94A3B8' }}>
              PIPELINE_OUTPUT_LOG
            </p>
            {logs.map((line, i) => (
              <p key={i} style={{
                fontSize: '12px',
                margin: 0,
                color: line.includes('✓') ? '#22C55E'
                  : line.includes('✗') ? '#EF4444'
                  : '#06B6D4',
              }}>
                {line}
              </p>
            ))}
          </div>
        )}

        {/* Result card */}
        {(status === STATUS.valid || status === STATUS.invalid) && (
          <div className="rounded-xl border p-5 font-mono flex items-start gap-4"
            style={{
              background: status === STATUS.valid ? 'rgba(34,197,94,0.05)' : 'rgba(239,68,68,0.05)',
              borderColor: status === STATUS.valid ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)',
            }}>
            {status === STATUS.valid
              ? <ShieldCheck size={20} style={{ color: '#22C55E', flexShrink: 0 }} />
              : <AlertCircle size={20} style={{ color: '#EF4444', flexShrink: 0 }} />}
            <div className="space-y-1">
              <p className="font-bold uppercase text-white" style={{ fontSize: '11px' }}>
                {status === STATUS.valid ? 'CREDENTIAL_VERIFIED' : 'CREDENTIAL_NOT_FOUND'}
              </p>
              <p className="font-sans font-light" style={{ fontSize: '11px', color: '#94A3B8' }}>
                {status === STATUS.valid
                  ? `Token "${token.toUpperCase()}" matched the PU credential registry. Certificate is authentic.`
                  : `Token "${token}" was not found. Check spelling or contact awssbgpu@gmail.com.`}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
