import React from 'react';
import { Hero } from '../components/Hero';
import { MetricsGrid } from '../components/MetricsGrid';
import { UpcomingEvents, PastEvents, CommunityCollabs } from '../components/HomeSections';
import { Leadership } from '../components/Leadership';

export default function HomePage() {
  return (
    <main>
      <Hero />
      <MetricsGrid />
      <UpcomingEvents />
      <PastEvents />
      <CommunityCollabs />
      <Leadership />
    </main>
  );
}
