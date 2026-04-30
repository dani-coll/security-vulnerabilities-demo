import { useNavigate, useSearch } from '@tanstack/react-router';
import { useEffect, useState } from 'react';

const UserDetails = () => {
  const navigate = useNavigate();
  const { username } = useSearch({ from: '/user-details' });
  const [userDetails, setUserDetails] = useState<{ 
    username: string; 
    token: string; 
    sessionInfo?: { 
      loginTime: string; 
      sessionToken: string; 
    } 
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        setLoading(true);
        
        // Get session token from localStorage
        const sessionToken = localStorage.getItem('sessionToken');
        if (!sessionToken) {
          setError('No session token found. Please log in again.');
          return;
        }
        
        const response = await fetch('/api/userDetails', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionToken}`,
          },
        });
        
        if (response.status === 401) {
          setError('Session expired. Please log in again.');
          localStorage.removeItem('sessionToken');
          return;
        }
        
        if (!response.ok) {
          throw new Error('Failed to fetch user details');
        }
        
        const data = await response.json();
        setUserDetails(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

  if (loading) {
    return (
      <div className="user-container">
        <div className="user-header">
          <h2 className="user-title">User Details</h2>
        </div>
        <p className="user-loading">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="user-container">
        <div className="user-header">
          <h2 className="user-title">User Details</h2>
        </div>
        <p className="user-error">Error: {error}</p>
        <button className="user-button" onClick={() => navigate({ to: '/' })}>Back to Login</button>
      </div>
    );
  }

  return (
    <div className="user-container">
      <div className="user-header">
        <h2 className="user-title">User Details</h2>
      </div>
      <div className="user-info">
        <p><span className="user-label">Username:</span> {userDetails?.username || username || 'Unknown'}</p>
        <p><span className="user-label">Token:</span> {userDetails?.token || 'No token available'}</p>
        {userDetails?.sessionInfo && (
          <div className="user-session">
            <p><span className="user-label">Login Time:</span> {new Date(userDetails.sessionInfo.loginTime).toLocaleString()}</p>
          </div>
        )}
      </div>
      <button className="user-button" onClick={() => {
        localStorage.removeItem('sessionToken');
        navigate({ to: '/' });
      }}>
        Logout
      </button>
    </div>
  );
};

export default UserDetails;
