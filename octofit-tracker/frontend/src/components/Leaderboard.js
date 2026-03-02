import React, { useState, useEffect } from 'react';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const codespaceUrl = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev`;
        const endpoint = `${codespaceUrl}/api/leaderboard/`;
        
        console.log('Fetching Leaderboard from:', endpoint);
        
        const response = await fetch(endpoint);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Leaderboard data received:', data);
        
        // Handle both paginated (.results) and plain array responses
        const leaderboardArray = data.results || data;
        setLeaderboard(Array.isArray(leaderboardArray) ? leaderboardArray : []);
        setError(null);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
        setError(error.message);
        setLeaderboard([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <div className="container-fluid py-5">
      <div className="container">
        <div className="row mb-4">
          <div className="col-lg-8">
            <h1 className="display-5 fw-bold text-primary">🏆 Leaderboard</h1>
            <p className="lead text-muted">Compete and climb the rankings</p>
          </div>
        </div>

        {loading && (
          <div className="alert alert-info" role="alert">
            <div className="spinner-border spinner-border-sm me-2" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            Loading leaderboard...
          </div>
        )}

        {error && (
          <div className="alert alert-danger" role="alert">
            <strong>Error:</strong> {error}
          </div>
        )}

        {!loading && !error && leaderboard.length === 0 && (
          <div className="alert alert-warning" role="alert">
            <strong>No leaderboard data found.</strong> Start participating in activities!
          </div>
        )}

        {!loading && !error && leaderboard.length > 0 && (
          <div className="card shadow-sm">
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th className="fw-bold">Rank</th>
                    <th className="fw-bold">User</th>
                    <th className="fw-bold">Team</th>
                    <th className="fw-bold">Points</th>
                    <th className="fw-bold">Activities</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((entry, index) => (
                    <tr key={entry.id} className={index < 3 ? 'table-light' : ''}>
                      <td>
                        {index === 0 && <span className="badge bg-warning text-dark">🥇 1st</span>}
                        {index === 1 && <span className="badge bg-secondary">🥈 2nd</span>}
                        {index === 2 && <span className="badge bg-danger">🥉 3rd</span>}
                        {index >= 3 && <span className="badge bg-light text-dark">{index + 1}</span>}
                      </td>
                      <td className="fw-semibold">{entry.user || 'N/A'}</td>
                      <td>{entry.team || 'N/A'}</td>
                      <td><span className="badge bg-primary">{entry.points || 0}</span></td>
                      <td><span className="badge bg-success">{entry.activities || 0}</span></td>
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

export default Leaderboard;
