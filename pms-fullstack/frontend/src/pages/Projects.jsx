// frontend/src/pages/Projects.jsx
import React, { useState } from 'react';
import { Badge, ProgressBar, MemberAvatar, Modal } from '../components/shared';
import { fmtDate, daysFromNow, deadlineClass } from '../utils/helpers';
import { MEMBERS, COLORS } from '../data/initialData';

function borderColor(status) {
  if (status === 'Completed')   return 'var(--accent2)';
  if (status === 'In Progress') return 'var(--accent)';
  return 'var(--pending)';
}

export default function Projects({ projects, onAddProject }) {
  const [showModal, setShowModal] = useState(false);
  const [saving,    setSaving]    = useState(false);
  const [pForm,     setPForm]     = useState({ name: '', lead: MEMBERS[0], deadline: '', desc: '' });

  const saveProject = async () => {
    if (!pForm.name.trim()) return alert('Enter a project name');
    setSaving(true);
    try {
      await onAddProject(pForm);
      setShowModal(false);
      setPForm({ name: '', lead: MEMBERS[0], deadline: '', desc: '' });
    } catch (e) { alert('Error: ' + e.message); }
    finally { setSaving(false); }
  };
   

  return (
    <div className="content">
      <div className="page-header">
        <div className="page-header-sub">All projects are saved to MongoDB. Add one to see it appear instantly.</div>
        <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}>+ Create Project</button>
      </div>

      {projects.length === 0 && (
        <div className="card"><div className="empty">No projects yet. Click "Create Project" to get started!</div></div>
      )}

      <div className="project-cards">
        {projects.map((p) => {
          const d   = daysFromNow(p.deadline);
          const dlc = deadlineClass(p.deadline, p.status);
          const mc  = COLORS[MEMBERS.indexOf(p.lead) % COLORS.length] || '#4f6ef7';
          return (
            <div className="project-card" key={p._id} style={{ borderTopColor: borderColor(p.status) }}>
              <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom: 8 }}>
                <div className="project-card-title">{p.name}</div>
                <Badge status={p.status} />
              </div>
              <div className="project-card-desc">{p.desc || 'No description.'}</div>
              <div className="project-card-lead">
                <MemberAvatar name={p.lead} color={mc} size={26} />
                {p.lead}
              </div>
              
              <div className={`project-card-footer ${dlc}`}>
                📅 {fmtDate(p.deadline)}
                {p.status !== 'Completed' && d < 0  && ' — Overdue!'}
                {p.status !== 'Completed' && d >= 0 && d <= 3 && ' — Due Soon!'}
              </div>

              {/* MongoDB ID badge */}
              <div style={{ marginTop: 10, fontSize: 10, color: 'var(--text-muted)', fontFamily: 'monospace', wordBreak: 'break-all' }}>
                🗄 ID: {p._id}
              </div>
            </div>
          );
        })}
      </div>

      {showModal && (
        <Modal title="Create New Project" onClose={() => setShowModal(false)} onSave={saveProject} saving={saving}>
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
    </div>
  );
}
