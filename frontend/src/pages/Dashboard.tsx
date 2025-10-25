import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProjectSummary, CreateProjectData } from '../types';
import { projectsAPI } from '../services/api';
import Navbar from '../components/Navbar';

const Dashboard: React.FC = () => {
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createFormData, setCreateFormData] = useState<CreateProjectData>({
    title: '',
    description: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const data = await projectsAPI.getAll();
      setProjects(data);
    } catch (error) {
      setError('Failed to load projects');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (createFormData.title.length < 3) {
      setError('Project title must be at least 3 characters long');
      return;
    }

    try {
      await projectsAPI.create(createFormData);
      setCreateFormData({ title: '', description: '' });
      setShowCreateForm(false);
      setError('');
      loadProjects();
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to create project');
    }
  };

  const handleDeleteProject = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await projectsAPI.delete(id);
        loadProjects();
      } catch (error) {
        setError('Failed to delete project');
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getProgressPercentage = (completed: number, total: number) => {
    return total === 0 ? 0 : Math.round((completed / total) * 100);
  };

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div style={styles.loading}>Loading projects...</div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div style={styles.container}>
        <div style={styles.header}>
          <h1>My Projects</h1>
          <button
            style={styles.createBtn}
            onClick={() => setShowCreateForm(!showCreateForm)}
          >
            {showCreateForm ? 'Cancel' : 'Create Project'}
          </button>
        </div>

        {error && <div style={styles.error}>{error}</div>}

        {showCreateForm && (
          <div style={styles.createForm}>
            <h3>Create New Project</h3>
            <form onSubmit={handleCreateProject}>
              <div style={styles.inputGroup}>
                <label htmlFor="title">Title *</label>
                <input
                  type="text"
                  id="title"
                  value={createFormData.title}
                  onChange={(e) =>
                    setCreateFormData({ ...createFormData, title: e.target.value })
                  }
                  required
                  minLength={3}
                  maxLength={100}
                  style={styles.input}
                />
              </div>
              <div style={styles.inputGroup}>
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  value={createFormData.description}
                  onChange={(e) =>
                    setCreateFormData({ ...createFormData, description: e.target.value })
                  }
                  maxLength={500}
                  style={styles.textarea}
                  rows={3}
                />
              </div>
              <div style={styles.formActions}>
                <button type="submit" style={styles.submitBtn}>
                  Create Project
                </button>
              </div>
            </form>
          </div>
        )}

        <div style={styles.projectGrid}>
          {projects.length === 0 ? (
            <div style={styles.emptyState}>
              <p>No projects yet. Create your first project to get started!</p>
            </div>
          ) : (
            projects.map((project) => (
              <div key={project.id} style={styles.projectCard}>
                <div style={styles.cardHeader}>
                  <h3
                    style={styles.projectTitle}
                    onClick={() => navigate(`/projects/${project.id}`)}
                  >
                    {project.title}
                  </h3>
                  <button
                    style={styles.deleteBtn}
                    onClick={() => handleDeleteProject(project.id)}
                  >
                    ×
                  </button>
                </div>
                {project.description && (
                  <p style={styles.description}>{project.description}</p>
                )}
                <div style={styles.stats}>
                  <div style={styles.stat}>
                    <span style={styles.statLabel}>Tasks:</span>
                    <span>{project.taskCount}</span>
                  </div>
                  <div style={styles.stat}>
                    <span style={styles.statLabel}>Completed:</span>
                    <span>{project.completedTaskCount}</span>
                  </div>
                  <div style={styles.stat}>
                    <span style={styles.statLabel}>Progress:</span>
                    <span>
                      {getProgressPercentage(
                        project.completedTaskCount,
                        project.taskCount
                      )}%
                    </span>
                  </div>
                </div>
                <div style={styles.progressBar}>
                  <div
                    style={{
                      ...styles.progressFill,
                      width: `${getProgressPercentage(
                        project.completedTaskCount,
                        project.taskCount
                      )}%`,
                    }}
                  />
                </div>
                <div style={styles.cardFooter}>
                  <span style={styles.date}>Created: {formatDate(project.createdAt)}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 1rem',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
  },
  createBtn: {
    backgroundColor: '#27ae60',
    color: 'white',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
  },
  loading: {
    textAlign: 'center' as const,
    padding: '2rem',
    fontSize: '1.1rem',
  },
  error: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
    padding: '0.75rem',
    borderRadius: '4px',
    marginBottom: '1rem',
    textAlign: 'center' as const,
  },
  createForm: {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    marginBottom: '2rem',
  },
  inputGroup: {
    marginBottom: '1rem',
  },
  input: {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #bdc3c7',
    borderRadius: '4px',
    fontSize: '1rem',
    boxSizing: 'border-box' as const,
  },
  textarea: {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #bdc3c7',
    borderRadius: '4px',
    fontSize: '1rem',
    resize: 'vertical' as const,
    boxSizing: 'border-box' as const,
  },
  formActions: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  submitBtn: {
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  projectGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '1.5rem',
  },
  projectCard: {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    border: '1px solid #ecf0f1',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '1rem',
  },
  projectTitle: {
    margin: 0,
    color: '#2c3e50',
    cursor: 'pointer',
    fontSize: '1.2rem',
    flex: 1,
  },
  deleteBtn: {
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    width: '24px',
    height: '24px',
    cursor: 'pointer',
    fontSize: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  description: {
    color: '#7f8c8d',
    marginBottom: '1rem',
    fontSize: '0.9rem',
  },
  stats: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '1rem',
  },
  stat: {
    fontSize: '0.9rem',
  },
  statLabel: {
    color: '#7f8c8d',
    marginRight: '0.5rem',
  },
  progressBar: {
    height: '6px',
    backgroundColor: '#ecf0f1',
    borderRadius: '3px',
    marginBottom: '1rem',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#27ae60',
    transition: 'width 0.3s ease',
  },
  cardFooter: {
    fontSize: '0.8rem',
    color: '#95a5a6',
  },
  date: {},
  emptyState: {
    textAlign: 'center' as const,
    gridColumn: '1 / -1',
    padding: '3rem',
    color: '#7f8c8d',
  },
};

export default Dashboard;