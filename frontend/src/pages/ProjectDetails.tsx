import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Project, Task, CreateTaskData, UpdateTaskData } from '../types';
import { projectsAPI, tasksAPI } from '../services/api';
import Navbar from '../components/Navbar';

const ProjectDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [createFormData, setCreateFormData] = useState<CreateTaskData>({
    title: '',
    dueDate: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      loadProject(parseInt(id));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadProject = async (projectId: number) => {
    try {
      const data = await projectsAPI.getById(projectId);
      setProject(data);
    } catch (error: any) {
      if (error.response?.status === 404) {
        navigate('/');
      } else {
        setError('Failed to load project');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!project) return;

    try {
      await tasksAPI.create(project.id, createFormData);
      setCreateFormData({ title: '', dueDate: '' });
      setShowCreateForm(false);
      setError('');
      loadProject(project.id);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to create task');
    }
  };

  const handleUpdateTask = async (task: Task, updates: Partial<UpdateTaskData>) => {
    try {
      const updateData: UpdateTaskData = {
        title: task.title,
        dueDate: task.dueDate || '',
        isCompleted: task.isCompleted,
        ...updates,
      };
      
      await tasksAPI.update(task.id, updateData);
      setEditingTask(null);
      setError('');
      if (project) {
        loadProject(project.id);
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to update task');
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await tasksAPI.delete(taskId);
        if (project) {
          loadProject(project.id);
        }
      } catch (error) {
        setError('Failed to delete task');
      }
    }
  };

  const toggleTaskCompletion = (task: Task) => {
    handleUpdateTask(task, { isCompleted: !task.isCompleted });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatDateForInput = (dateString?: string) => {
    if (!dateString) return '';
    // Handle date string properly to avoid timezone issues
    // If the dateString is already in YYYY-MM-DD format, return it directly
    if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return dateString;
    }
    // For ISO strings, extract just the date part
    return dateString.split('T')[0];
  };

  const getTaskStyle = (task: Task) => {
    const baseStyle: React.CSSProperties = { ...styles.taskItem };
    if (task.isCompleted) {
      baseStyle.backgroundColor = '#d5f4e6';
      baseStyle.opacity = 0.8;
    }
    return baseStyle;
  };

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div style={styles.loading}>Loading project...</div>
      </>
    );
  }

  if (!project) {
    return (
      <>
        <Navbar />
        <div style={styles.error}>Project not found</div>
      </>
    );
  }

  const completedTasks = project.tasks.filter(task => task.isCompleted).length;
  const progressPercentage = project.tasks.length === 0 ? 0 : Math.round((completedTasks / project.tasks.length) * 100);

  return (
    <>
      <Navbar />
      <div style={styles.container}>
        <div style={styles.header}>
          <button style={styles.backBtn} onClick={() => navigate('/')}>
            ← Back to Dashboard
          </button>
        </div>

        <div style={styles.projectHeader}>
          <h1>{project.title}</h1>
          {project.description && <p style={styles.description}>{project.description}</p>}
          <div style={styles.projectStats}>
            <span>Created: {formatDate(project.createdAt)}</span>
            <span>Tasks: {project.tasks.length}</span>
            <span>Completed: {completedTasks}</span>
            <span>Progress: {progressPercentage}%</span>
          </div>
          <div style={styles.progressBar}>
            <div style={{ ...styles.progressFill, width: `${progressPercentage}%` }} />
          </div>
        </div>

        {error && <div style={styles.error}>{error}</div>}

        <div style={styles.tasksSection}>
          <div style={styles.tasksHeader}>
            <h2>Tasks</h2>
            <button
              style={styles.createBtn}
              onClick={() => setShowCreateForm(!showCreateForm)}
            >
              {showCreateForm ? 'Cancel' : 'Add Task'}
            </button>
          </div>

          {showCreateForm && (
            <div style={styles.createForm}>
              <h3>Create New Task</h3>
              <form onSubmit={handleCreateTask}>
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
                    maxLength={200}
                    style={styles.input}
                  />
                </div>
                <div style={styles.inputGroup}>
                  <label htmlFor="dueDate">Due Date</label>
                  <input
                    type="date"
                    id="dueDate"
                    value={createFormData.dueDate}
                    onChange={(e) =>
                      setCreateFormData({ ...createFormData, dueDate: e.target.value })
                    }
                    style={styles.input}
                  />
                </div>
                <div style={styles.formActions}>
                  <button type="submit" style={styles.submitBtn}>
                    Create Task
                  </button>
                </div>
              </form>
            </div>
          )}

          <div style={styles.tasksList}>
            {project.tasks.length === 0 ? (
              <div style={styles.emptyState}>
                <p>No tasks yet. Add your first task to get started!</p>
              </div>
            ) : (
              project.tasks.map((task) => (
                <div key={task.id} style={getTaskStyle(task)}>
                  {editingTask?.id === task.id ? (
                    <div style={styles.editForm}>
                      <input
                        type="text"
                        value={editingTask.title}
                        onChange={(e) =>
                          setEditingTask({ ...editingTask, title: e.target.value })
                        }
                        style={styles.input}
                        maxLength={200}
                      />
                      <input
                        type="date"
                        value={formatDateForInput(editingTask.dueDate || '')}
                        onChange={(e) =>
                          setEditingTask({ ...editingTask, dueDate: e.target.value || undefined })
                        }
                        style={styles.input}
                      />
                      <div style={styles.editActions}>
                        <button
                          style={styles.saveBtn}
                          onClick={() => handleUpdateTask(task, {
                            title: editingTask.title,
                            dueDate: editingTask.dueDate,
                            isCompleted: editingTask.isCompleted,
                          })}
                        >
                          Save
                        </button>
                        <button
                          style={styles.cancelBtn}
                          onClick={() => setEditingTask(null)}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div style={styles.taskContent}>
                      <div style={styles.taskMain}>
                        <input
                          type="checkbox"
                          checked={task.isCompleted}
                          onChange={() => toggleTaskCompletion(task)}
                          style={styles.checkbox}
                        />
                        <div style={styles.taskInfo}>
                          <h4 style={{
                            ...styles.taskTitle,
                            textDecoration: task.isCompleted ? 'line-through' : 'none',
                          }}>
                            {task.title}
                          </h4>
                          <div style={styles.taskMeta}>
                            {task.dueDate && (
                              <span style={styles.dueDate}>
                                Due: {formatDate(task.dueDate)}
                              </span>
                            )}
                            <span style={styles.createdDate}>
                              Created: {formatDate(task.createdAt)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div style={styles.taskActions}>
                        <button
                          style={styles.editBtn}
                          onClick={() => setEditingTask(task)}
                        >
                          Edit
                        </button>
                        <button
                          style={styles.deleteBtn}
                          onClick={() => handleDeleteTask(task.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
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
    marginBottom: '1rem',
  },
  backBtn: {
    backgroundColor: '#95a5a6',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.9rem',
  },
  projectHeader: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    marginBottom: '2rem',
  },
  description: {
    color: '#7f8c8d',
    fontSize: '1.1rem',
    marginBottom: '1rem',
  },
  projectStats: {
    display: 'flex',
    gap: '2rem',
    marginBottom: '1rem',
    fontSize: '0.9rem',
    color: '#7f8c8d',
  },
  progressBar: {
    height: '8px',
    backgroundColor: '#ecf0f1',
    borderRadius: '4px',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#27ae60',
    transition: 'width 0.3s ease',
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
  tasksSection: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  tasksHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
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
  createForm: {
    backgroundColor: '#f8f9fa',
    padding: '1.5rem',
    borderRadius: '8px',
    marginBottom: '1.5rem',
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
  tasksList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1rem',
  },
  taskItem: {
    border: '1px solid #ecf0f1',
    borderRadius: '8px',
    padding: '1rem',
    backgroundColor: '#ffffff',
  },
  taskContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  taskMain: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.75rem',
    flex: 1,
  },
  checkbox: {
    marginTop: '0.25rem',
    transform: 'scale(1.2)',
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    margin: '0 0 0.5rem 0',
    fontSize: '1.1rem',
    color: '#2c3e50',
  },
  taskMeta: {
    display: 'flex',
    gap: '1rem',
    fontSize: '0.8rem',
    color: '#7f8c8d',
  },
  dueDate: {},
  createdDate: {},
  taskActions: {
    display: 'flex',
    gap: '0.5rem',
  },
  editBtn: {
    backgroundColor: '#f39c12',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.8rem',
  },
  deleteBtn: {
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.8rem',
  },
  editForm: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1rem',
  },
  editActions: {
    display: 'flex',
    gap: '0.5rem',
  },
  saveBtn: {
    backgroundColor: '#27ae60',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  cancelBtn: {
    backgroundColor: '#95a5a6',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  emptyState: {
    textAlign: 'center' as const,
    padding: '3rem',
    color: '#7f8c8d',
  },
};

export default ProjectDetails;