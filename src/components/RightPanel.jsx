import React from 'react';
import { jobGroups } from '../data/mockData';

function InfoCard({ title, children }) {
  return (
    <div className="info-card">
      <div className="info-card__title">{title}</div>
      <div className="info-card__body">{children}</div>
    </div>
  );
}

function InfoRow({ label, value, highlight }) {
  return (
    <div className="info-row">
      <span className="info-row__label">{label}</span>
      <span className={`info-row__value ${highlight ? 'info-row__value--highlight' : ''}`}>
        {value ?? '—'}
      </span>
    </div>
  );
}

function StatusBadge({ status }) {
  const cfg = {
    success: { label: '● SUCCESS', cls: 'badge--success' },
    failed:  { label: '● FAILED',  cls: 'badge--fail'    },
    running: { label: '◌ RUNNING', cls: 'badge--running'  },
  };
  const { label, cls } = cfg[status] || cfg.running;
  return <span className={`status-badge ${cls}`}>{label}</span>;
}

function getGroupForJob(jobId) {
  for (const g of jobGroups) {
    if (g.jobs.some((j) => j.id === jobId)) return g.name;
  }
  return '—';
}

function EmptyState() {
  return (
    <div className="empty-state">
      <div className="empty-state__icon">⚙</div>
      <div className="empty-state__title">No Job Selected</div>
      <div className="empty-state__sub">
        Select a job from the left panel to view its execution details,
        database metadata, and log output.
      </div>
      <div className="empty-state__hint">
        <span className="hint-chip">📅 Expand today's date</span>
        <span className="hint-chip">🗂 Open a job group</span>
        <span className="hint-chip">🖱 Click a job name</span>
      </div>
    </div>
  );
}

export default function RightPanel({ selectedJob }) {
  if (!selectedJob) return (
    <main className="right-panel">
      <EmptyState />
    </main>
  );

  const groupName = getGroupForJob(selectedJob.id);
  const isFailed  = selectedJob.status === 'failed';

  return (
    <main className="right-panel">
      {/* ── Job Header ── */}
      <div className="job-header">
        <div className="job-header__top">
          <div>
            <div className="job-header__name">{selectedJob.name}</div>
            <div className="job-header__group">
              <span className="job-header__group-icon">🗂</span>
              {groupName}
            </div>
          </div>
          <StatusBadge status={selectedJob.status} />
        </div>

        {/* Timeline bar */}
        <div className="timeline-bar">
          <div className="timeline-bar__item">
            <span className="timeline-bar__icon">▶</span>
            <div>
              <div className="timeline-bar__label">Start Time</div>
              <div className="timeline-bar__value">{selectedJob.startTime}</div>
            </div>
          </div>
          <div className="timeline-bar__divider" />
          <div className="timeline-bar__item">
            <span className="timeline-bar__icon">⏱</span>
            <div>
              <div className="timeline-bar__label">Duration</div>
              <div className="timeline-bar__value">{selectedJob.duration}</div>
            </div>
          </div>
          <div className="timeline-bar__divider" />
          <div className="timeline-bar__item">
            <span className="timeline-bar__icon">■</span>
            <div>
              <div className="timeline-bar__label">End Time</div>
              <div className="timeline-bar__value">{selectedJob.endTime ?? '—'}</div>
            </div>
          </div>
          <div className="timeline-bar__divider" />
          <div className="timeline-bar__item">
            <span className="timeline-bar__icon">📊</span>
            <div>
              <div className="timeline-bar__label">Rows Processed</div>
              <div className="timeline-bar__value">
                {selectedJob.rowsProcessed > 0
                  ? selectedJob.rowsProcessed.toLocaleString()
                  : isFailed ? '0 (rolled back)' : 'N/A'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Cards Grid ── */}
      <div className="cards-grid">
        <InfoCard title="🗄  Database Details">
          <InfoRow label="Database"     value={selectedJob.database}    />
          <InfoRow label="Schema"       value={selectedJob.schema}      />
          <InfoRow label="Target Table" value={selectedJob.targetTable} highlight />
        </InfoCard>

        <InfoCard title="📋  Execution Summary">
          <InfoRow label="Job ID"       value={selectedJob.id}                                 />
          <InfoRow label="Job Group"    value={groupName}                                       />
          <InfoRow label="Status"       value={selectedJob.status.toUpperCase()}               />
          <InfoRow
            label="Rows Processed"
            value={selectedJob.rowsProcessed > 0 ? selectedJob.rowsProcessed.toLocaleString() : '—'}
          />
        </InfoCard>

        {isFailed && (
          <InfoCard title="🚨  Error Details">
            <div className="error-message">
              <span className="error-message__label">Error Message</span>
              <p className="error-message__text">{selectedJob.errorMessage}</p>
            </div>
          </InfoCard>
        )}
      </div>

      {/* ── Log Output ── */}
      <div className="log-section">
        <div className="log-section__header">
          <span className="log-section__title">📄 Log Output</span>
          <span className={`log-section__badge ${isFailed ? 'log-section__badge--fail' : 'log-section__badge--success'}`}>
            {isFailed ? 'FAILED' : 'SUCCESS'}
          </span>
        </div>
        <pre className="log-output">
          {selectedJob.logOutput.split('\n').map((line, i) => {
            const cls =
              line.startsWith('[ERROR]') || line.startsWith('[FATAL]') ? 'log-line--error' :
              line.startsWith('[SUCCESS]') ? 'log-line--success' :
              line.startsWith('[WARN]')  ? 'log-line--warn'  :
              'log-line--info';
            return <span key={i} className={`log-line ${cls}`}>{line + '\n'}</span>;
          })}
        </pre>
      </div>
    </main>
  );
}
