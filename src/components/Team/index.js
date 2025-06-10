import React, { useState, useEffect } from 'react';
import './index.css';

const FIREBASE_URL = 'https://workboardlite-default-rtdb.firebaseio.com';

const Team = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Developer'
  });

  // Fetch team members
  useEffect(() => {
    fetchTeamMembers();
  }, []);

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
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      if (editingMember) {
        // Update existing member
        await fetch(`${FIREBASE_URL}/team_members/${editingMember.id}.json`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
      } else {
        // Add new member
        await fetch(`${FIREBASE_URL}/team_members.json`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
      }
      
      fetchTeamMembers();
      resetForm();
    } catch (error) {
      console.error('Error saving team member:', error);
      alert('Error saving team member');
    }
  };

  const handleEdit = (member) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
      email: member.email,
      role: member.role
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({ name: '', email: '', role: 'Developer' });
    setShowForm(false);
    setEditingMember(null);
  };

  if (loading) {
    return <div className="loading">Loading team members...</div>;
  }

  return (
    <div className="team-container">
      <div className="container">
        <div className="team-header">
          <h2>Team Members</h2>
          <button 
            className="btn btn-primary"
            onClick={() => setShowForm(true)}
          >
            Add Member
          </button>
        </div>

        {showForm && (
          <div className="member-form-container">
            <form onSubmit={handleSubmit} className="member-form">
              <h3>{editingMember ? 'Edit Member' : 'Add New Member'}</h3>
              
              <div className="form-group">
                <label>Name *</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  className="form-input"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label>Role</label>
                <select
                  className="form-input"
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                >
                  <option value="Developer">Developer</option>
                  <option value="Designer">Designer</option>
                  <option value="Manager">Manager</option>
                  <option value="QA">QA</option>
                  <option value="DevOps">DevOps</option>
                </select>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  {editingMember ? 'Update' : 'Add'} Member
                </button>
                <button type="button" className="btn btn-secondary" onClick={resetForm}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="team-grid">
          {teamMembers.length === 0 ? (
            <div className="empty-state">
              <p>No team members found. Add your first team member!</p>
            </div>
          ) : (
            teamMembers.map(member => (
              <div key={member.id} className="member-card">
                <div className="member-info">
                  <h3>{member.name}</h3>
                  <p className="member-email">{member.email}</p>
                  <span className="member-role">{member.role}</span>
                </div>
                <div className="member-actions">
                  <button 
                    className="btn btn-secondary"
                    onClick={() => handleEdit(member)}
                  >
                    Edit Role
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Team;