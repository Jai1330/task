// frontend/src/utils/helpers.js
export function daysFromNow(dateStr) {
  const today = new Date(); today.setHours(0,0,0,0);
  const d     = new Date(dateStr); d.setHours(0,0,0,0);
  return Math.floor((d - today) / (1000 * 60 * 60 * 24));
}

export function fmtDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
}

export function deadlineClass(dateStr, status) {
  if (status === 'Completed') return 'dl-ok';
  const d = daysFromNow(dateStr);
  if (d < 0)  return 'dl-danger';
  if (d <= 3) return 'dl-warn';
  return 'dl-ok';
}

export function deadlineLabel(dateStr, status) {
  if (!dateStr) return '—';
  if (status === 'Completed') return fmtDate(dateStr);
  const d = daysFromNow(dateStr);
  if (d < 0)  return `${fmtDate(dateStr)} ⚠ Overdue`;
  if (d === 0) return `${fmtDate(dateStr)} 🔔 Today!`;
  if (d <= 3) return `${fmtDate(dateStr)} 🔔 Soon`;
  return fmtDate(dateStr);
}

export function getAlerts(list) {
  return (list || [])
    .filter((item) => item.status !== 'Completed')
    .reduce((acc, item) => {
      const d = daysFromNow(item.deadline);
      if (d < 0)       acc.push({ name: item.name, days: d, type: 'overdue' });
      else if (d <= 2) acc.push({ name: item.name, days: d, type: 'danger' });
      else if (d <= 5) acc.push({ name: item.name, days: d, type: 'warn' });
      return acc;
    }, []);
}

export function priorityColor(priority) {
  return priority === 'High' ? '#f74f6e' : priority === 'Medium' ? '#f7924f' : '#22d3a5';
}

export function statusToClass(status) {
  if (status === 'Completed')   return 'badge-completed';
  if (status === 'In Progress') return 'badge-progress';
  if (status === 'Pending')     return 'badge-pending';
  return 'badge-overdue';
}
