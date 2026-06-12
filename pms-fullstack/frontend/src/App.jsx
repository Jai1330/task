// frontend/src/App.jsx
import React, { useState } from 'react';
import './styles/global.css';

import useAppData    from './hooks/useAppData';
import { getAlerts } from './utils/helpers';

import Sidebar   from './components/Sidebar';
import Topbar    from './components/Topbar';
import { Spinner, ErrorBanner } from './components/shared';

import Dashboard from './pages/Dashboard';
import Tasks     from './pages/Tasks';
import Projects  from './pages/Projects';
import Reports   from './pages/Reports';

export default function App() {
  const [page, setPage] = useState('dashboard');

  const {
    projects, tasks,
    loading, error,
    addProject, addTask, updateTaskStatus,
    refetch,
  } = useAppData();

  const hasAlerts = getAlerts(tasks).length > 0;

  const renderPage = () => {
    if (loading) return <Spinner />;
    if (error)   return (
      <div className="content">
        <ErrorBanner message={error} onRetry={refetch} />
      </div>
    );

    switch (page) {
      case 'dashboard':
        return (
          <Dashboard
            projects={projects} tasks={tasks}
            onNavigate={setPage}
            onAddProject={addProject}
            onAddTask={addTask}
          />
        );
      case 'tasks':
        return <Tasks tasks={tasks} projects={projects} onAddTask={addTask} />;
      case 'projects':
        return <Projects projects={projects} onAddProject={addProject} />;
      case 'reports':
        return <Reports tasks={tasks} onUpdateTaskStatus={updateTaskStatus} />;
      default:
        return null;
    }
  };

  return (
    <div className="app-layout">
      <Sidebar active={page} onNavigate={setPage} />
      <div className="main-content">
        <Topbar page={page} hasAlerts={hasAlerts} />
        {renderPage()}
      </div>
    </div>
  );
}
