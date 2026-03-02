import React, { useState, useEffect } from 'react';

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const codespaceUrl = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev`;
        const endpoint = `${codespaceUrl}/api/teams/`;
        
        console.log('Fetching Teams from:', endpoint);
        
        const response = await fetch(endpoint);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Teams data received:', data);
        
        // Handle both paginated (.results) and plain array responses
        const teamsArray = data.results || data;
        setTeams(Array.isArray(teamsArray) ? teamsArray : []);
        setError(null);
      } catch (error) {
        console.error('Error fetching teams:', error);
        setError(error.message);
        setTeams([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  return (
    <div className="container-fluid py-5">
      <div className="container">
        <div className="row mb-4">
          <div className="col-lg-8">
            <h1 className="display-5 fw-bold text-primary">👥 Teams</h1>
            <p className="lead text-muted">Join a team and compete together</p>
          </div>
        </div>

        {loading && (
          <div className="alert alert-info" role="alert">
            <div className="spinner-border spinner-border-sm me-2" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            Loading teams...
          </div>
        )}

        {error && (
          <div className="alert alert-danger" role="alert">
            <strong>Error:</strong> {error}
          </div>
        )}

        {!loading && !error && teams.length === 0 && (
          <div className="alert alert-warning" role="alert">
            <strong>No teams found.</strong> Create or join a team to get started!
          </div>
        )}

        {!loading && !error && teams.length > 0 && (
          <div className="row">
            {teams.map((team) => (
              <div key={team.id} className="col-lg-4 col-md-6 mb-4">
                <div className="card h-100 shadow-sm border-0">
                  <div className="card-header bg-primary text-white">
                    <h5 className="card-title mb-0" style={{ fontSize: '1.25rem' }}>{team.name}</h5>
                  </div>
                  <div className="card-body">
                    <p className="card-text text-muted">{team.description || 'No description provided'}</p>
                  </div>
                  <div className="card-footer bg-light border-top">
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="badge bg-success">👥 {team.members_count || 0} members</span>
                      <a href="#" className="btn btn-sm btn-primary">View</a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Teams;
