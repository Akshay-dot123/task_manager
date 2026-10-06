import { useState, useEffect } from 'react';
import api from '../api'; // Import the new api instance

export default function Dashboard() {
  const [counts, setCounts] = useState({ open: 0, inProgress: 0, closed: 0 });
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        // Use 'api' instead of 'axios'
        const res = await api.get('/issues/dashboard'); 
        setCounts(res.data);
      } catch (err) {
        console.error("Dashboard fetch FAILED:", err);
        setError(err.response ? err.response.data.message : err.message);
      }
    };
    
    fetchDashboard();
  }, []);

  if (error) {
    return (
      <div style={{ padding: '20px', color: 'red', background: '#fee', borderRadius: '8px' }}>
        <h3>Dashboard Error</h3>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Dashboard</h1>
      <div style={{ display: 'flex', gap: '20px' }}>
        <div style={{ padding: '20px', background: '#fee', borderRadius: '8px' }}>
          <h2>Open</h2><p>{counts.open}</p>
        </div>
        <div style={{ padding: '20px', background: '#ffe', borderRadius: '8px' }}>
          <h2>In Progress</h2><p>{counts.inProgress}</p>
        </div>
        <div style={{ padding: '20px', background: '#efe', borderRadius: '8px' }}>
          <h2>Closed</h2><p>{counts.closed}</p>
        </div>
      </div>
    </div>
  );
}