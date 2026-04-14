import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';

// Demo seed data shown when backend is unavailable
const DEMO_TASKS = [
  { _id: 'd1', title: 'Design new UI presentation', projectName: 'Dribbble marketing', columnId: 'todo', order: 0, priority: 'high', progress: 70, dueDate: '24 Aug 2025', comments: 7, attachments: 2 },
  { _id: 'd2', title: 'Add more UI/UX mockups', projectName: 'Pinterest promotion', columnId: 'todo', order: 1, priority: 'medium', progress: 40, dueDate: '25 Aug 2025', comments: 0, attachments: 0 },
  { _id: 'd3', title: 'Design few mobile screens', projectName: 'Dropbox mobile app', columnId: 'todo', order: 2, priority: 'low', progress: 30, dueDate: '26 Aug 2025', comments: 6, attachments: 4 },
  { _id: 'd4', title: 'Design system update', projectName: 'Oreo website', columnId: 'inprogress', order: 0, priority: 'high', progress: 30, dueDate: '12 Nov 2025', comments: 0, attachments: 0 },
  { _id: 'd5', title: 'Create brand guideline', projectName: 'Oreo branding', columnId: 'inprogress', order: 1, priority: 'medium', progress: 70, dueDate: '13 Nov 2025', comments: 2, attachments: 13 },
  { _id: 'd6', title: 'Create wireframe for iOS', projectName: 'Oreo iOS app', columnId: 'inprogress', order: 2, priority: 'medium', progress: 40, dueDate: '14 Nov 2025', comments: 0, attachments: 0 },
  { _id: 'd7', title: 'Add product to the market', projectName: 'Ui8 marketplace', columnId: 'done', order: 0, priority: 'low', progress: 100, dueDate: '6 Jan 2025', comments: 1, attachments: 5 },
  { _id: 'd8', title: 'Launch product promotion', projectName: 'Kickstarter campaign', columnId: 'done', order: 1, priority: 'medium', progress: 100, dueDate: '7 Jan 2025', comments: 17, attachments: 3 },
  { _id: 'd9', title: 'Make twitter banner', projectName: 'Twitter marketing', columnId: 'done', order: 2, priority: 'high', progress: 100, dueDate: '8 Jan 2025', comments: 0, attachments: 0 },
];

let demoIdCounter = 100;

function isDemoMode() {
  const token = localStorage.getItem('token');
  return !token || token.startsWith('demo-token-');
}

export function useTasks() {
  const [tasks, setTasks]     = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (isDemoMode()) {
      setTasks(DEMO_TASKS);
      setLoading(false);
      return;
    }
    try {
      const { default: api } = await import('../api/axios.js');
      const res = await api.get('/tasks');
      setTasks(res.data);
    } catch {
      // fallback to demo data if backend unreachable
      setTasks(DEMO_TASKS);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const getByColumn = (colId) =>
    tasks.filter(t => t.columnId === colId).sort((a, b) => a.order - b.order);

  const addTask = async (data) => {
    if (isDemoMode()) {
      const task = { ...data, _id: 'demo-' + (++demoIdCounter), order: tasks.filter(t => t.columnId === data.columnId).length };
      setTasks(prev => [...prev, task]);
      toast.success('Task created!');
      return task;
    }
    try {
      const { default: api } = await import('../api/axios.js');
      const res = await api.post('/tasks', data);
      setTasks(prev => [...prev, res.data]);
      toast.success('Task created!');
      return res.data;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create task');
    }
  };

  const editTask = async (id, data) => {
    if (isDemoMode()) {
      setTasks(prev => prev.map(t => t._id === id ? { ...t, ...data } : t));
      toast.success('Task updated');
      return;
    }
    try {
      const { default: api } = await import('../api/axios.js');
      const res = await api.patch(`/tasks/${id}`, data);
      setTasks(prev => prev.map(t => t._id === id ? res.data : t));
      toast.success('Task updated');
    } catch { toast.error('Failed to update task'); }
  };

  const removeTask = async (id) => {
    if (isDemoMode()) {
      setTasks(prev => prev.filter(t => t._id !== id));
      toast.success('Task deleted');
      return;
    }
    try {
      const { default: api } = await import('../api/axios.js');
      await api.delete(`/tasks/${id}`);
      setTasks(prev => prev.filter(t => t._id !== id));
      toast.success('Task deleted');
    } catch { toast.error('Failed to delete task'); }
  };

  const moveTask = async (taskId, newColumnId, newOrder, updatedList) => {
    setTasks(updatedList);
    if (isDemoMode()) return;
    try {
      const { default: api } = await import('../api/axios.js');
      const payload = updatedList.map(t => ({ _id: t._id, columnId: t.columnId, order: t.order }));
      await api.patch('/tasks/reorder/bulk', payload);
    } catch {
      toast.error('Failed to save order');
      load();
    }
  };

  return { tasks, loading, getByColumn, addTask, editTask, removeTask, moveTask, reload: load };
}
