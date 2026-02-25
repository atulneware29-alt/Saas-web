'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import { projectsAPI, usersAPI } from '../../../services/api';
import { useAuth } from '../../../context/AuthContext';

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [teamMembers, setTeamMembers] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'active',
    priority: 'medium',
    members: [],
  });
  const { isManager } = useAuth();

  useEffect(() => {
    fetchProjects();
    if (isManager) {
      fetchTeamMembers();
    }
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await projectsAPI.getAll({ limit: 50 });
      setProjects(response.data.projects);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTeamMembers = async () => {
    try {
      const response = await usersAPI.getTeamMembers();
      setTeamMembers(response.data.users);
    } catch (error) {
      console.error('Failed to fetch team members:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await projectsAPI.create(formData);
      setShowModal(false);
      setFormData({ name: '', description: '', status: 'active', priority: 'medium', members: [] });
      fetchProjects();
    } catch (error) {
      console.error('Failed to create project:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      await projectsAPI.delete(id);
      fetchProjects();
    } catch (error) {
      console.error('Failed to delete project:', error);
    }
  };

  const statusColors = {
    active: '#10b981',
    completed: '#3b82f6',
    'on-hold': '#f59e0b',
    cancelled: '#ef4444',
  };

  const priorityColors = {
    low: '#64748b',
    medium: '#3b82f6',
    high: '#f59e0b',
    urgent: '#ef4444',
  };

  return (
    <DashboardLayout>
      <div className="animate-fadeIn">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h1>Projects</h1>
          {isManager && (
            <button className="btn btn-primary" onClick={() => setShowModal(true)}>
              + New Project
            </button>
          )}
        </div>

        {loading ? (
          <div className="grid grid-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card">
                <div className="skeleton" style={{ height: 24, width: '60%', marginBottom: 16 }}></div>
                <div className="skeleton" style={{ height: 16, width: '100%', marginBottom: 8 }}></div>
                <div className="skeleton" style={{ height: 16, width: '80%' }}></div>
              </div>
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="card text-center">
            <p className="text-secondary">No projects found. Create your first project!</p>
          </div>
        ) : (
          <div className="grid grid-3">
            {projects.map((project) => (
              <div key={project._id} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <h3 style={{ fontSize: '1.125rem' }}>{project.name}</h3>
                  <span
                    className="badge"
                    style={{ background: `${statusColors[project.status]}20`, color: statusColors[project.status] }}
                  >
                    {project.status}
                  </span>
                </div>
                <p className="text-secondary text-sm" style={{ marginBottom: 16, minHeight: 40 }}>
                  {project.description || 'No description'}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: priorityColors[project.priority], fontSize: '0.875rem', fontWeight: 500 }}>
                    {project.priority}
                  </span>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {isManager && (
                      <button
                        className="btn btn-ghost text-sm"
                        onClick={() => handleDelete(project._id)}
                        style={{ color: '#ef4444' }}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Create New Project</h2>
                <span className="modal-close" onClick={() => setShowModal(false)}>
                  ×
                </span>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="label">Project Name *</label>
                  <input
                    type="text"
                    className="input"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="label">Description</label>
                  <textarea
                    className="input"
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div className="form-group">
                    <label className="label">Status</label>
                    <select
                      className="input"
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    >
                      <option value="active">Active</option>
                      <option value="on-hold">On Hold</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="label">Priority</label>
                    <select
                      className="input"
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)} style={{ flex: 1 }}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                    Create Project
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
