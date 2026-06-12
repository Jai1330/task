// frontend/src/pages/Tasks.jsx
import React, { useState } from 'react';
import { Badge, AlertBar, Modal, MemberAvatar } from '../components/shared';
import { getAlerts, deadlineClass, deadlineLabel, priorityColor } from '../utils/helpers';
import { MEMBERS, COLORS } from '../data/initialData';

export default function Tasks({ tasks, projects, onAddTask }) {
  const [filter,     setFilter]     = useState('');
  const [showModal,  setShowModal]  = useState(false);
  const [saving,     setSaving]     = useState(false);
  const [tForm,      setTForm]      = useState({
    name: '', project: '', assigned: MEMBERS[0], priority: 'High', deadline: '',
  });

  const alerts   = getAlerts(tasks);
  const filtered = filter ? tasks.filter((t) => t.status === filter) : tasks;

  const saveTask = async () => {
    if (!tForm.name.trim()) return alert('Enter a task name');
    setSaving(true);
    try {
      await onAddTask({ ...tForm, project: tForm.project || projects[0]?.name });
      setShowModal(false);
      setTForm({ name: '', project: '', assigned: MEMBERS[0], priority: 'High', deadline: '' });
    } catch (e) { alert('Error: ' + e.message); }
    finally { setSaving(false); }
  };

  return (
    <div className="content">
      <div className="page-header">
        <div className="page-header-sub">Deadlines close to today will be highlighted.</div>
        <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}>+ Add Task</button>
      </div>

      {alerts.map((a, i) => <AlertBar key={i} alert={a} />)}

      <div className="card">
        <div className="card-header">
          <div className="card-title">All Tasks</div>
          <select className="filter-select" value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="">All Status</option>
            <option>Pending</option><option>In Progress</option><option>Completed</option>
          </select>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>#</th><th>Task</th><th>Project</th><th>Assigned To</th><th>Priority</th><th>Deadline</th><th>Status</th></tr>
            </thead>
            <tbody>
              {filtered.length === 0 && <tr><td colSpan="7" className="empty">No tasks found.</td></tr>}
              {filtered.map((t, i) => {
                const mc = COLORS[MEMBERS.indexOf(t.assigned) % COLORS.length] || '#4f6ef7';
                return (
                  <tr key={t._id}>
                    <td style={{ color: 'var(--text-muted)' }}>{i + 1}</td>
                    <td style={{ fontWeight: 600 }}>{t.name}</td>
                    <td><span className="tag">{t.project}</span></td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                        <MemberAvatar name={t.assigned} color={mc} />
                        {t.assigned}
                      </div>
                    </td>
                    <td>
                      <span className="prio">
                        <span className="dot" style={{ background: priorityColor(t.priority) }} />
                        {t.priority}
                      </span>
                    </td>
                    <td className={deadlineClass(t.deadline, t.status)}>{deadlineLabel(t.deadline, t.status)}</td>
                    <td><Badge status={t.status} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <Modal title="Add New Task" onClose={() => setShowModal(false)} onSave={saveTask} saving={saving}>
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
