import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Users, Zap, FlaskConical } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import ShapeGrid from './ShapeGrid';

const stats = [
  { icon: Users,        value: '+500', label: 'Active Builders' },
  { icon: Zap,          value: '10+',  label: 'Events Hosted'   },
  { icon: FlaskConical, value: '100%', label: 'Production Labs' },
];

export function Hero() {
  const { dark } = useTheme();
  const canvasRef = useRef(null);

  const forwardMouse = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.dispatchEvent(new MouseEvent(e.type, { clientX: e.clientX, clientY: e.clientY, bubbles: false }));
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center pt-14 overflow-hidden"
      onMouseMove={forwardMouse}
      onMouseLeave={forwardMouse}
    >

      {/* ShapeGrid background */}
      <div className="absolute inset-0 z-0">
        <ShapeGrid
          ref={canvasRef}
          speed={0}
          squareSize={40}
          direction="diagonal"
          borderColor="#2F293A"
          hoverFillColor="#d34af9"
          shape="square"
          hoverTrailAmount={6}
        />
      </div>

      {/* Ambient orbs */}
      <div className="absolute top-1/3 left-1/4 w-80 h-80 rounded-full pointer-events-none z-0"
        style={{ background: 'radial-gradient(circle, rgba(173,92,255,0.08) 0%, transparent 70%)', filter: 'blur(50px)' }} />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full pointer-events-none z-0"
        style={{ background: 'radial-gradient(circle, rgba(249,115,24,0.06) 0%, transparent 70%)', filter: 'blur(50px)' }} />

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* ── Left ── */}
          <div className="space-y-6 flex flex-col">

            <div className="inline-flex items-center self-start px-3 py-1.5 rounded-md border font-mono font-bold uppercase"
              style={{ fontSize: '10px', letterSpacing: '0.1em', background: 'var(--surface-low)', borderColor: 'var(--border-muted)', color: '#AD5CFF' }}>
              AWS SBG at Parul University
            </div>

            <h1 className="font-extrabold tracking-tight uppercase leading-[1.05]"
              style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: 'var(--text-primary)' }}>
              <span className="text-shimmer">Build the Future</span><br />
              <span className="text-shimmer">With Cloud &amp; Generative AI</span>
            </h1>

            <p className="font-sans font-light leading-relaxed"
              style={{ fontSize: '0.9rem', color: 'var(--text-muted)', maxWidth: '480px' }}>
              Parul University's premier cloud engineering community. We bridge standard engineering
              curriculums with modern cloud architecture, serverless computing, and production-ready
              pipelines — turning student developers into builders who ship.
            </p>

            {/* Stat pills */}
            <div className="flex flex-wrap gap-3">
              {stats.map(({ icon: Icon, value, label }) => (
                <div key={label} className="flex items-center gap-2 px-4 py-2 rounded-md border font-mono"
                  style={{ background: 'var(--surface-low)', borderColor: 'var(--border-muted)', fontSize: '11px' }}>
                  <Icon size={13} style={{ color: '#AD5CFF' }} />
                  <span className="font-bold" style={{ color: 'var(--text-primary)' }}>{value}</span>
                  <span style={{ color: 'var(--text-muted)' }}>{label}</span>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 font-mono">
              <Link to="/events"
                className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-md text-white font-bold uppercase transition-all no-underline"
                style={{ fontSize: '11px', letterSpacing: '0.08em', background: '#AD5CFF', boxShadow: '0 0 24px rgba(173,92,255,0.2)' }}
                onMouseEnter={e => e.currentTarget.style.background = '#9C47FF'}
                onMouseLeave={e => e.currentTarget.style.background = '#AD5CFF'}>
                View Events <ArrowUpRight size={13} />
              </Link>
              <Link to="/about"
                className="inline-flex items-center justify-center px-7 py-3 rounded-md font-bold uppercase transition-all no-underline"
                style={{ fontSize: '11px', letterSpacing: '0.08em', background: 'var(--surface-low)', border: '1px solid var(--border-muted)', color: 'var(--text-primary)' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-mid)'}
                onMouseLeave={e => e.currentTarget.style.background = 'var(--surface-low)'}>
                About Us
              </Link>
            </div>
          </div>

          {/* ── Right: Hero image ── */}
          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 rounded-2xl pointer-events-none"
              style={{ background: 'radial-gradient(circle at center, rgba(173,92,255,0.12) 0%, transparent 70%)', filter: 'blur(20px)' }} />

            {/* Corner brackets */}
            <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 rounded-tl-md" style={{ borderColor: '#AD5CFF' }} />
            <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 rounded-tr-md" style={{ borderColor: '#F97316' }} />
            <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 rounded-bl-md" style={{ borderColor: '#F97316' }} />
            <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 rounded-br-md" style={{ borderColor: '#AD5CFF' }} />

            <img
              src="/Hero.jpg"
              alt="AWS SBG Parul University Community"
              className="relative z-10 w-full rounded-xl object-cover"
              style={{
                maxHeight: '520px',
                border: `1px solid ${dark ? '#1E293B' : '#CBD5E1'}`,
                boxShadow: dark
                  ? '0 0 40px rgba(173,92,255,0.1), 0 20px 60px rgba(0,0,0,0.4)'
                  : '0 20px 60px rgba(0,0,0,0.12)',
              }}
            />

            {/* Floating badge */}
            <div className="absolute -bottom-3 -right-3 z-20 flex items-center gap-2 px-3 py-2 rounded-md border font-mono"
              style={{ background: 'var(--surface-low)', borderColor: '#AD5CFF', boxShadow: '0 0 20px rgba(173,92,255,0.2)', fontSize: '10px' }}>
              <span style={{ color: '#AD5CFF' }}>◉</span>
              <span className="font-bold" style={{ color: 'var(--text-primary)' }}>AWS SCD '25</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
