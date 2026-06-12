// frontend/src/hooks/useAppData.js
import { useState, useEffect, useCallback } from 'react';
import { projectsAPI, tasksAPI } from '../services/api';

export default function useAppData() {
  const [projects, setProjects]   = useState([]);
  const [tasks, setTasks]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);

  // ── Fetch everything on mount ───────────────────────────
  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [p, t] = await Promise.all([projectsAPI.getAll(), tasksAPI.getAll()]);
      setProjects(p);
      setTasks(t);
    } catch (err) {
      setError('Cannot connect to server. Is the backend running?');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // ── Projects ────────────────────────────────────────────
  const addProject = async (form) => {
    const created = await projectsAPI.create(form);
    setProjects((prev) => [created, ...prev]);
    return created;
  };

  const updateProject = async (id, body) => {
    const updated = await projectsAPI.update(id, body);
    setProjects((prev) => prev.map((p) => (p._id === id ? updated : p)));
  };

  const deleteProject = async (id) => {
    await projectsAPI.delete(id);
    setProjects((prev) => prev.filter((p) => p._id !== id));
  };

  // ── Tasks ───────────────────────────────────────────────
  const addTask = async (form) => {
    const created = await tasksAPI.create(form);
    setTasks((prev) => [created, ...prev]);
    return created;
  };

  const updateTaskStatus = async (id, newStatus) => {
    const updated = await tasksAPI.update(id, { status: newStatus });
    setTasks((prev) => prev.map((t) => (t._id === id ? updated : t)));
  };

  const deleteTask = async (id) => {
    await tasksAPI.delete(id);
    setTasks((prev) => prev.filter((t) => t._id !== id));
  };

  return {
    projects, tasks,
    loading, error,
    addProject, updateProject, deleteProject,
    addTask, updateTaskStatus, deleteTask,
    refetch: fetchAll,
  };
}
