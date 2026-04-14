import api from './axios';

export const fetchTasks  = (params) => api.get('/tasks', { params }).then(r => r.data);
export const createTask  = (data)   => api.post('/tasks', data).then(r => r.data);
export const updateTask  = (id, data) => api.patch(`/tasks/${id}`, data).then(r => r.data);
export const deleteTask  = (id)     => api.delete(`/tasks/${id}`).then(r => r.data);
export const reorderTasks = (items) => api.patch('/tasks/reorder/bulk', items).then(r => r.data);
