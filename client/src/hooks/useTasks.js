import { useState, useEffect, useCallback } from 'react';
import { fetchTasks, createTask, updateTask, deleteTask, reorderTasks } from '../api/tasks';
import toast from 'react-hot-toast';

export function useTasks(filterColumn = null) {
  const [tasks, setTasks]   = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async (search = '') => {
    try {
      const params = {};
      if (filterColumn) params.columnId = filterColumn;
      if (search)       params.search   = search;
      const data = await fetchTasks(params);
      setTasks(data);
    } catch {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, [filterColumn]);

  useEffect(() => { load(); }, [load]);

  const getByColumn = (colId) =>
    tasks.filter(t => t.columnId === colId).sort((a, b) => a.order - b.order);

  const addTask = async (data) => {
    try {
      const task = await createTask(data);
      setTasks(prev => [...prev, task]);
      toast.success('Task created!');
      return task;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create task');
    }
  };

  const editTask = async (id, data) => {
    try {
      const updated = await updateTask(id, data);
      setTasks(prev => prev.map(t => t._id === id ? updated : t));
      toast.success('Task updated');
    } catch {
      toast.error('Failed to update task');
    }
  };

  const removeTask = async (id) => {
    try {
      await deleteTask(id);
      setTasks(prev => prev.filter(t => t._id !== id));
      toast.success('Task deleted');
    } catch {
      toast.error('Failed to delete task');
    }
  };

  const moveTask = async (taskId, newColumnId, newOrder, updatedList) => {
    setTasks(updatedList);
    try {
      const payload = updatedList.map(t => ({ _id: t._id, columnId: t.columnId, order: t.order }));
      await reorderTasks(payload);
    } catch {
      toast.error('Failed to save order');
      load();
    }
  };

  const searchTasks = (q) => load(q);

  return { tasks, loading, getByColumn, addTask, editTask, removeTask, moveTask, searchTasks, reload: load };
}
