import api from './axios';

export const login    = (data) => api.post('/auth/login', data).then(r => r.data);
export const signup   = (data) => api.post('/auth/signup', data).then(r => r.data);
export const getMe    = ()     => api.get('/auth/me').then(r => r.data);
export const updateSettings = (data) => api.patch('/auth/settings', data).then(r => r.data);
