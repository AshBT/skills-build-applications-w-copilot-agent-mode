import React, { useState, useEffect } from 'react';

const Workouts = () => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const codespaceUrl = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev`;
        const endpoint = `${codespaceUrl}/api/workouts/`;
        
        console.log('Fetching Workouts from:', endpoint);
        
        const response = await fetch(endpoint);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Workouts data received:', data);
        
        // Handle both paginated (.results) and plain array responses
        const workoutsArray = data.results || data;
        setWorkouts(Array.isArray(workoutsArray) ? workoutsArray : []);
        setError(null);
      } catch (error) {
        console.error('Error fetching workouts:', error);
        setError(error.message);
        setWorkouts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkouts();
  }, []);

  const getDifficultyBadge = (difficulty) => {
    const level = difficulty?.toLowerCase();
    if (level === 'easy') return <span className="badge bg-success">Easy</span>;
    if (level === 'medium') return <span className="badge bg-warning text-dark">Medium</span>;
    if (level === 'hard') return <span className="badge bg-danger">Hard</span>;
    return <span className="badge bg-secondary">N/A</span>;
  };

  return (
    <div className="container-fluid py-5">
      <div className="container">
        <div className="row mb-4">
          <div className="col-lg-8">
            <h1 className="display-5 fw-bold text-primary">💪 Workout Suggestions</h1>
            <p className="lead text-muted">Discover and complete fitness routines</p>
          </div>
        </div>

        {loading && (
          <div className="alert alert-info" role="alert">
            <div className="spinner-border spinner-border-sm me-2" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            Loading workouts...
          </div>
        )}

        {error && (
          <div className="alert alert-danger" role="alert">
            <strong>Error:</strong> {error}
          </div>
        )}

        {!loading && !error && workouts.length === 0 && (
          <div className="alert alert-warning" role="alert">
            <strong>No workouts found.</strong> Check back later for new routines!
          </div>
        )}

        {!loading && !error && workouts.length > 0 && (
          <div className="row">
            {workouts.map((workout) => (
              <div key={workout.id} className="col-lg-4 col-md-6 mb-4">
                <div className="card h-100 shadow-sm border-0 workout-card">
                  <div className="card-header bg-gradient" style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                  }}>
                    <h5 className="card-title text-white mb-0" style={{ fontSize: '1.25rem' }}>
                      {workout.name || 'Workout'}
                    </h5>
                  </div>
                  <div className="card-body">
                    <p className="card-text text-muted">{workout.description || 'No description provided'}</p>
                    <div className="d-flex gap-2 flex-wrap mb-3">
                      <div>
                        <small className="text-muted"><strong>Difficulty:</strong></small><br />
                        {getDifficultyBadge(workout.difficulty)}
                      </div>
                      <div>
                        <small className="text-muted"><strong>Duration:</strong></small><br />
                        <span className="badge bg-info text-dark">{workout.duration || 'N/A'} mins</span>
                      </div>
                    </div>
                  </div>
                  <div className="card-footer bg-light border-top">
                    <button className="btn btn-primary btn-sm w-100">Start Workout</button>
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

export default Workouts;
