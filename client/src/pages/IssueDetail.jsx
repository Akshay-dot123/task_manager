import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function IssueDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [issue, setIssue] = useState(null);
  const [users, setUsers] = useState([]);
  const [commentText, setCommentText] = useState('');

  const fetchIssue = async () => {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/issues`);
    const found = res.data.find(i => i._id === id);
    setIssue(found);
  };

  useEffect(() => {
    fetchIssue();
    axios.get(`${import.meta.env.VITE_API_URL}/issues/users`).then(res => setUsers(res.data));
  }, [id]);

  const handleUpdate = async (field, value) => {
    const { data } = await axios.put(`${import.meta.env.VITE_API_URL}/issues/${id}`, { [field]: value });
    setIssue(data);
  };

  const handleComment = async (e) => {
    e.preventDefault();
    await axios.post(`${import.meta.env.VITE_API_URL}/issues/${id}/comments`, { text: commentText });
    setCommentText('');
    fetchIssue(); // Refetch to get populated user names in comments
  };

  if (!issue) return <p>Loading...</p>;

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <button onClick={() => navigate('/issues')} style={{ marginBottom: '20px', cursor: 'pointer', padding: '8px 15px' }}>Back to Issues</button>
      
      <h1>{issue.title}</h1>
      <p>Description: {issue.description}</p>
      
      <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
        <div>
          <strong>Status:</strong>
          <select value={issue.status} onChange={(e) => handleUpdate('status', e.target.value)} style={{ marginLeft: '10px', padding: '5px' }}>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
        <div>
          <strong>Assign To:</strong>
          <select value={issue.assignee?._id || ''} onChange={(e) => handleUpdate('assignee', e.target.value)} style={{ marginLeft: '10px', padding: '5px' }}>
            <option value="">Unassigned</option>
            {users.map(u => <option key={u._id} value={u._id}>{u.name}</option>)}
          </select>
        </div>
      </div>

      <hr style={{ margin: '30px 0' }} />
      
      <h2>Comments</h2>
      <form onSubmit={handleComment} style={{ marginBottom: '20px' }}>
        <textarea 
          value={commentText} 
          onChange={(e) => setCommentText(e.target.value)} 
          placeholder="Add a comment..." 
          required 
          style={{ width: '100%', padding: '8px', marginBottom: '10px', boxSizing: 'border-box' }} 
        />
        <button type="submit" style={{ padding: '8px 15px', cursor: 'pointer' }}>Post Comment</button>
      </form>

      <div>
        {issue.comments && issue.comments.length > 0 ? (
          issue.comments.map((c, idx) => (
            <div key={idx} style={{ padding: '10px', border: '1px solid #eee', borderRadius: '5px', marginBottom: '10px' }}>
              <strong>{c.user?.name || c.user || 'User'}:</strong> <span style={{ fontSize: '0.8em', color: 'gray' }}>{new Date(c.createdAt).toLocaleString()}</span>
              <p style={{ margin: '5px 0 0' }}>{c.text}</p>
            </div>
          ))
        ) : (
          <p>No comments yet.</p>
        )}
      </div>
    </div>
  );
}