// src/pages/ProfileScreen.tsx

import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router';

const ProfileScreen: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="app-screen profile-screen">
      <Link to="/" style={{ marginBottom: '20px', display: 'block' }}>← Back to Dashboard</Link>
      
      <h2>My Profile Details</h2>
      
      {user ? (
        <div style={{ padding: '15px', border: '1px solid #ccc', borderRadius: '5px' }}>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>First Name:</strong> {user.given_name || 'N/A'}</p>
          <p><strong>Last Name:</strong> {user.family_name || 'N/A'}</p>
          <p>
            <strong>Cognito Username:</strong> {user['cognito:username'] || 'N/A'}
          </p>
          {/* Loop through all user claims for debugging/displaying extra data */}
          <details>
            <summary>Raw User Data</summary>
            <pre>{JSON.stringify(user, null, 2)}</pre>
          </details>
        </div>
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
  );
};

export default ProfileScreen;