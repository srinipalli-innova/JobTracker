import React, { useState } from 'react';
import LeftPanel from './components/LeftPanel';
import RightPanel from './components/RightPanel';
import { applications, getStats, todayLabel } from './data/mockData';

export default function App() {
  const [selectedAppId, setSelectedAppId] = useState(applications[0].id);
  const [selectedJob, setSelectedJob]     = useState(null);

  const selectedApp = applications.find((a) => a.id === selectedAppId);
  const stats = getStats();

  const handleSelectApp = (id) => {
    setSelectedAppId(id);
    setSelectedJob(null);
  };

  return (
    <div className="app-root">
      {/* ── Top Header ── */}
      <header className="app-header">
        <div className="app-header__left">
          <span className="app-header__logo">⚙</span>
          <div>
            <span className="app-header__title">Job Tracker</span>
            <span className="app-header__sub">Database Pipeline Monitor</span>
          </div>
        </div>

        <div className="app-header__stats">
          <div className="stat-chip stat-chip--total">
            <span className="stat-chip__num">{stats.total}</span>
            <span className="stat-chip__lbl">Total Jobs</span>
          </div>
          <div className="stat-chip stat-chip--success">
            <span className="stat-chip__num">{stats.success}</span>
            <span className="stat-chip__lbl">Passed</span>
          </div>
          <div className="stat-chip stat-chip--fail">
            <span className="stat-chip__num">{stats.failed}</span>
            <span className="stat-chip__lbl">Failed</span>
          </div>
          <div className="stat-chip stat-chip--rate">
            <span className="stat-chip__num">
              {Math.round((stats.success / stats.total) * 100)}%
            </span>
            <span className="stat-chip__lbl">Success Rate</span>
          </div>
        </div>

        <div className="app-header__right">
          <span className="app-header__date">📅 {todayLabel}</span>
          {selectedApp && (
            <span className="app-header__active-app">{selectedApp.name}</span>
          )}
        </div>
      </header>

      {/* ── Body ── */}
      <div className="app-body">
        <LeftPanel
          applications={applications}
          selectedAppId={selectedAppId}
          onSelectApp={handleSelectApp}
          selectedJob={selectedJob}
          onSelectJob={setSelectedJob}
        />
        <RightPanel selectedJob={selectedJob} />
      </div>
    </div>
  );
}
