'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLoadingStore } from '@/lib/loadingStore';

import Navbar from '@/components/layout/Navbar';
import HeroSection from '@/components/sections/HeroSection';
import WorkspaceSection from '@/components/sections/WorkspaceSection';
import AgencySection from '@/components/sections/AgencySection';
import DashboardSection from '@/components/sections/DashboardSection';
import MockInterviewSection from '@/components/sections/MockInterviewSection';
import AIFeedbackSection from '@/components/sections/AIFeedbackSection';
import TestimonialSection from '@/components/sections/TestimonialSection';
import PricingSection from '@/components/sections/PricingSection';
import CTAFooterSection from '@/components/sections/CTAFooterSection';
import PageLoader from '@/components/ui/PageLoader';

export default function Home() {
  const [loaded, setLoaded] = useState(false);
  const reset = useLoadingStore((s) => s.reset);

  /* Reset loading flags every time the home page mounts so the
     PageLoader waits for the 3D model to actually re-initialise */
  useEffect(() => {
    reset();
  }, [reset]);

  const handleComplete = useCallback(() => {
    setLoaded(true);
  }, []);

  return (
    <>
      <PageLoader onComplete={handleComplete} />

      <AnimatePresence>
        {loaded && (
          <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            style={{ background: '#050816' }}
          >
            <Navbar />
            <HeroSection />
            <div className="section-divider" />
            <WorkspaceSection />
            <div className="section-divider" />
            <AgencySection />
            <div className="section-divider" />
            <DashboardSection />
            <div className="section-divider" />
            <MockInterviewSection />
            <div className="section-divider" />
            <AIFeedbackSection />
            <div className="section-divider" />
            <TestimonialSection />
            <div className="section-divider" />
            <PricingSection />
            <CTAFooterSection />
          </motion.main>
        )}
      </AnimatePresence>
    </>
  );
}