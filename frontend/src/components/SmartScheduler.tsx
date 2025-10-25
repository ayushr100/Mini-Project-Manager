import React, { useState } from 'react';
import { Task, TaskScheduleData, ScheduleRequestData, ScheduleResponseData } from '../types';
import { schedulerApi } from '../services/api';

interface SmartSchedulerProps {
  projectId: number;
  tasks: Task[];
  onScheduleGenerated: (order: string[]) => void;
}

const SmartScheduler: React.FC<SmartSchedulerProps> = ({ projectId, tasks, onScheduleGenerated }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [scheduleData, setScheduleData] = useState<TaskScheduleData[]>([]);
  const [result, setResult] = useState<ScheduleResponseData | null>(null);
  const [error, setError] = useState('');

  const initializeScheduleData = () => {
    const initialData = tasks
      .filter(task => !task.isCompleted)
      .map(task => {
        // Format date to YYYY-MM-DD for HTML date input
        let formattedDueDate;
        if (task.dueDate) {
          try {
            // Parse the date as local date to avoid timezone issues
            let date;
            if (task.dueDate.includes('T')) {
              // If it already has time, just use the date part
              formattedDueDate = task.dueDate.split('T')[0];
            } else {
              // If it's just a date string (YYYY-MM-DD), use it directly
              formattedDueDate = task.dueDate;
            }
            
            // Validate the date format
            const testDate = new Date(formattedDueDate + 'T12:00:00'); // Use noon to avoid timezone issues
            if (isNaN(testDate.getTime())) {
              // If date is invalid, use default
              formattedDueDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
            }
          } catch (error) {
            // If parsing fails, use default date
            formattedDueDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
          }
        } else {
          // Default to 1 week from now if no due date
          formattedDueDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        }
        
        return {
          title: task.title,
          estimatedHours: task.estimatedHours || 1,
          dueDate: formattedDueDate,
          dependencies: task.dependencies ? task.dependencies.split(',').map(dep => dep.trim()).filter(dep => dep) : []
        };
      });
    setScheduleData(initialData);
  };

  const handleOpenScheduler = () => {
    initializeScheduleData();
    setIsOpen(true);
    setResult(null);
    setError('');
  };

  const handleTaskChange = (index: number, field: keyof TaskScheduleData, value: any) => {
    const updated = [...scheduleData];
    if (field === 'dependencies') {
      updated[index][field] = value.split(',').map((dep: string) => dep.trim()).filter((dep: string) => dep);
    } else {
      (updated[index] as any)[field] = value;
    }
    setScheduleData(updated);
  };

  const handleGenerateSchedule = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const request: ScheduleRequestData = { tasks: scheduleData };
      const response = await schedulerApi.scheduleTasks(projectId, request);
      setResult(response);
      
      if (response.isValid) {
        onScheduleGenerated(response.recommendedOrder);
      }
      
      // Auto-scroll to results section after a short delay
      setTimeout(() => {
        const resultsElement = document.getElementById('schedule-results');
        if (resultsElement) {
          resultsElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to generate schedule');
    } finally {
      setIsLoading(false);
    }
  };

  const addNewTask = () => {
    setScheduleData([
      ...scheduleData,
      {
        title: '',
        estimatedHours: 1,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        dependencies: []
      }
    ]);
  };

  const removeTask = (index: number) => {
    setScheduleData(scheduleData.filter((_, i) => i !== index));
  };

  if (!isOpen) {
    return (
      <button
        onClick={handleOpenScheduler}
        style={styles.triggerButton}
      >
        🤖 Smart Scheduler
      </button>
    );
  }

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <h3>🤖 Smart Task Scheduler</h3>
          <button onClick={() => setIsOpen(false)} style={styles.closeButton}>×</button>
        </div>
        
        <div style={styles.content}>
          <p style={styles.description}>
            Configure your tasks with estimated hours, due dates, and dependencies. 
            The Intelligent task scheduler will recommend the optimal execution order.
          </p>

          <div style={styles.tasksContainer}>
            {scheduleData.map((task, index) => (
              <div key={index} style={styles.taskCard}>
                <div style={styles.taskHeader}>
                  <h4>Task {index + 1}</h4>
                  <button 
                    onClick={() => removeTask(index)}
                    style={styles.removeButton}
                  >
                    🗑️
                  </button>
                </div>
                
                <div style={styles.taskFields}>
                  <div style={styles.field}>
                    <label>Title</label>
                    <input
                      type="text"
                      value={task.title}
                      onChange={(e) => handleTaskChange(index, 'title', e.target.value)}
                      style={styles.input}
                      placeholder="Task title"
                    />
                  </div>
                  
                  <div style={styles.fieldRow}>
                    <div style={styles.field}>
                      <label>Estimated Hours</label>
                      <input
                        type="number"
                        min="0.1"
                        step="0.5"
                        value={task.estimatedHours}
                        onChange={(e) => handleTaskChange(index, 'estimatedHours', parseFloat(e.target.value))}
                        style={styles.input}
                      />
                    </div>
                    
                    <div style={styles.field}>
                      <label>Due Date</label>
                      <input
                        type="date"
                        value={task.dueDate}
                        onChange={(e) => handleTaskChange(index, 'dueDate', e.target.value)}
                        style={styles.input}
                      />
                    </div>
                  </div>
                  
                  <div style={styles.field}>
                    <label>Dependencies (comma-separated task titles)</label>
                    <input
                      type="text"
                      value={task.dependencies.join(', ')}
                      onChange={(e) => handleTaskChange(index, 'dependencies', e.target.value)}
                      style={styles.input}
                      placeholder="e.g., Design API, Setup Database"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={styles.actions}>
            <button onClick={addNewTask} style={styles.addButton}>
              + Add Task
            </button>
            
            <button 
              onClick={handleGenerateSchedule}
              disabled={isLoading || scheduleData.length === 0}
              style={{
                ...styles.generateButton,
                opacity: isLoading || scheduleData.length === 0 ? 0.6 : 1,
                cursor: isLoading || scheduleData.length === 0 ? 'not-allowed' : 'pointer',
              }}
            >
              {isLoading ? (
                <>
                  <span style={styles.loadingSpinner}></span>
                  Generating...
                </>
              ) : (
                <>
                  🚀 Generate Schedule
                </>
              )}
            </button>
          </div>

          {error && (
            <div style={styles.error}>
              ❌ {error}
            </div>
          )}

          {result && (
            <div id="schedule-results" style={styles.result}>
              <h4>📋 Recommended Task Order:</h4>
              {result.isValid ? (
                <ol style={styles.orderList}>
                  {result.recommendedOrder.map((task, index) => (
                    <li key={index} style={styles.orderItem}>
                      {task}
                    </li>
                  ))}
                </ol>
              ) : (
                <div style={styles.error}>
                  {result.message}
                </div>
              )}
              {result.message && result.isValid && (
                <p style={styles.successMessage}>✅ {result.message}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  triggerButton: {
    backgroundColor: '#9b59b6',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold' as const,
    marginLeft: '10px',
    boxShadow: '0 2px 4px rgba(155, 89, 182, 0.3)',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  overlay: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    padding: '10px',
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: '12px',
    width: '100%',
    maxWidth: '800px',
    maxHeight: '90vh',
    overflow: 'auto',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
    '@media (max-width: 768px)': {
      maxWidth: '95%',
      maxHeight: '95vh',
    },
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px',
    borderBottom: '1px solid #eee',
    backgroundColor: '#f8f9fa',
    borderRadius: '12px 12px 0 0',
    '@media (max-width: 768px)': {
      padding: '15px',
    },
  },
  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    color: '#666',
    padding: '5px',
  },
  content: {
    padding: '20px',
    '@media (max-width: 768px)': {
      padding: '15px',
    },
  },
  description: {
    color: '#666',
    marginBottom: '20px',
    lineHeight: '1.5',
    fontSize: '14px',
  },
  tasksContainer: {
    marginBottom: '20px',
  },
  taskCard: {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '15px',
    marginBottom: '15px',
    backgroundColor: '#f9f9f9',
    '@media (max-width: 768px)': {
      padding: '12px',
    },
  },
  taskHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px',
  },
  removeButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '18px',
    padding: '5px',
    borderRadius: '4px',
    transition: 'background-color 0.2s',
  },
  taskFields: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '10px',
  },
  field: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '5px',
  },
  fieldRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '15px',
    '@media (max-width: 768px)': {
      gridTemplateColumns: '1fr',
      gap: '10px',
    },
  },
  input: {
    padding: '8px 12px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
    transition: 'border-color 0.2s',
    '&:focus': {
      borderColor: '#9b59b6',
      outline: 'none',
    },
  },
  actions: {
    display: 'flex',
    gap: '10px',
    justifyContent: 'flex-end',
    marginTop: '20px',
    flexWrap: 'wrap' as const,
    '@media (max-width: 768px)': {
      justifyContent: 'stretch',
      '& > *': {
        flex: 1,
      },
    },
  },
  addButton: {
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'background-color 0.2s',
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
  },
  generateButton: {
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold' as const,
    fontSize: '14px',
    transition: 'all 0.2s',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    minWidth: '160px',
    justifyContent: 'center',
  },
  error: {
    color: '#dc3545',
    backgroundColor: '#f8d7da',
    padding: '12px',
    borderRadius: '6px',
    marginTop: '15px',
    fontSize: '14px',
    border: '1px solid #f5c6cb',
  },
  result: {
    marginTop: '20px',
    padding: '15px',
    backgroundColor: '#d4edda',
    borderRadius: '8px',
    border: '1px solid #c3e6cb',
  },
  orderList: {
    margin: '10px 0',
    paddingLeft: '20px',
  },
  orderItem: {
    padding: '8px 0',
    fontSize: '16px',
    fontWeight: 'bold' as const,
    borderBottom: '1px solid #c3e6cb',
    '&:last-child': {
      borderBottom: 'none',
    },
  },
  successMessage: {
    color: '#155724',
    marginTop: '10px',
    fontStyle: 'italic' as const,
    fontSize: '14px',
  },
  loadingSpinner: {
    display: 'inline-block',
    width: '16px',
    height: '16px',
    border: '2px solid #ffffff40',
    borderTop: '2px solid #ffffff',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
};

export default SmartScheduler;