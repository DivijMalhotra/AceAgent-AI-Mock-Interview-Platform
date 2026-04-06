'use client';

import { useState, useEffect } from 'react';

import DashboardSidebar from './DashboardSidebar';
import DashboardHeader from './DashboardHeader';
import StatsRow from './StatsRow';
import ScoreTrendChart from './ScoreTrendChart';
import UpcomingInterview from './UpcomingInterview';
import RecentAnalysis from './RecentAnalysis';
import AIFeedbackPanel from './AIFeedbackPanel';
import ReadinessScore from './ReadinessScore';
import PracticeDuration from './PracticeDuration';

export default function DashboardPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const isMob = width < 768;
      const isTab = width >= 768 && width < 1200;
      
      setIsMobile(isMob);
      setIsTablet(isTab);
      
      if (isMob || isTab) {
        setSidebarCollapsed(true);
      } else {
        setSidebarCollapsed(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const gridTemplateColumns = isMobile
    ? '1fr'
    : isTablet
    ? '1fr 1fr'
    : '1fr 300px 280px';

  const secondaryGridColumns = isMobile
    ? '1fr'
    : isTablet
    ? '1fr 1fr'
    : '1fr 300px 240px';

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        width: '100vw',
        background: darkMode ? '#050816' : '#f0f4f0',
        fontFamily: "'Space Grotesk', sans-serif",
        transition: 'background 0.3s',
      }}
    >
      <DashboardSidebar
        collapsed={sidebarCollapsed}
        isMobile={isMobile}
        onToggle={() => setSidebarCollapsed((prev) => !prev)}
        dark={darkMode}
      />

      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
        }}
      >
        <DashboardHeader
          dark={darkMode}
          isMobile={isMobile}
          onToggleDark={() => setDarkMode((prev) => !prev)}
          onToggleSidebar={() => setSidebarCollapsed((prev) => !prev)}
        />

        <div
          style={{
            flex: 1,
            padding: isMobile ? '20px 16px' : '28px 28px 40px',
            background: darkMode ? '#050816' : '#f0f4f0',
            transition: 'background 0.3s',
          }}
        >
          <div style={{ marginBottom: 24, textAlign: isMobile ? 'center' : 'left' }}>
            <h1
              style={{
                fontSize: isMobile ? 26 : 32,
                fontWeight: 800,
                color: darkMode ? '#f1f5f9' : '#0f172a',
                margin: 0,
                letterSpacing: -0.5,
              }}
            >
              Dashboard
            </h1>
            <p
              style={{
                color: darkMode ? '#64748b' : '#6b7280',
                fontSize: 14,
                marginTop: 4,
                marginBottom: 0,
              }}
            >
              Track your interview prep, scores, and AI-powered feedback.
            </p>
          </div>

          <StatsRow dark={darkMode} />

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: gridTemplateColumns,
              gap: 20,
              marginTop: 20,
            }}
          >
            <ScoreTrendChart dark={darkMode} />
            <UpcomingInterview dark={darkMode} />
            <RecentAnalysis dark={darkMode} />
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: secondaryGridColumns,
              gap: 20,
              marginTop: 20,
            }}
          >
            <AIFeedbackPanel dark={darkMode} />
            <ReadinessScore dark={darkMode} />
            <PracticeDuration dark={darkMode} />
          </div>
        </div>
      </div>
    </div>
  );
}