import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Award, CheckCircle, Upload, Loader } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const certs = [
  'AWS Certified Cloud Practitioner (CLF-C02)',
  'AWS Certified Solutions Architect – Associate',
  'AWS Certified Developer – Associate',
  'AWS Certified SysOps Administrator – Associate',
  'AWS Certified AI Practitioner',
  'Any other AWS Certification',
];

const steps = [
  { n: '01', label: 'Pass your exam', desc: 'Complete any official AWS certification exam.' },
  { n: '02', label: 'Fill this form', desc: 'Submit your details, certification name, and badge link below.' },
  { n: '03', label: 'Get recognised', desc: 'We verify and feature you in our certified builders directory.' },
];

export default function CertifyPage() {
  const { dark } = useTheme();
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    parul_email: '',
    mobile: '',
    enrolment: '',
    department: '',
    semester: '',
    institute: '',
    exam_date: '',
    cert_title: '',
    credly_link: '',
  });

  const [resultFile, setResultFile] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file && file.size > 1024 * 1024) {
      setError(`${type} file size must be less than 1MB`);
      return;
    }
    if (type === 'result') setResultFile(file);
    if (type === 'photo') setPhotoFile(file);
    setError('');
  };

  const uploadFile = async (file, bucket, path) => {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, { upsert: true });
    
    if (error) throw error;
    
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);
    
    return publicUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      let resultUrl = null;
      let photoUrl = null;

      // Upload files if provided
      if (resultFile) {
        const resultPath = `results/${Date.now()}_${resultFile.name}`;
        resultUrl = await uploadFile(resultFile, 'certifications', resultPath);
      }

      if (photoFile) {
        const photoPath = `photos/${Date.now()}_${photoFile.name}`;
        photoUrl = await uploadFile(photoFile, 'certifications', photoPath);
      }

      // Insert certification data
      const { error: insertError } = await supabase
        .from('certifications')
        .insert([{
          ...formData,
          result_url: resultUrl,
          photo_url: photoUrl,
          status: 'pending',
        }]);

      if (insertError) throw insertError;

      setSuccess(true);
      setFormData({
        email: '',
        name: '',
        parul_email: '',
        mobile: '',
        enrolment: '',
        department: '',
        semester: '',
        institute: '',
        exam_date: '',
        cert_title: '',
        credly_link: '',
      });
      setResultFile(null);
      setPhotoFile(null);

      // Reset form
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      console.error('Submission error:', err);
      setError(err.message || 'Failed to submit certification. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-20" style={{ background: 'var(--bg)' }}>

      {/* Banner */}
      <div className="relative overflow-hidden border-b" style={{ borderColor: 'var(--border-muted)' }}>
        <div className="site-grid-pattern absolute inset-0 pointer-events-none opacity-60" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-48 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(173,92,255,0.09) 0%, transparent 70%)', filter: 'blur(40px)' }} />
        <div className="relative z-10 max-w-5xl mx-auto px-6 py-16 text-center space-y-3">
          <p className="font-mono font-bold uppercase tracking-widest" style={{ fontSize: '10px', color: '#AD5CFF' }}>
            CERTIFIED BUILDERS :: AWS_SBG_PU
          </p>
          <h1 className="font-extrabold uppercase text-3xl md:text-4xl" style={{ color: 'var(--text-primary)' }}>
            Submit Your Certification
          </h1>
          <p className="font-sans font-light leading-relaxed mx-auto"
            style={{ fontSize: '14px', color: 'var(--text-muted)', maxWidth: '500px' }}>
            Passed an AWS exam? Submit your details and get recognised as a certified builder in our community.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 pt-12 space-y-12">

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {steps.map(({ n, label, desc }) => (
            <div key={n} className="rounded-xl border p-5 flex gap-4 items-start transition-all"
              style={{ background: 'var(--card-bg)', borderColor: 'var(--border-muted)' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(173,92,255,0.4)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-muted)'}>
              <span className="font-mono font-black flex-shrink-0 leading-none mt-0.5"
                style={{ fontSize: '22px', color: '#AD5CFF', opacity: 0.4 }}>
                {n}
              </span>
              <div>
                <p className="font-mono font-bold uppercase mb-1" style={{ fontSize: '11px', color: 'var(--text-primary)' }}>
                  {label}
                </p>
                <p className="font-sans font-light leading-relaxed" style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  {desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Eligible certs */}
        <div className="rounded-xl border p-6" style={{ background: 'var(--card-bg)', borderColor: 'var(--border-muted)' }}>
          <h2 className="font-mono font-bold uppercase tracking-widest mb-4"
            style={{ fontSize: '10px', color: 'var(--text-primary)' }}>
            <Award size={12} style={{ display: 'inline', color: '#F97316', marginRight: '6px' }} />
            ELIGIBLE CERTIFICATIONS
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {certs.map(c => (
              <div key={c} className="flex items-center gap-2"
                style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                <CheckCircle size={13} style={{ color: '#22C55E', flexShrink: 0 }} />
                <span className="font-sans">{c}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic Form */}
        <div className="rounded-xl border overflow-hidden" style={{ background: 'var(--card-bg)', borderColor: 'var(--border-muted)' }}>
          
          {/* Form header */}
          <div className="flex items-center justify-between px-5 py-3 border-b"
            style={{ background: 'var(--surface-low)', borderColor: 'var(--border-muted)' }}>
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                {['#FF5F57','#FEBC2E','#28C840'].map(c => (
                  <span key={c} className="w-3 h-3 rounded-full inline-block" style={{ background: c }} />
                ))}
              </div>
              <span className="font-mono font-bold uppercase ml-2"
                style={{ fontSize: '9px', color: 'var(--text-subtle)' }}>
                aws-sbg-pu — certification-submission
              </span>
            </div>
          </div>

          {/* Success Message */}
          {success && (
            <div className="mx-6 mt-6 px-4 py-3 rounded-lg border"
              style={{ background: 'rgba(34,197,94,0.08)', borderColor: 'rgba(34,197,94,0.3)', color: '#22C55E' }}>
              <p className="font-sans text-sm flex items-center gap-2">
                <CheckCircle size={16} /> Certification submitted successfully! Our team will review it soon.
              </p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mx-6 mt-6 px-4 py-3 rounded-lg border"
              style={{ background: 'rgba(239,68,68,0.08)', borderColor: 'rgba(239,68,68,0.3)', color: '#EF4444' }}>
              <p className="font-sans text-sm">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            
            {/* Email */}
            <div className="space-y-2">
              <label className="font-mono font-bold uppercase block" style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                Email <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                className="w-full px-4 py-2.5 rounded-lg border font-sans"
                style={{ fontSize: '13px', background: 'var(--surface-low)', borderColor: 'var(--border-muted)', color: 'var(--text-primary)' }}
              />
            </div>

            {/* Full Name */}
            <div className="space-y-2">
              <label className="font-mono font-bold uppercase block" style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                Your Full Name <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full px-4 py-2.5 rounded-lg border font-sans"
                style={{ fontSize: '13px', background: 'var(--surface-low)', borderColor: 'var(--border-muted)', color: 'var(--text-primary)' }}
              />
            </div>

            {/* Parul Email */}
            <div className="space-y-2">
              <label className="font-mono font-bold uppercase block" style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                Parul Email Address <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <input
                type="email"
                name="parul_email"
                required
                value={formData.parul_email}
                onChange={handleChange}
                placeholder="your@paruluniversity.ac.in"
                className="w-full px-4 py-2.5 rounded-lg border font-sans"
                style={{ fontSize: '13px', background: 'var(--surface-low)', borderColor: 'var(--border-muted)', color: 'var(--text-primary)' }}
              />
            </div>

            {/* Mobile & Enrolment - Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="font-mono font-bold uppercase block" style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                  Mobile No <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <input
                  type="tel"
                  name="mobile"
                  required
                  value={formData.mobile}
                  onChange={handleChange}
                  placeholder="9876543210"
                  className="w-full px-4 py-2.5 rounded-lg border font-sans"
                  style={{ fontSize: '13px', background: 'var(--surface-low)', borderColor: 'var(--border-muted)', color: 'var(--text-primary)' }}
                />
              </div>
              
              <div className="space-y-2">
                <label className="font-mono font-bold uppercase block" style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                  Enrolment No <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <input
                  type="text"
                  name="enrolment"
                  required
                  value={formData.enrolment}
                  onChange={handleChange}
                  placeholder="22012345678901"
                  className="w-full px-4 py-2.5 rounded-lg border font-sans"
                  style={{ fontSize: '13px', background: 'var(--surface-low)', borderColor: 'var(--border-muted)', color: 'var(--text-primary)' }}
                />
              </div>
            </div>

            {/* Department & Semester - Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="font-mono font-bold uppercase block" style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                  Department <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <input
                  type="text"
                  name="department"
                  required
                  value={formData.department}
                  onChange={handleChange}
                  placeholder="Computer Engineering"
                  className="w-full px-4 py-2.5 rounded-lg border font-sans"
                  style={{ fontSize: '13px', background: 'var(--surface-low)', borderColor: 'var(--border-muted)', color: 'var(--text-primary)' }}
                />
              </div>
              
              <div className="space-y-2">
                <label className="font-mono font-bold uppercase block" style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                  Semester <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <input
                  type="text"
                  name="semester"
                  required
                  value={formData.semester}
                  onChange={handleChange}
                  placeholder="5"
                  className="w-full px-4 py-2.5 rounded-lg border font-sans"
                  style={{ fontSize: '13px', background: 'var(--surface-low)', borderColor: 'var(--border-muted)', color: 'var(--text-primary)' }}
                />
              </div>
            </div>

            {/* Institute */}
            <div className="space-y-2">
              <label className="font-mono font-bold uppercase block" style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                Institute <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <input
                type="text"
                name="institute"
                required
                value={formData.institute}
                onChange={handleChange}
                placeholder="Parul Institute of Engineering & Technology"
                className="w-full px-4 py-2.5 rounded-lg border font-sans"
                style={{ fontSize: '13px', background: 'var(--surface-low)', borderColor: 'var(--border-muted)', color: 'var(--text-primary)' }}
              />
            </div>

            {/* Exam Date */}
            <div className="space-y-2">
              <label className="font-mono font-bold uppercase block" style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                Date of Exam <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <input
                type="date"
                name="exam_date"
                required
                value={formData.exam_date}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border font-sans"
                style={{ fontSize: '13px', background: 'var(--surface-low)', borderColor: 'var(--border-muted)', color: 'var(--text-primary)' }}
              />
            </div>

            {/* Certification Title */}
            <div className="space-y-2">
              <label className="font-mono font-bold uppercase block" style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                Certification Title <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <input
                type="text"
                name="cert_title"
                required
                value={formData.cert_title}
                onChange={handleChange}
                placeholder="AWS Certified Cloud Practitioner"
                className="w-full px-4 py-2.5 rounded-lg border font-sans"
                style={{ fontSize: '13px', background: 'var(--surface-low)', borderColor: 'var(--border-muted)', color: 'var(--text-primary)' }}
              />
            </div>

            {/* Result Upload */}
            <div className="space-y-2">
              <label className="font-mono font-bold uppercase block" style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                Your Result (Contains Marks) <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  required
                  onChange={(e) => handleFileChange(e, 'result')}
                  className="w-full px-4 py-2.5 rounded-lg border font-sans"
                  style={{ fontSize: '13px', background: 'var(--surface-low)', borderColor: 'var(--border-muted)', color: 'var(--text-primary)' }}
                />
              </div>
              <p className="font-sans text-xs" style={{ color: 'var(--text-subtle)' }}>Max 1 MB. PDF, JPG, or PNG</p>
            </div>

            {/* Credly Link */}
            <div className="space-y-2">
              <label className="font-mono font-bold uppercase block" style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                Credly Link <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <input
                type="url"
                name="credly_link"
                required
                value={formData.credly_link}
                onChange={handleChange}
                placeholder="https://www.credly.com/badges/..."
                className="w-full px-4 py-2.5 rounded-lg border font-sans"
                style={{ fontSize: '13px', background: 'var(--surface-low)', borderColor: 'var(--border-muted)', color: 'var(--text-primary)' }}
              />
            </div>

            {/* Photo Upload */}
            <div className="space-y-2">
              <label className="font-mono font-bold uppercase block" style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                Your Professional Photograph <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <input
                type="file"
                accept="image/*"
                required
                onChange={(e) => handleFileChange(e, 'photo')}
                className="w-full px-4 py-2.5 rounded-lg border font-sans"
                style={{ fontSize: '13px', background: 'var(--surface-low)', borderColor: 'var(--border-muted)', color: 'var(--text-primary)' }}
              />
              <p className="font-sans text-xs" style={{ color: 'var(--text-subtle)' }}>Max 1 MB. Image files only</p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 rounded-lg font-mono font-bold uppercase text-white transition-all flex items-center justify-center gap-2"
              style={{
                fontSize: '11px',
                background: submitting ? '#9C47FF' : '#AD5CFF',
                cursor: submitting ? 'not-allowed' : 'pointer',
                boxShadow: '0 0 24px rgba(173,92,255,0.2)',
                opacity: submitting ? 0.7 : 1,
              }}>
              {submitting ? (
                <>
                  <Loader size={14} className="animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Certification'
              )}
            </button>
          </form>
        </div>

        {/* Note */}
        <p className="text-center font-sans font-light" style={{ fontSize: '12px', color: 'var(--text-subtle)' }}>
          Your submission will be reviewed by our social media team. We'll reach out once it's approved!
        </p>
      </div>
    </div>
  );
}
