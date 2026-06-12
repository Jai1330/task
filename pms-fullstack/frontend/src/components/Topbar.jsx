// src/components/Topbar.jsx
import React from 'react';

const PAGE_TITLES = {
  dashboard: 'Dashboard',
  tasks: 'Tasks',
  projects: 'Projects',
  reports: 'Reports',
};

export default function Topbar({ page, hasAlerts }) {
  return (
    <div className="topbar">
      <div className="topbar-title">{PAGE_TITLES[page] || page}</div>
      <div className="topbar-right">
        <div className="notif-wrap">
          <svg width="20" height="20" fill="none" stroke="#8891b8" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
          {hasAlerts && <div className="notif-dot" />}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <div className="avatar">A</div>
          <div>
            <div className="user-name">Abinesh</div>
            <div className="user-role">Admin</div>
          </div>
        </div>
      </div>
    </div>
  );
}
