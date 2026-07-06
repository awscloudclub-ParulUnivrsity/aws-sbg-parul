import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { MemberCard } from './MemberCard';
import { useTheme } from '../context/ThemeContext';

const MANISH = {
  slug: 'manish',
  name: 'Manish Kudtarkar',
  initial: 'MK',
  role: 'Student Builder Chapter Lead',
  title: 'Cloud Architect & Core Systems Program Lead',
  gradient: 'linear-gradient(135deg, #AD5CFF, #F97316)',
  linkedin: 'https://linkedin.com/in/manish',
  github: 'https://github.com/manish',
  photo: '/team/manish-kudtarkar.jpg',
  bio: 'Manish leads the AWS Student Builder Group at Parul University, driving the chapter mission to bridge traditional engineering education with production-grade cloud operations.',
  skills: ['AWS Lambda', 'EC2 & VPC', 'S3 & CloudFront', 'Serverless', 'DynamoDB', 'IAM & Security'],
  color: '#AD5CFF',
};

export function Leadership() {
  const { dark } = useTheme();

  return (
    <section id="team" className="py-20 border-t"
      style={{ borderColor: 'var(--border-muted)', background: dark ? 'rgba(17,24,39,0.3)' : 'rgba(241,245,249,0.6)' }}>
      <div className="max-w-6xl mx-auto px-6">

        <div className="text-center mb-12">
          <p className="font-mono font-bold uppercase tracking-widest mb-2"
            style={{ fontSize: '10px', color: '#AD5CFF' }}>
            TEAM :: CHAPTER LEAD
          </p>
          <h2 className="text-2xl font-extrabold uppercase mb-2" style={{ color: 'var(--text-primary)' }}>
            Guided by Builders
          </h2>
          <p className="font-sans" style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            The core driver steering our university developer community.
          </p>
        </div>

        {/* Single centered card */}
        <div className="flex justify-center">
          <div className="w-full max-w-xs">
            <MemberCard dev={MANISH} />
          </div>
        </div>
      </div>
    </section>
  );
}
