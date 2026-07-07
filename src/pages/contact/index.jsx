import React, { useState } from 'react';
import { Mail, MapPin, Send, CheckCircle } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const socials = [
  {
    label: 'LinkedIn',
    handle: 'AWS SBG Parul University',
    url: 'https://www.linkedin.com/company/aws-student-builder-group-parul-university/',
    color: '#0A66C2',
    icon: () => (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"/>
        <rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>
      </svg>
    ),
  },
  {
    label: 'Instagram',
    handle: '@aws.sbg_pu',
    url: 'https://www.instagram.com/aws.sbg_pu/',
    color: '#E1306C',
    icon: () => (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
        <circle cx="12" cy="12" r="4"/>
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
      </svg>
    ),
  },
  {
    label: 'GitHub',
    handle: 'awssbgpu',
    url: 'https://github.com',
    color: '#AD5CFF',
    icon: () => (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
      </svg>
    ),
  },
];

export default function ContactPage() {
  const { dark } = useTheme();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Opens mailto as a simple no-backend solution
    const mailto = `mailto:awscloudclub@paruluniversity.ac.in?subject=${encodeURIComponent(form.subject || 'Contact from Website')}&body=${encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`)}`;
    window.location.href = mailto;
    setSent(true);
  };

  const inputStyle = {
    width: '100%',
    background: 'var(--surface-low)',
    border: '1px solid var(--border-muted)',
    borderRadius: '6px',
    padding: '10px 14px',
    fontSize: '13px',
    color: 'var(--text-primary)',
    outline: 'none',
    fontFamily: 'inherit',
  };

  return (
    <div className="min-h-screen pt-20 pb-20" style={{ background: 'var(--bg)' }}>

      {/* Banner */}
      <div className="relative overflow-hidden border-b" style={{ borderColor: 'var(--border-muted)' }}>
        <div className="site-grid-pattern absolute inset-0 pointer-events-none opacity-60" />
        <div className="absolute bottom-0 left-1/2 w-96 h-48 rounded-full pointer-events-none -translate-x-1/2"
          style={{ background: 'radial-gradient(circle, rgba(173,92,255,0.08) 0%, transparent 70%)', filter: 'blur(40px)' }} />
        <div className="relative z-10 max-w-5xl mx-auto px-6 py-16 text-center space-y-3">
          <p className="font-mono font-bold uppercase tracking-widest" style={{ fontSize: '10px', color: '#AD5CFF' }}>
            GET IN TOUCH :: AWS_SBG_PU
          </p>
          <h1 className="font-extrabold uppercase text-3xl md:text-4xl" style={{ color: 'var(--text-primary)' }}>
            Contact Us
          </h1>
          <p className="font-sans font-light" style={{ fontSize: '14px', color: 'var(--text-muted)', maxWidth: '440px', margin: '0 auto' }}>
            Questions about events, membership, or collaborations? Reach out — we respond fast.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 pt-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">

          {/* ── Left info panel ── */}
          <div className="md:col-span-2 space-y-6">

            {/* Contact details */}
            <div className="rounded-xl border p-6 space-y-5"
              style={{ background: 'var(--card-bg)', borderColor: 'var(--border-muted)' }}>
              <h2 className="font-mono font-bold uppercase tracking-widest"
                style={{ fontSize: '10px', color: 'var(--text-primary)' }}>
                CONTACT INFO
              </h2>

              <div className="flex gap-3 items-start">
                <div className="w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(173,92,255,0.1)' }}>
                  <Mail size={14} style={{ color: '#AD5CFF' }} />
                </div>
                <div>
                  <p className="font-mono font-bold uppercase" style={{ fontSize: '9px', color: 'var(--text-subtle)' }}>Email</p>
                  <a href="mailto:awscloudclub@paruluniversity.ac.in"
                    className="font-sans no-underline transition-colors"
                    style={{ fontSize: '13px', color: 'var(--text-primary)' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#AD5CFF'}
                    onMouseLeave={e => e.currentTarget.style.color = 'var(--text-primary)'}>
                    awscloudclub@paruluniversity.ac.in
                  </a>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <div className="w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(249,115,24,0.1)' }}>
                  <MapPin size={14} style={{ color: '#F97316' }} />
                </div>
                <div>
                  <p className="font-mono font-bold uppercase" style={{ fontSize: '9px', color: 'var(--text-subtle)' }}>Location</p>
                  <p className="font-sans" style={{ fontSize: '13px', color: 'var(--text-primary)', lineHeight: 1.6 }}>
                    Parul University<br />
                    L103, C.V. Raman Building<br />
                    Vadodara, Gujarat, India
                  </p>
                </div>
              </div>
            </div>

            {/* Social links */}
            <div className="rounded-xl border p-6 space-y-4"
              style={{ background: 'var(--card-bg)', borderColor: 'var(--border-muted)' }}>
              <h2 className="font-mono font-bold uppercase tracking-widest"
                style={{ fontSize: '10px', color: 'var(--text-primary)' }}>
                FIND US ON
              </h2>
              {socials.map(({ label, handle, url, color, icon: Icon }) => (
                <a key={label} href={url} target="_blank" rel="noreferrer"
                  className="flex items-center justify-between p-3 rounded-md border no-underline transition-all group"
                  style={{ borderColor: 'var(--border-muted)', background: 'transparent' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = color + '60'; e.currentTarget.style.background = color + '08'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-muted)'; e.currentTarget.style.background = 'transparent'; }}>
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-md flex items-center justify-center"
                      style={{ background: color + '15', color }}>
                      <Icon />
                    </div>
                    <div>
                      <p className="font-mono font-bold uppercase" style={{ fontSize: '9px', color: 'var(--text-muted)' }}>{label}</p>
                      <p className="font-sans" style={{ fontSize: '12px', color: 'var(--text-primary)' }}>{handle}</p>
                    </div>
                  </div>
                  <span style={{ color: 'var(--text-subtle)', fontSize: '12px' }}>↗</span>
                </a>
              ))}
            </div>
          </div>

          {/* ── Right form ── */}
          <div className="md:col-span-3">
            <div className="rounded-xl border p-6 md:p-8"
              style={{ background: 'var(--card-bg)', borderColor: 'var(--border-muted)' }}>
              <h2 className="font-mono font-bold uppercase tracking-widest mb-6"
                style={{ fontSize: '10px', color: 'var(--text-primary)' }}>
                SEND A MESSAGE
              </h2>

              {sent ? (
                <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
                  <CheckCircle size={40} style={{ color: '#22C55E' }} />
                  <div>
                    <p className="font-bold font-mono uppercase" style={{ color: 'var(--text-primary)' }}>Message Ready</p>
                    <p className="font-sans font-light mt-1" style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                      Your email client should have opened. If not, email us directly at awscloudclub@paruluniversity.ac.in
                    </p>
                  </div>
                  <button onClick={() => setSent(false)}
                    className="font-mono font-bold uppercase px-4 py-2 rounded-md border transition-all"
                    style={{ fontSize: '10px', color: '#AD5CFF', borderColor: 'rgba(173,92,255,0.3)', background: 'rgba(173,92,255,0.05)' }}>
                    Send Another
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="font-mono font-bold uppercase" style={{ fontSize: '9px', color: 'var(--text-muted)' }}>
                        Your Name
                      </label>
                      <input
                        required
                        placeholder="Full name"
                        value={form.name}
                        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                        style={inputStyle}
                        onFocus={e => e.currentTarget.style.borderColor = '#AD5CFF'}
                        onBlur={e => e.currentTarget.style.borderColor = 'var(--border-muted)'}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="font-mono font-bold uppercase" style={{ fontSize: '9px', color: 'var(--text-muted)' }}>
                        Email Address
                      </label>
                      <input
                        required
                        type="email"
                        placeholder="you@example.com"
                        value={form.email}
                        onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                        style={inputStyle}
                        onFocus={e => e.currentTarget.style.borderColor = '#AD5CFF'}
                        onBlur={e => e.currentTarget.style.borderColor = 'var(--border-muted)'}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-mono font-bold uppercase" style={{ fontSize: '9px', color: 'var(--text-muted)' }}>
                      Subject
                    </label>
                    <input
                      placeholder="What's this about?"
                      value={form.subject}
                      onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                      style={inputStyle}
                      onFocus={e => e.currentTarget.style.borderColor = '#AD5CFF'}
                      onBlur={e => e.currentTarget.style.borderColor = 'var(--border-muted)'}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-mono font-bold uppercase" style={{ fontSize: '9px', color: 'var(--text-muted)' }}>
                      Message
                    </label>
                    <textarea
                      required
                      rows={6}
                      placeholder="Tell us about your query, idea, or collaboration proposal..."
                      value={form.message}
                      onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                      style={{ ...inputStyle, resize: 'vertical' }}
                      onFocus={e => e.currentTarget.style.borderColor = '#AD5CFF'}
                      onBlur={e => e.currentTarget.style.borderColor = 'var(--border-muted)'}
                    />
                  </div>

                  <button type="submit"
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-md font-mono font-bold uppercase text-white transition-all"
                    style={{ fontSize: '11px', background: '#AD5CFF', boxShadow: '0 0 20px rgba(173,92,255,0.2)' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#9C47FF'}
                    onMouseLeave={e => e.currentTarget.style.background = '#AD5CFF'}>
                    Send Message <Send size={13} />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
