import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const DEMO_PROJECTS = [
  { _id: 'p1', name: 'Dribbble marketing', color: '#4f8ef7' },
  { _id: 'p2', name: 'Oreo branding',      color: '#ffa048' },
  { _id: 'p3', name: 'Ui8 marketplace',    color: '#78d700' },
];

let projCounter = 10;

function isDemoMode() {
  const token = localStorage.getItem('token');
  return !token || token.startsWith('demo-token-');
}

export function useProjects() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    if (isDemoMode()) { setProjects(DEMO_PROJECTS); return; }
    import('../api/axios.js').then(({ default: api }) =>
      api.get('/projects').then(r => setProjects(r.data)).catch(() => setProjects(DEMO_PROJECTS))
    );
  }, []);

  const addProject = async (data) => {
    if (isDemoMode()) {
      const p = { ...data, _id: 'demo-p-' + (++projCounter) };
      setProjects(prev => [p, ...prev]);
      toast.success('Project created!');
      return p;
    }
    try {
      const { default: api } = await import('../api/axios.js');
      const res = await api.post('/projects', data);
      setProjects(prev => [res.data, ...prev]);
      toast.success('Project created!');
      return res.data;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create project');
    }
  };

  const removeProject = async (id) => {
    setProjects(prev => prev.filter(p => p._id !== id));
    if (!isDemoMode()) {
      const { default: api } = await import('../api/axios.js');
      await api.delete(`/projects/${id}`).catch(() => {});
    }
  };

  return { projects, addProject, removeProject };
}
