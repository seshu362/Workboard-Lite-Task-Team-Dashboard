import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './index.css';

const FIREBASE_URL = 'https://workboardlite-default-rtdb.firebaseio.com';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterOwner, setFilterOwner] = useState('all');
  const [formData, setFormData] = useState({
    title: '',
    owner: '',
    status: 'active',
    description: ''
  });

  useEffect(() => {
    fetchProjects();
    fetchTeamMembers();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch(`${FIREBASE_URL}/projects.json`);
      const data = await response.json();
      
      if (data) {
        const projectsArray = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        setProjects(projectsArray);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTeamMembers = async () => {
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.owner) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      await fetch(`${FIREBASE_URL}/projects.json`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          created_at: new Date().toISOString()
        }),
      });
      
      fetchProjects();
      resetForm();
    } catch (error) {
      console.error('Error creating project:', error);
      alert('Error creating project');
    }
  };

  const resetForm = () => {
    setFormData({ title: '', owner: '', status: 'active', description: '' });
    setShowForm(false);
  };

  const getOwnerName = (ownerId) => {
    const owner = teamMembers.find(member => member.id === ownerId);
    return owner ? owner.name : 'Unknown';
  };

  const filteredProjects = projects.filter(project => {
    const statusMatch = filterStatus === 'all' || project.status === filterStatus;
    const ownerMatch = filterOwner === 'all' || project.owner === filterOwner;
    return statusMatch && ownerMatch;
  });

  if (loading) {
    return <div className="loading">Loading projects...</div>;
  }

  return (
    <div className="projects-container">
      <div className="container">
        <div className="projects-header">
          <h2>Projects</h2>
          <button 
            className="btn btn-primary"
            onClick={() => setShowForm(true)}
          >
            New Project
          </button>
        </div>

        {showForm && (
          <div className="project-form-container">
            <form onSubmit={handleSubmit} className="project-form">
              <h3>Create New Project</h3>
              
              <div className="form-group">
                <label>Project Title *</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label>Owner *</label>
                <select
                  className="form-input"
                  value={formData.owner}
                  onChange={(e) => setFormData({...formData, owner: e.target.value})}
                  required
                >
                  <option value="">Select Owner</option>
                  {teamMembers.map(member => (
                    <option key={member.id} value={member.id}>
                      {member.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Status</label>
                <select
                  className="form-input"
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                >
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="on-hold">On Hold</option>
                </select>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  className="form-input"
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Project description..."
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  Create Project
                </button>
                <button type="button" className="btn btn-secondary" onClick={resetForm}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="filters">
          <div className="filter-group">
            <label>Filter by Status:</label>
            <select
              className="form-input"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="on-hold">On Hold</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Filter by Owner:</label>
            <select
              className="form-input"
              value={filterOwner}
              onChange={(e) => setFilterOwner(e.target.value)}
            >
              <option value="all">All Owners</option>
              {teamMembers.map(member => (
                <option key={member.id} value={member.id}>
                  {member.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="projects-grid">
          {filteredProjects.length === 0 ? (
            <div className="empty-state">
              <p>No projects found. Create your first project!</p>
            </div>
          ) : (
            filteredProjects.map(project => (
              <div key={project.id} className="project-card">
                <div className="project-header">
                  <h3>{project.title}</h3>
                  <span className={`status-badge status-${project.status}`}>
                    {project.status}
                  </span>
                </div>
                
                <div className="project-info">
                  <p><strong>Owner:</strong> {getOwnerName(project.owner)}</p>
                  {project.description && (
                    <p className="project-description">{project.description}</p>
                  )}
                </div>

                <div className="project-actions">
                  <Link 
                    to={`/project/${project.id}/tasks`}
                    className="btn btn-primary"
                  >
                    View Tasks
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Projects;