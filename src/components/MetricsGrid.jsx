import React from 'react';
import { Users, Terminal, Target } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const features = [
  { icon: Users,    label: '500+ BUILDERS ACTIVE', color: '#AD5CFF',
    text: 'Collaborating across sandbox systems, serverless instances, and developer hack clubs locally across Vadodara.' },
  { icon: Terminal, label: '3-WEEK SPRINTS CYCLE',  color: '#06B6D4',
    text: 'Moving from complete cloud beginners to AWS Certified Cloud Practitioner (CLF-C02) architectural readiness.' },
  { icon: Target,   label: '100% PRODUCTION LABS',  color: '#F97316',
    text: 'Building live products, implementing data layers, and automating deployment pipelines rather than parsing textbook slides.' },
];

export function MetricsGrid() {
  const { dark } = useTheme();

  return (
    <section id="about" className="py-20 border-t font-mono"
      style={{ borderColor: 'var(--border-muted)', background: dark ? 'rgba(17,24,39,0.3)' : 'rgba(241,245,249,0.6)' }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12 space-y-2">
          <p className="font-bold uppercase tracking-widest" style={{ fontSize: '10px', color: '#AD5CFF' }}>
            SYSTEM_METRICS :: COMMUNITY_NODES
          </p>
          <h2 className="text-2xl font-extrabold uppercase" style={{ color: 'var(--text-primary)' }}>
            What We Operate
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map(({ icon: Icon, label, text, color }) => (
            <div key={label}
              className="p-6 rounded-xl border text-left transition-all cursor-default"
              style={{ background: 'var(--card-bg)', borderColor: 'var(--border-muted)' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-active)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-muted)'}>
              <div className="mb-4 p-2 rounded-md border w-fit"
                style={{ background: 'var(--bg)', borderColor: 'var(--border-muted)', color }}>
                <Icon size={16} />
              </div>
              <h3 className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: 'var(--text-primary)' }}>
                {label}
              </h3>
              <p className="font-sans font-light leading-relaxed" style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                {text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
