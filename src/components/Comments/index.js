import React, { useState, useEffect, useCallback } from 'react';
import './index.css';

const FIREBASE_URL = 'https://workboardlite-default-rtdb.firebaseio.com';

const Comments = ({ taskId }) => {
  const [comments, setComments] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [selectedAuthor, setSelectedAuthor] = useState('');

  const fetchComments = useCallback(async () => {
    try {
      const response = await fetch(`${FIREBASE_URL}/comments.json`);
      const data = await response.json();
      
      if (data) {
        const commentsArray = Object.keys(data)
          .map(key => ({ id: key, ...data[key] }))
          .filter(comment => comment.task_id === taskId)
          .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        setComments(commentsArray);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  }, [taskId]);

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
        if (membersArray.length > 0 && !selectedAuthor) {
          setSelectedAuthor(membersArray[0].id);
        }
      }
    } catch (error) {
      console.error('Error fetching team members:', error);
    }
  }, [selectedAuthor]);

  useEffect(() => {
    fetchComments();
    fetchTeamMembers();
  }, [fetchComments, fetchTeamMembers]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!newComment.trim() || !selectedAuthor) {
      alert('Please enter a comment and select an author');
      return;
    }

    try {
      const commentData = {
        task_id: taskId,
        author: selectedAuthor,
        comment_text: newComment.trim(),
        timestamp: new Date().toISOString()
      };

      await fetch(`${FIREBASE_URL}/comments.json`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(commentData),
      });
      
      setNewComment('');
      fetchComments();
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('Error adding comment');
    }
  };

  const getMemberName = (memberId) => {
    const member = teamMembers.find(m => m.id === memberId);
    return member ? member.name : 'Unknown';
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  if (loading) {
    return <div className="comments-loading">Loading comments...</div>;
  }

  return (
    <div className="comments-container">
      <form onSubmit={handleSubmit} className="comment-form">
        <div className="comment-input-group">
          <select
            className="author-select"
            value={selectedAuthor}
            onChange={(e) => setSelectedAuthor(e.target.value)}
            required
          >
            <option value="">Select Author</option>
            {teamMembers.map(member => (
              <option key={member.id} value={member.id}>
                {member.name}
              </option>
            ))}
          </select>
          <textarea
            className="comment-input"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            rows="3"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary comment-submit">
          Add Comment
        </button>
      </form>

      <div className="comments-list">
        {comments.length === 0 ? (
          <div className="no-comments">
            <p>No comments yet. Be the first to comment!</p>
          </div>
        ) : (
          comments.map(comment => (
            <div key={comment.id} className="comment-item">
              <div className="comment-header">
                <span className="comment-author">
                  {getMemberName(comment.author)}
                </span>
                <span className="comment-timestamp">
                  {formatTimestamp(comment.timestamp)}
                </span>
              </div>
              <div className="comment-text">
                {comment.comment_text}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Comments;