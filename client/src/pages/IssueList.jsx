import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function IssueList() {
  const [issues, setIssues] = useState([]);
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignee, setAssignee] = useState('');

  const fetchData = async () => {
    const { data: issuesData } = await axios.get(`${import.meta.env.VITE_API_URL}/issues`);
    setIssues(issuesData);
    const { data: usersData } = await axios.get(`${import.meta.env.VITE_API_URL}/issues/users`);
    setUsers(usersData);
  };

  useEffect(() => {
    fetchData();
  }, []);

    const handleCreate = async (e) => {
    e.preventDefault();
    
    // FIX: Only add assignee to the payload if it's not an empty string
    const payload = { title, description };
    if (assignee) {
      payload.assignee = assignee;
    }

    await axios.post(`${import.meta.env.VITE_API_URL}/issues`, payload);
    setTitle(''); setDescription(''); setAssignee(''); setShowForm(false);
    fetchData();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this issue?')) {
      await axios.delete(`${import.meta.env.VITE_API_URL}/issues/${id}`);
      fetchData();
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Issues</h1>
        <button onClick={() => setShowForm(!showForm)} style={{ padding: '8px 15px', cursor: 'pointer' }}>
          {showForm ? 'Cancel' : 'Create Issue'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ccc', borderRadius: '8px' }}>
          <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required style={{ width: '100%', padding: '8px', marginBottom: '10px', boxSizing: 'border-box' }} />
          <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required style={{ width: '100%', padding: '8px', marginBottom: '10px', boxSizing: 'border-box' }} />
          <select value={assignee} onChange={(e) => setAssignee(e.target.value)} style={{ padding: '8px', marginBottom: '10px' }}>
            <option value="">Assign to (Optional)</option>
            {users.map(u => <option key={u._id} value={u._id}>{u.name}</option>)}
          </select>
          <br />
          <button type="submit" style={{ padding: '8px 15px', cursor: 'pointer' }}>Submit</button>
        </form>
      )}

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #ccc', textAlign: 'left' }}>
            <th style={{ padding: '10px' }}>Title</th>
            <th style={{ padding: '10px' }}>Status</th>
            <th style={{ padding: '10px' }}>Assigned To</th>
            <th style={{ padding: '10px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {issues.map(issue => (
            <tr key={issue._id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '10px' }}><Link to={`/issues/${issue._id}`}>{issue.title}</Link></td>
              <td style={{ padding: '10px' }}>{issue.status}</td>
              <td style={{ padding: '10px' }}>{issue.assignee ? issue.assignee.name : 'Unassigned'}</td>
              <td style={{ padding: '10px' }}>
                <button onClick={() => handleDelete(issue._id)} style={{ color: 'red', cursor: 'pointer', background: 'none', border: 'none' }}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}