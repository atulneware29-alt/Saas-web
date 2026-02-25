'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import { tasksAPI, projectsAPI, usersAPI } from '../../../services/api';
import { useAuth } from '../../../context/AuthContext';

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    project: '',
    assignedTo: '',
    dueDate: '',
  });
  const { user } = useAuth();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [tasksRes, projectsRes, usersRes] = await Promise.all([
        tasksAPI.getAll({ limit: 50 }),
        projectsAPI.getAll({ limit: 50 }),
        usersAPI.getTeamMembers(),
      ]);
      setTasks(tasksRes.data.tasks);
      setProjects(projectsRes.data.projects);
      setTeamMembers(usersRes.data.users);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await tasksAPI.create(formData);
      setShowModal(false);
      setFormData({
        title: '',
        description: '',
        status: 'todo',
        priority: 'medium',
        project: '',
        assignedTo: '',
        dueDate: '',
      });
      fetchData();
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await tasksAPI.update(taskId, { status: newStatus });
      fetchData();
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    try {
      await tasksAPI.delete(id);
      fetchData();
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  const statusColors = {
    todo: '#64748b',
    'in-progress': '#f59e0b',
    review: '#8b5cf6',
    completed: '#10b981',
  };

  const priorityColors = {
    low: '#64748b',
    medium: '#3b82f6',
    high: '#f59e0b',
    urgent: '#ef4444',
  };

  const groupedTasks = tasks.reduce((acc, task) => {
    if (!acc[task.status]) acc[task.status] = [];
    acc[task.status].push(task);
    return acc;
  }, {});

  const columns = [
    { key: 'todo', label: 'To Do', color: '#64748b' },
    { key: 'in-progress', label: 'In Progress', color: '#f59e0b' },
    { key: 'review', label: 'Review', color: '#8b5cf6' },
    { key: 'completed', label: 'Completed', color: '#10b981' },
  ];

  return (
    <DashboardLayout>
      <div className="animate-fadeIn">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h1>Tasks</h1>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            + New Task
          </button>
        </div>

        {loading ? (
          <div className="grid grid-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="card">
                <div className="skeleton" style={{ height: 20, width: '40%', marginBottom: 16 }}></div>
                {[1, 2, 3].map((j) => (
                  <div key={j} className="skeleton" style={{ height: 60, marginBottom: 8 }}></div>
                ))}
              </div>
            ))}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            {columns.map((column) => (
              <div key={column.key}>
                <div
                  style={{
                    padding: '12px 16px',
                    background: `${column.color}15`,
                    borderRadius: 'var(--radius-md)',
                    marginBottom: 16,
                    borderLeft: `3px solid ${column.color}`,
                  }}
                >
                  <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: column.color }}>
                    {column.label} ({groupedTasks[column.key]?.length || 0})
                  </h3>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {(groupedTasks[column.key] || []).map((task) => (
                    <div key={task._id} className="card" style={{ padding: 16 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                        <h4 style={{ fontSize: '0.875rem', fontWeight: 500 }}>{task.title}</h4>
                        <span
                          className="badge"
                          style={{ background: `${priorityColors[task.priority]}20`, color: priorityColors[task.priority], fontSize: '0.625rem' }}
                        >
                          {task.priority}
                        </span>
                      </div>
                      <p className="text-secondary text-sm" style={{ marginBottom: 12 }}>
                        {task.description?.slice(0, 60)}...
                      </p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span className="text-sm text-secondary">
                          {task.project?.name || 'No project'}
                        </span>
                        <div style={{ display: 'flex', gap: 4 }}>
                          {column.key !== 'completed' && (
                            <select
                              value={task.status}
                              onChange={(e) => handleStatusChange(task._id, e.target.value)}
                              style={{
                                padding: '4px 8px',
                                background: 'var(--color-secondary)',
                                border: '1px solid var(--color-border)',
                                borderRadius: 'var(--radius-sm)',
                                color: 'var(--color-text-primary)',
                                fontSize: '0.75rem',
                              }}
                            >
                              <option value="todo">To Do</option>
                              <option value="in-progress">In Progress</option>
                              <option value="review">Review</option>
                              <option value="completed">Completed</option>
                            </select>
                          )}
                          <button
                            onClick={() => handleDelete(task._id)}
                            style={{ color: '#ef4444', fontSize: '0.75rem', padding: '4px 8px' }}
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Create New Task</h2>
                <span className="modal-close" onClick={() => setShowModal(false)}>
                  ×
                </span>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="label">Task Title *</label>
                  <input
                    type="text"
                    className="input"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
                <div className="form-group">
                  <label className="label">Project *</label>
                  <select
                    className="input"
                    value={formData.project}
                    onChange={(e) => setFormData({ ...formData, project: e.target.value })}
                    required
                  >
                    <option value="">Select Project</option>
                    {projects.map((project) => (
                      <option key={project._id} value={project._id}>
                        {project.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div className="form-group">
                    <label className="label">Status</label>
                    <select
                      className="input"
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    >
                      <option value="todo">To Do</option>
                      <option value="in-progress">In Progress</option>
                      <option value="review">Review</option>
                      <option value="completed">Completed</option>
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
                <div className="form-group">
                  <label className="label">Assign To</label>
                  <select
                    className="input"
                    value={formData.assignedTo}
                    onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                  >
                    <option value="">Unassigned</option>
                    {teamMembers.map((member) => (
                      <option key={member._id} value={member._id}>
                        {member.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="label">Due Date</label>
                  <input
                    type="date"
                    className="input"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  />
                </div>
                <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)} style={{ flex: 1 }}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                    Create Task
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
