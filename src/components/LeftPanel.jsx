import React, { useState } from 'react';
import { jobGroups, groupStatus, todayLabel, todayISO } from '../data/mockData';

function StatusDot({ status, size = 10 }) {
  const color =
    status === 'success' ? 'var(--success)' :
    status === 'failed'  ? 'var(--failure)' :
    'var(--warning)';
  return (
    <span
      style={{
        display: 'inline-block',
        width: size,
        height: size,
        minWidth: size,
        borderRadius: '50%',
        background: color,
        boxShadow: `0 0 6px ${color}88`,
      }}
    />
  );
}

function JobItem({ job, isSelected, onSelect }) {
  return (
    <div
      className={`job-item ${isSelected ? 'job-item--selected' : ''}`}
      onClick={() => onSelect(job)}
      title={job.name}
    >
      <StatusDot status={job.status} size={9} />
      <span className="job-item__name">{job.name}</span>
      {job.status === 'failed' && (
        <span className="job-item__badge job-item__badge--fail">FAIL</span>
      )}
    </div>
  );
}

function GroupItem({ group, selectedJobId, onSelectJob }) {
  const [expanded, setExpanded] = useState(false);
  const status = groupStatus(group);
  const failCount = group.jobs.filter((j) => j.status === 'failed').length;

  return (
    <div className="group-item">
      <div
        className="group-item__header"
        onClick={() => setExpanded((v) => !v)}
      >
        <span className="group-item__chevron">{expanded ? '▾' : '▸'}</span>
        <span className="group-item__icon">🗂</span>
        <span className="group-item__name" title={group.name}>{group.name}</span>
        <div className="group-item__meta">
          {failCount > 0 && (
            <span className="group-item__fail-count">{failCount}</span>
          )}
          <StatusDot status={status} size={10} />
        </div>
      </div>
      {expanded && (
        <div className="group-item__jobs">
          {group.jobs.map((job) => (
            <JobItem
              key={job.id}
              job={job}
              isSelected={selectedJobId === job.id}
              onSelect={onSelectJob}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function DateFolder({ selectedJobId, onSelectJob }) {
  const [expanded, setExpanded] = useState(false);
  const totalFailed = jobGroups.reduce(
    (acc, g) => acc + g.jobs.filter((j) => j.status === 'failed').length,
    0
  );
  const totalJobs = jobGroups.reduce((acc, g) => acc + g.jobs.length, 0);
  const totalSuccess = totalJobs - totalFailed;

  return (
    <div className="date-folder">
      <div
        className="date-folder__header"
        onClick={() => setExpanded((v) => !v)}
      >
        <span className="date-folder__chevron">{expanded ? '▾' : '▸'}</span>
        <span className="date-folder__icon">📅</span>
        <div className="date-folder__info">
          <span className="date-folder__label">{todayISO}</span>
          <span className="date-folder__sub">Today's Runs</span>
        </div>
        <span className="date-folder__toggle">{expanded ? '−' : '+'}</span>
      </div>

      {expanded && (
        <div className="date-folder__summary">
          <span className="summary-chip summary-chip--success">✓ {totalSuccess} passed</span>
          <span className="summary-chip summary-chip--fail">✗ {totalFailed} failed</span>
        </div>
      )}

      {expanded && (
        <div className="date-folder__groups">
          {jobGroups.map((group) => (
            <GroupItem
              key={group.id}
              group={group}
              selectedJobId={selectedJobId}
              onSelectJob={onSelectJob}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function LeftPanel({ applications, selectedAppId, onSelectApp, selectedJob, onSelectJob }) {
  return (
    <aside className="left-panel">
      {/* Application List */}
      <div className="panel-section">
        <div className="panel-section__title">Applications</div>
        <div className="app-list">
          {applications.map((app) => (
            <div
              key={app.id}
              className={`app-list__item ${selectedAppId === app.id ? 'app-list__item--active' : ''}`}
              onClick={() => onSelectApp(app.id)}
            >
              <span className="app-list__abbr">{app.abbr}</span>
              <span className="app-list__name">{app.name}</span>
              {selectedAppId === app.id && (
                <span className="app-list__arrow">›</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Job Tree */}
      {selectedAppId && (
        <div className="panel-section panel-section--tree">
          <div className="panel-section__title">Job Runs</div>
          <DateFolder
            selectedJobId={selectedJob?.id}
            onSelectJob={onSelectJob}
          />
        </div>
      )}
    </aside>
  );
}
