import { useState, useEffect } from 'react';
import { fetchProjects, createProject, deleteProject } from '../api/projects';
import toast from 'react-hot-toast';

export function useProjects() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetchProjects()
      .then(setProjects)
      .catch(() => toast.error('Failed to load projects'));
  }, []);

  const addProject = async (data) => {
    try {
      const p = await createProject(data);
      setProjects(prev => [p, ...prev]);
      toast.success('Project created!');
      return p;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create project');
    }
  };

  const removeProject = async (id) => {
    try {
      await deleteProject(id);
      setProjects(prev => prev.filter(p => p._id !== id));
      toast.success('Project deleted');
    } catch {
      toast.error('Failed to delete project');
    }
  };

  return { projects, addProject, removeProject };
}
