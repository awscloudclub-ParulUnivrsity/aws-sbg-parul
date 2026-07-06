import React, { useState, useRef, useEffect } from 'react';
import { Terminal } from 'lucide-react';

const BOOT_LINES = [
  '> INIT AWS_SBG_PORTAL :: PARUL_UNIVERSITY_NODE',
  '> Loading member registry... OK',
  '> Type a command or click a shortcut below.',
];

const COMMANDS = {
  help: [
    '  status      — View your current sprint status',
    '  events      — List upcoming sprints & events',
    '  team        — Show core team members',
    '  cert        — Check certification readiness',
    '  clear       — Clear terminal',
  ],
  status: [
    '  Member       : [authenticated]',
    '  Sprint       : PU_CLF_C02 — Week 2 of 3',
    '  Progress     : 75% COMPLETE ████████████░░░░',
    '  Module       : Serverless Computing',
    '  Next Session : SAT, JUNE 20, 2026',
  ],
  events: [
    '  [UPCOMING] AWS Cloud Ignite \'26 — Parul Campus',
    '  Date         : SAT, JUNE 20, 2026',
    '  Location     : Seminar Hall, CS Block',
    '  Status       : REGISTRATIONS OPEN ◉',
    '  Contact      : awssbgpu@gmail.com',
  ],
  team: [
    '  Chapter Lead : Manish — Cloud Architect',
    '  DevOps Lead  : Priya Sharma',
    '  Full-Stack   : Arjun Patel',
    '  Security     : Neha Verma',
    '  ML / AI      : Rishi Mehta',
    '  Community    : Kavya Nair',
  ],
  cert: [
    '  Target       : AWS CLF-C02 (Cloud Practitioner)',
    '  Readiness    : 68% ████████████░░░░░░',
    '  Modules Done : IAM, S3, EC2, Billing',
    '  Remaining    : Lambda, VPC, CloudFront',
    '  Est. Ready   : END OF SPRINT 3',
  ],
};

export function TerminalConsole() {
  const [lines, setLines] = useState(BOOT_LINES);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([]);
  const [histIdx, setHistIdx] = useState(-1);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lines]);

  const runCommand = (cmd) => {
    const trimmed = cmd.trim().toLowerCase();
    if (!trimmed) return;
    const newLines = [`$ ${trimmed}`];
    if (trimmed === 'clear') {
      setLines(BOOT_LINES);
      setInput('');
      setHistory(h => [cmd, ...h]);
      setHistIdx(-1);
      return;
    }
    if (COMMANDS[trimmed]) {
      newLines.push(...COMMANDS[trimmed]);
    } else {
      newLines.push(`  bash: ${trimmed}: command not found. Type 'help' for commands.`);
    }
    setLines(l => [...l, ...newLines]);
    setHistory(h => [cmd, ...h]);
    setHistIdx(-1);
    setInput('');
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter') { runCommand(input); }
    else if (e.key === 'ArrowUp') {
      const idx = Math.min(histIdx + 1, history.length - 1);
      setHistIdx(idx);
      setInput(history[idx] ?? '');
    } else if (e.key === 'ArrowDown') {
      const idx = Math.max(histIdx - 1, -1);
      setHistIdx(idx);
      setInput(idx === -1 ? '' : history[idx]);
    }
  };

  return (
    <div className="rounded-xl border overflow-hidden font-mono"
      style={{ background: '#070A13', borderColor: '#1E293B' }}>

      {/* Terminal title bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b"
        style={{ background: '#111827', borderColor: '#1E293B' }}>
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            {['#FF5F57', '#FEBC2E', '#28C840'].map(c => (
              <span key={c} className="w-3 h-3 rounded-full inline-block" style={{ background: c }} />
            ))}
          </div>
          <span className="font-bold uppercase" style={{ fontSize: '10px', color: '#94A3B8', marginLeft: '8px' }}>
            aws-sbg-pu — member-portal — bash
          </span>
        </div>
        <Terminal size={13} style={{ color: '#AD5CFF' }} />
      </div>

      {/* Output */}
      <div className="p-4 h-72 overflow-y-auto space-y-1 cursor-text"
        onClick={() => inputRef.current?.focus()}>
        {lines.map((line, i) => (
          <p key={i} className="leading-relaxed"
            style={{
              fontSize: '12px',
              color: line.startsWith('$') ? '#E2E8F0' : line.startsWith('>') ? '#06B6D4' : '#94A3B8',
              margin: 0,
            }}>
            {line}
          </p>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input row */}
      <div className="flex items-center gap-2 px-4 py-3 border-t" style={{ borderColor: '#1E293B' }}>
        <span style={{ fontSize: '12px', color: '#AD5CFF', fontWeight: 700 }}>$</span>
        <input
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="type a command..."
          className="flex-1 bg-transparent outline-none border-none font-mono"
          style={{ fontSize: '12px', color: '#E2E8F0', caretColor: '#AD5CFF' }}
          spellCheck={false}
          autoComplete="off"
        />
      </div>

      {/* Quick-launch shortcuts */}
      <div className="flex flex-wrap gap-2 px-4 pb-4">
        {Object.keys(COMMANDS).map(cmd => (
          <button key={cmd}
            className="px-3 py-1 rounded border font-bold uppercase transition-all"
            style={{ fontSize: '9px', letterSpacing: '0.08em', background: 'rgba(173,92,255,0.05)', borderColor: 'rgba(173,92,255,0.2)', color: '#AD5CFF' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(173,92,255,0.15)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(173,92,255,0.05)'}
            onClick={() => runCommand(cmd)}>
            {cmd}
          </button>
        ))}
      </div>
    </div>
  );
}
