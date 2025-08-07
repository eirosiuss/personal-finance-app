import { useAuth } from './context/AuthContext.jsx';
import axios from './axios.js';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

function Dashboard() {
  const { user, setUser, loading } = useAuth();
  const navigate = useNavigate();

    useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [loading, user, navigate]);

  const handleLogout = async () => {
    await axios.post('/api/auth/logout', {}, { withCredentials: true });
    setUser(null);
    navigate('/login');
  };

  if (loading) return <p>Loading...</p>; 

  return (
    <div>
      <h2>Welcome, {user.email}</h2>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Dashboard;
