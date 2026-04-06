'use client';

import { useState } from 'react';

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

  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        width: '100vw',
        overflow: 'hidden',
        background: darkMode ? '#0d1117' : '#f0f4f0',
        fontFamily: "'Space Grotesk', sans-serif",
        transition: 'background 0.3s',
      }}
    >
      <DashboardSidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((prev) => !prev)}
        dark={darkMode}
      />

      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          minWidth: 0,
        }}
      >
        <DashboardHeader
          dark={darkMode}
          onToggleDark={() => setDarkMode((prev) => !prev)}
        />

        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            overflowX: 'hidden',
            padding: '28px 28px 40px',
            background: darkMode ? '#0d1117' : '#f0f4f0',
            transition: 'background 0.3s',
          }}
        >
          <div style={{ marginBottom: 24 }}>
            <h1
              style={{
                fontSize: 32,
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
              gridTemplateColumns: '1fr 280px 260px',
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
              gridTemplateColumns: '1fr 280px 220px',
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