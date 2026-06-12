// frontend/src/pages/Reports.jsx
import React from 'react';
import { Badge, MemberAvatar } from '../components/shared';
import { fmtDate, deadlineClass, deadlineLabel } from '../utils/helpers';
import { MEMBERS, COLORS } from '../data/initialData';

const STATUSES      = ['Pending', 'In Progress', 'Completed'];
const STATUS_COLORS = ['var(--pending)', 'var(--progress)', 'var(--completed)'];

export default function Reports({ tasks, onUpdateTaskStatus }) {
  const counts = STATUSES.map((s) => tasks.filter((t) => t.status === s).length);
  const total  = tasks.length || 1;

  let pct = 0;
  const conic = STATUSES.map((s, i) => {
    const share = (counts[i] / total) * 100;
    const seg   = `${STATUS_COLORS[i]} ${pct}% ${pct + share}%`;
    pct += share;
    return seg;
  }).join(', ');

  const memberStats = MEMBERS.map((m, i) => {
    const mTasks = tasks.filter((t) => t.assigned === m);
    const done   = mTasks.filter((t) => t.status === 'Completed').length;
    return { name: m, done, total: mTasks.length, pct: mTasks.length ? Math.round((done / mTasks.length) * 100) : 0, color: COLORS[i] };
  }).filter((m) => m.total > 0);

  return (
    <div className="content">
      <div className="page-header-sub" style={{ marginBottom: 18, fontSize: 13, color: 'var(--text-muted)' }}>
        Status updates here are saved to MongoDB instantly.
      </div>

      <div className="report-grid">
        <div className="card">
          <div className="card-title" style={{ marginBottom: 16 }}>Task Status Overview</div>
          <div className="donut-wrap">
            <div className="donut" style={{ background: `conic-gradient(${conic})` }} />
            <div className="legend">
              {STATUSES.map((s, i) => (
                <div className="legend-item" key={s}>
                  <div className="legend-dot" style={{ background: STATUS_COLORS[i] }} />
                  <span>{s}: <b>{counts[i]}</b></span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-title" style={{ marginBottom: 16 }}>Task Completion by Member</div>
          <div className="bar-chart">
            {memberStats.length === 0
              ? <div className="empty">No tasks yet.</div>
              : memberStats.map((m) => (
                <div className="bar-row" key={m.name}>
                  <div className="bar-label">{m.name.split(' ')[0]}</div>
                  <div className="bar-outer">
                    <div className="bar-inner" style={{ width: `${m.pct}%`, background: m.color }} />
                  </div>
                  <div className="bar-val" style={{ color: m.color }}>{m.pct}%</div>
                </div>
              ))}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-title">Member Task Report</div>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Changes save to MongoDB automatically</span>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Member</th><th>Task</th><th>Project</th><th>Status</th><th>Deadline</th><th>Update Status</th></tr>
            </thead>
            <tbody>
              {tasks.length === 0 && <tr><td colSpan="6" className="empty">No tasks yet.</td></tr>}
              {tasks.map((t) => {
                const mc  = COLORS[MEMBERS.indexOf(t.assigned) % COLORS.length] || '#4f6ef7';
                const dlc = deadlineClass(t.deadline, t.status);
                return (
                  <tr key={t._id}>
                    <td>
                      <div style={{ display:'flex', alignItems:'center', gap:7 }}>
                        <MemberAvatar name={t.assigned} color={mc} />
                        {t.assigned}
                      </div>
                    </td>
                    <td style={{ fontWeight: 600 }}>{t.name}</td>
                    <td><span className="tag">{t.project}</span></td>
                    <td><Badge status={t.status} /></td>
                    <td className={dlc}>{deadlineLabel(t.deadline, t.status)}</td>
                    <td>
                      <select
                        className="status-select"
                        value={t.status}
                        onChange={(e) => onUpdateTaskStatus(t._id, e.target.value)}
                      >
                        <option>Pending</option>
                        <option>In Progress</option>
                        <option>Completed</option>
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
