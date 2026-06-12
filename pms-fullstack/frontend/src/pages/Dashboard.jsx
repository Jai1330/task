// frontend/src/pages/Dashboard.jsx
import React, { useState } from 'react';
import { Badge, ProgressBar, AlertBar, Modal, MemberAvatar } from '../components/shared';
import { getAlerts, fmtDate, daysFromNow, deadlineClass, priorityColor } from '../utils/helpers';
import { MEMBERS, COLORS } from '../data/initialData';

const KANBAN_COLS   = ['Pending', 'In Progress', 'Completed'];
const KANBAN_COLORS = ['#f7c34f', '#4f6ef7', '#22d3a5'];

const EMPTY_PROJECT = { name: '', lead: MEMBERS[0], deadline: '', desc: '' };
const EMPTY_TASK    = { name: '', project: '', assigned: MEMBERS[0], priority: 'High', deadline: '' };

export default function Dashboard({ projects, tasks, onNavigate, onAddProject, onAddTask }) {
  const [showProject, setShowProject] = useState(false);
  const [showTask,    setShowTask]    = useState(false);
  const [pForm, setPForm]             = useState(EMPTY_PROJECT);
  const [tForm, setTForm]             = useState(EMPTY_TASK);
  const [saving, setSaving]           = useState(false);

  const alerts  = getAlerts(tasks);
  const active  = projects.filter((p) => p.status !== 'Completed').length;
  const overdue = tasks.filter((t) => t.status !== 'Completed' && daysFromNow(t.deadline) < 0).length;
  const overall = projects.length
    ? Math.round(projects.reduce((s, p) => s + (p.progress || 0), 0) / projects.length)
    : 0;

  const saveProject = async () => {
    if (!pForm.name.trim()) return alert('Enter a project name');
    setSaving(true);
    try {
      await onAddProject(pForm);
      setShowProject(false);
      setPForm(EMPTY_PROJECT);
    } catch (e) { alert('Error saving project: ' + e.message); }
    finally { setSaving(false); }
  };

  const saveTask = async () => {
    if (!tForm.name.trim()) return alert('Enter a task name');
    setSaving(true);
    try {
      await onAddTask({ ...tForm, project: tForm.project || projects[0]?.name });
      setShowTask(false);
      setTForm(EMPTY_TASK);
    } catch (e) { alert('Error saving task: ' + e.message); }
    finally { setSaving(false); }
  };

  return (
    <div className="content">
      {alerts.map((a, i) => <AlertBar key={i} alert={a} />)}

      {/* Stats */}
      <div className="stats-grid">
        {[
          { bg:'#eef2ff', color:'var(--accent)',  value: active,           label:'Active Projects' },
          { bg:'#edfaf5', color:'var(--accent2)', value: tasks.length,     label:'Total Tasks' },
          { bg:'#fff0f3', color:'var(--accent4)', value: overdue,          label:'Overdue Tasks' },
         
        ].map((s) => (
          <div className="stat-card" key={s.label}>
            <div className="stat-icon" style={{ background: s.bg }}>
              <span style={{ fontSize: 22 }}>
                {s.label === 'Active Projects' ? '📁' : s.label === 'Total Tasks' ? '✅' : s.label === 'Overdue Tasks' ? '🚨' : '📊'}
              </span>
            </div>
            <div>
              <div className="stat-val" style={{ color: s.color }}>{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid-2">
        {/* Recent Projects */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">Recent Projects</div>
            <button className="card-action" onClick={() => onNavigate('projects')}>View All</button>
          </div>
          {projects.length === 0
            ? <div className="empty">No projects yet. Create one!</div>
            : (
              <div className="table-wrap">
                <table>
                  <thead><tr><th>Project</th><th>Lead</th><th>Status</th><th>Deadline</th></tr></thead>
                  <tbody>
                    {projects.slice(0, 5).map((p) => (
                      <tr key={p._id}>
                        <td style={{ fontWeight: 600 }}>{p.name}</td>
                        <td>{p.lead}</td>
                        <td><Badge status={p.status} /></td>
                        <td className={deadlineClass(p.deadline, p.status)}>{fmtDate(p.deadline)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
        </div>

        {/* Quick Actions */}
        <div className="card">
          <div className="card-title" style={{ marginBottom: 14 }}>Quick Actions</div>
          <button className="qa-btn qa-primary" onClick={() => setShowProject(true)}>
            <span>➕</span> Create Project
          </button>
          <button className="qa-btn qa-success" onClick={() => setShowTask(true)}>
            <span>📝</span> Add Task
          </button>
          <button className="qa-btn qa-warn" onClick={() => onNavigate('reports')}>
            <span>📊</span> View Reports
          </button>
          <button className="qa-btn qa-danger" onClick={() => onNavigate('tasks')}>
            <span>✅</span> Check Tasks
          </button>
        </div>
      </div>

      {/* Kanban */}
      <div className="card">
        <div className="card-header"><div className="card-title">Task Board</div></div>
        <div className="kanban">
          {KANBAN_COLS.map((col, ci) => {
            const colTasks = tasks.filter((t) => t.status === col);
            return (
              <div className="kanban-col" key={col}>
                <div className="kanban-col-title">
                  <span className="dot" style={{ background: KANBAN_COLORS[ci] }} />
                  {col} <span className="kanban-count">{colTasks.length}</span>
                </div>
                {colTasks.length === 0 && <div className="empty" style={{ padding: 12 }}>No tasks</div>}
                {colTasks.map((t) => (
                  <div className="kanban-card" key={t._id}>
                    <div className="kanban-card-title">{t.name}</div>
                    <div className="kanban-card-meta">
                      <span>{t.assigned}</span>
                      <span className="tag">{t.priority}</span>
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>

      {/* Project Modal */}
      {showProject && (
        <Modal title="Create New Project" onClose={() => setShowProject(false)} onSave={saveProject} saving={saving}>
          <div className="form-group">
            <label>Project Name</label>
            <input placeholder="Enter project name" value={pForm.name} onChange={(e) => setPForm({ ...pForm, name: e.target.value })} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Lead</label>
              <select value={pForm.lead} onChange={(e) => setPForm({ ...pForm, lead: e.target.value })}>
                {MEMBERS.map((m) => <option key={m}>{m}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Deadline</label>
              <input type="date" value={pForm.deadline} onChange={(e) => setPForm({ ...pForm, deadline: e.target.value })} />
            </div>
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea placeholder="Brief description" value={pForm.desc} onChange={(e) => setPForm({ ...pForm, desc: e.target.value })} />
          </div>
          
        </Modal>
      )}

      {/* Task Modal */}
      {showTask && (
        <Modal title="Add New Task" onClose={() => setShowTask(false)} onSave={saveTask} saving={saving}>
          <div className="form-group">
            <label>Task Name</label>
            <input placeholder="Enter task name" value={tForm.name} onChange={(e) => setTForm({ ...tForm, name: e.target.value })} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Project</label>
              <select value={tForm.project || projects[0]?.name} onChange={(e) => setTForm({ ...tForm, project: e.target.value })}>
                {projects.map((p) => <option key={p._id}>{p.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Assigned To</label>
              <select value={tForm.assigned} onChange={(e) => setTForm({ ...tForm, assigned: e.target.value })}>
                {MEMBERS.map((m) => <option key={m}>{m}</option>)}
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Priority</label>
              <select value={tForm.priority} onChange={(e) => setTForm({ ...tForm, priority: e.target.value })}>
                <option>High</option><option>Medium</option><option>Low</option>
              </select>
            </div>
            <div className="form-group">
              <label>Deadline</label>
              <input type="date" value={tForm.deadline} onChange={(e) => setTForm({ ...tForm, deadline: e.target.value })} />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
