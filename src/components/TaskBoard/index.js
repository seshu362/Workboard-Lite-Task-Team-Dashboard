import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import Modal from '../Modal';
import Comments from '../Comments';
import './index.css';

const FIREBASE_URL = 'https://workboardlite-default-rtdb.firebaseio.com';

const TaskBoard = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    assigned_to: '',
    due_date: '',
    status: 'todo',
    description: ''
  });

  const fetchProject = useCallback(async () => {
    try {
      const response = await fetch(`${FIREBASE_URL}/projects/${projectId}.json`);
      const data = await response.json();
      setProject(data);
    } catch (error) {
      console.error('Error fetching project:', error);
    }
  }, [projectId]);

  const fetchTasks = useCallback(async () => {
    try {
      const response = await fetch(`${FIREBASE_URL}/tasks.json`);
      const data = await response.json();
      
      if (data) {
        const tasksArray = Object.keys(data)
          .map(key => ({ id: key, ...data[key] }))
          .filter(task => task.project_id === projectId);
        setTasks(tasksArray);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  const fetchTeamMembers = useCallback(async () => {
    try {
      const response = await fetch(`${FIREBASE_URL}/team_members.json`);
      const data = await response.json();
      
      if (data) {
        const membersArray = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        setTeamMembers(membersArray);
      }
    } catch (error) {
      console.error('Error fetching team members:', error);
    }
  }, []);

  useEffect(() => {
    fetchProject();
    fetchTasks();
    fetchTeamMembers();
  }, [fetchProject, fetchTasks, fetchTeamMembers]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.assigned_to) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const taskData = {
        ...formData,
        project_id: projectId,
        created_at: new Date().toISOString()
      };

      if (editingTask) {
        await fetch(`${FIREBASE_URL}/tasks/${editingTask.id}.json`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
      } else {
        await fetch(`${FIREBASE_URL}/tasks.json`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(taskData),
        });
      }
      
      fetchTasks();
      resetForm();
    } catch (error) {
      console.error('Error saving task:', error);
      alert('Error saving task');
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await fetch(`${FIREBASE_URL}/tasks/${taskId}.json`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });
      
      fetchTasks();
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await fetch(`${FIREBASE_URL}/tasks/${taskId}.json`, {
          method: 'DELETE',
        });
        
        fetchTasks();
        setSelectedTask(null);
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      assigned_to: task.assigned_to,
      due_date: task.due_date || '',
      status: task.status,
      description: task.description || ''
    });
    setShowTaskForm(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      assigned_to: '',
      due_date: '',
      status: 'todo',
      description: ''
    });
    setShowTaskForm(false);
    setEditingTask(null);
  };

  const getMemberName = (memberId) => {
    const member = teamMembers.find(m => m.id === memberId);
    return member ? member.name : 'Unknown';
  };

  const getTasksByStatus = (status) => {
    return tasks.filter(task => task.status === status);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return <div className="loading">Loading tasks...</div>;
  }

  return (
    <div className="taskboard-container">
      <div className="container">
        <div className="taskboard-header">
          <div className="header-left">
            <Link to="/projects" className="back-link">← Back to Projects</Link>
            <h2>{project?.title || 'Project Tasks'}</h2>
          </div>
          <button 
            className="btn btn-primary"
            onClick={() => setShowTaskForm(true)}
          >
            Add Task
          </button>
        </div>

        {showTaskForm && (
          <Modal onClose={resetForm}>
            <form onSubmit={handleSubmit} className="task-form">
              <h3>{editingTask ? 'Edit Task' : 'Create New Task'}</h3>
              
              <div className="form-group">
                <label>Task Title *</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label>Assigned To *</label>
                <select
                  className="form-input"
                  value={formData.assigned_to}
                  onChange={(e) => setFormData({...formData, assigned_to: e.target.value})}
                  required
                >
                  <option value="">Select Assignee</option>
                  {teamMembers.map(member => (
                    <option key={member.id} value={member.id}>
                      {member.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Due Date</label>
                <input
                  type="date"
                  className="form-input"
                  value={formData.due_date}
                  onChange={(e) => setFormData({...formData, due_date: e.target.value})}
                />
              </div>

              <div className="form-group">
                <label>Status</label>
                <select
                  className="form-input"
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                >
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  className="form-input"
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Task description..."
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  {editingTask ? 'Update' : 'Create'} Task
                </button>
                <button type="button" className="btn btn-secondary" onClick={resetForm}>
                  Cancel
                </button>
              </div>
            </form>
          </Modal>
        )}

        <div className="kanban-board">
          <div className="kanban-column">
            <div className="column-header">
              <h3>To Do</h3>
              <span className="task-count">{getTasksByStatus('todo').length}</span>
            </div>
            <div className="task-list">
              {getTasksByStatus('todo').map(task => (
                <div 
                  key={task.id} 
                  className="task-card"
                  onClick={() => setSelectedTask(task)}
                >
                  <h4>{task.title}</h4>
                  <p className="task-assignee">
                    Assigned to: {getMemberName(task.assigned_to)}
                  </p>
                  {task.due_date && (
                    <p className="task-due-date">
                      Due: {formatDate(task.due_date)}
                    </p>
                  )}
                  <div className="task-actions">
                    <select
                      value={task.status}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleStatusChange(task.id, e.target.value);
                      }}
                      className="status-select"
                    >
                      <option value="todo">To Do</option>
                      <option value="in-progress">In Progress</option>
                      <option value="done">Done</option>
                    </select>
                  </div>
                </div>
              ))}
              {getTasksByStatus('todo').length === 0 && (
                <div className="empty-column">
                  <p>No tasks in To Do</p>
                </div>
              )}
            </div>
          </div>

          <div className="kanban-column">
            <div className="column-header">
              <h3>In Progress</h3>
              <span className="task-count">{getTasksByStatus('in-progress').length}</span>
            </div>
            <div className="task-list">
              {getTasksByStatus('in-progress').map(task => (
                <div 
                  key={task.id} 
                  className="task-card"
                  onClick={() => setSelectedTask(task)}
                >
                  <h4>{task.title}</h4>
                  <p className="task-assignee">
                    Assigned to: {getMemberName(task.assigned_to)}
                  </p>
                  {task.due_date && (
                    <p className="task-due-date">
                      Due: {formatDate(task.due_date)}
                    </p>
                  )}
                  <div className="task-actions">
                    <select
                      value={task.status}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleStatusChange(task.id, e.target.value);
                      }}
                      className="status-select"
                    >
                      <option value="todo">To Do</option>
                      <option value="in-progress">In Progress</option>
                      <option value="done">Done</option>
                    </select>
                  </div>
                </div>
              ))}
              {getTasksByStatus('in-progress').length === 0 && (
                <div className="empty-column">
                  <p>No tasks in progress</p>
                </div>
              )}
            </div>
          </div>

          <div className="kanban-column">
            <div className="column-header">
              <h3>Done</h3>
              <span className="task-count">{getTasksByStatus('done').length}</span>
            </div>
            <div className="task-list">
              {getTasksByStatus('done').map(task => (
                <div 
                  key={task.id} 
                  className="task-card"
                  onClick={() => setSelectedTask(task)}
                >
                  <h4>{task.title}</h4>
                  <p className="task-assignee">
                    Assigned to: {getMemberName(task.assigned_to)}
                  </p>
                  {task.due_date && (
                    <p className="task-due-date">
                      Due: {formatDate(task.due_date)}
                    </p>
                  )}
                  <div className="task-actions">
                    <select
                      value={task.status}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleStatusChange(task.id, e.target.value);
                      }}
                      className="status-select"
                    >
                      <option value="todo">To Do</option>
                      <option value="in-progress">In Progress</option>
                      <option value="done">Done</option>
                    </select>
                  </div>
                </div>
              ))}
              {getTasksByStatus('done').length === 0 && (
                <div className="empty-column">
                  <p>No completed tasks</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {selectedTask && (
          <Modal onClose={() => setSelectedTask(null)}>
            <div className="task-detail">
              <div className="task-detail-header">
                <h3>{selectedTask.title}</h3>
                <div className="task-detail-actions">
                  <button 
                    className="btn btn-secondary"
                    onClick={() => handleEditTask(selectedTask)}
                  >
                    Edit
                  </button>
                  <button 
                    className="btn btn-danger"
                    onClick={() => handleDeleteTask(selectedTask.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
              
              <div className="task-detail-info">
                <p><strong>Assigned to:</strong> {getMemberName(selectedTask.assigned_to)}</p>
                <p><strong>Status:</strong> {selectedTask.status}</p>
                {selectedTask.due_date && (
                  <p><strong>Due Date:</strong> {formatDate(selectedTask.due_date)}</p>
                )}
                {selectedTask.description && (
                  <div>
                    <strong>Description:</strong>
                    <p className="task-description">{selectedTask.description}</p>
                  </div>
                )}
              </div>

              <div className="comments-section">
                <h4>Comments</h4>
                <Comments taskId={selectedTask.id} />
              </div>
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
};

export default TaskBoard;