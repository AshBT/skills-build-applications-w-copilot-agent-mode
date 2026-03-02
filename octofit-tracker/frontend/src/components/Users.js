import React, { useState, useEffect } from 'react';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const codespaceUrl = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev`;
        const endpoint = `${codespaceUrl}/api/users/`;
        
        console.log('Fetching Users from:', endpoint);
        
        const response = await fetch(endpoint);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Users data received:', data);
        
        // Handle both paginated (.results) and plain array responses
        const usersArray = data.results || data;
        setUsers(Array.isArray(usersArray) ? usersArray : []);
        setError(null);
      } catch (error) {
        console.error('Error fetching users:', error);
        setError(error.message);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="container-fluid py-5">
      <div className="container">
        <div className="row mb-4">
          <div className="col-lg-8">
            <h1 className="display-5 fw-bold text-primary">👤 Users</h1>
            <p className="lead text-muted">View all community members</p>
          </div>
        </div>

        {loading && (
          <div className="alert alert-info" role="alert">
            <div className="spinner-border spinner-border-sm me-2" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            Loading users...
          </div>
        )}

        {error && (
          <div className="alert alert-danger" role="alert">
            <strong>Error:</strong> {error}
          </div>
        )}

        {!loading && !error && users.length === 0 && (
          <div className="alert alert-warning" role="alert">
            <strong>No users found.</strong> Be the first to join!
          </div>
        )}

        {!loading && !error && users.length > 0 && (
          <div className="card shadow-sm">
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th className="fw-bold">ID</th>
                    <th className="fw-bold">Username</th>
                    <th className="fw-bold">Email</th>
                    <th className="fw-bold">First Name</th>
                    <th className="fw-bold">Last Name</th>
                    <th className="fw-bold">Join Date</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td><span className="badge bg-secondary">{user.id}</span></td>
                      <td><strong>{user.username || 'N/A'}</strong></td>
                      <td><a href={`mailto:${user.email}`} className="text-decoration-none">{user.email || 'N/A'}</a></td>
                      <td>{user.first_name || 'N/A'}</td>
                      <td>{user.last_name || 'N/A'}</td>
                      <td>{user.date_joined ? new Date(user.date_joined).toLocaleDateString() : 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Users;
