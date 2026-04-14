import api from './axios';

export const fetchProjects  = ()       => api.get('/projects').then(r => r.data);
export const createProject  = (data)   => api.post('/projects', data).then(r => r.data);
export const deleteProject  = (id)     => api.delete(`/projects/${id}`).then(r => r.data);
