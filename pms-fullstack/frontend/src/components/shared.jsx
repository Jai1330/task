// frontend/src/components/shared.jsx
import React from 'react';
import { statusToClass } from '../utils/helpers';

export function Badge({ status }) {
  const dotColor =
    status === 'Pending'     ? '#f7c34f' :
    status === 'In Progress' ? '#4f6ef7' :
    status === 'Completed'   ? '#22d3a5' : '#f74f6e';
  return (
    <span className={`badge ${statusToClass(status)}`}>
      <span className="dot" style={{ background: dotColor }} />
      {status}
    </span>
  );
}

export function MemberAvatar({ name, color, size = 28 }) {
  return (
    <div className="member-av" style={{ background: color, width: size, height: size, fontSize: size * 0.4 }}>
      {name[0]}
    </div>
  );
}

export function ProgressBar({ value, color }) {
  const bg = color || (value === 100 ? 'var(--accent2)' : 'var(--accent)');
  return (
    <div>
      <div className="prog-bar">
        <div className="prog-fill" style={{ width: `${value}%`, background: bg }} />
      </div>
      <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{value}%</span>
    </div>
  );
}

export function AlertBar({ alert }) {
  let icon, msg, cls = '';
  if (alert.type === 'overdue') {
    icon = '🚨'; cls = 'danger';
    msg  = <><b>{alert.name}</b> is <b>overdue by {Math.abs(alert.days)} day(s)</b>! Please update the status.</>;
  } else if (alert.type === 'danger') {
    icon = '⚠️'; cls = 'danger';
    msg  = <><b>{alert.name}</b> deadline is in <b>{alert.days} day(s)</b> — action needed!</>;
  } else {
    icon = '🔔';
    msg  = <><b>{alert.name}</b> deadline is coming up in <b>{alert.days} days</b>.</>;
  }
  return (
    <div className={`alert-bar ${cls}`}>
      <span className="alert-icon">{icon}</span>
      <span className="alert-text">{msg}</span>
    </div>
  );
}

export function Modal({ title, onClose, onSave, saving, children }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-title">{title}</div>
        {children}
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose} disabled={saving}>Cancel</button>
          <button className="btn btn-primary" onClick={onSave} disabled={saving}>
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}

export function Spinner() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', flexDirection: 'column', gap: 16 }}>
      <div style={{
        width: 44, height: 44, border: '4px solid var(--border)',
        borderTop: '4px solid var(--accent)', borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }} />
      <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>Loading from database…</div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export function ErrorBanner({ message, onRetry }) {
  return (
    <div style={{
      margin: '40px auto', maxWidth: 480, background: '#fff0f3',
      border: '1.5px solid #f74f6e44', borderRadius: 14, padding: '28px 24px',
      textAlign: 'center',
    }}>
      <div style={{ fontSize: 32, marginBottom: 12 }}>⚠️</div>
      <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 8, color: '#c01040' }}>Connection Error</div>
      <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 20 }}>{message}</div>
      <button className="btn btn-primary" onClick={onRetry}>Retry</button>
    </div>
  );
}
