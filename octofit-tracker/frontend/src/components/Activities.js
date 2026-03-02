import React, { useState, useEffect } from 'react';

const Activities = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const codespaceUrl = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev`;
        const endpoint = `${codespaceUrl}/api/activities/`;
        
        console.log('Fetching Activities from:', endpoint);
        
        const response = await fetch(endpoint);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Activities data received:', data);
        
        // Handle both paginated (.results) and plain array responses
        const activitiesArray = data.results || data;
        setActivities(Array.isArray(activitiesArray) ? activitiesArray : []);
        setError(null);
      } catch (error) {
        console.error('Error fetching activities:', error);
        setError(error.message);
        setActivities([]);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  return (
    <div className="container-fluid py-5">
      <div className="container">
        <div className="row mb-4">
          <div className="col-lg-8">
            <h1 className="display-5 fw-bold text-primary">Activities</h1>
            <p className="lead text-muted">Track your fitness activities and progress</p>
          </div>
        </div>

        {loading && (
          <div className="alert alert-info" role="alert">
            <div className="spinner-border spinner-border-sm me-2" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            Loading activities...
          </div>
        )}

        {error && (
          <div className="alert alert-danger" role="alert">
            <strong>Error:</strong> {error}
          </div>
        )}

        {!loading && !error && activities.length === 0 && (
          <div className="alert alert-warning" role="alert">
            <strong>No activities found.</strong> Start tracking your fitness journey!
          </div>
        )}

        {!loading && !error && activities.length > 0 && (
          <div className="card shadow-sm">
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th className="fw-bold">ID</th>
                    <th className="fw-bold">User</th>
                    <th className="fw-bold">Activity Type</th>
                    <th className="fw-bold">Duration (min)</th>
                    <th className="fw-bold">Calories</th>
                    <th className="fw-bold">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {activities.map((activity) => (
                    <tr key={activity.id}>
                      <td><span className="badge bg-secondary">{activity.id}</span></td>
                      <td>{activity.user || 'N/A'}</td>
                      <td><span className="badge bg-info text-dark">{activity.activity_type || 'N/A'}</span></td>
                      <td>{activity.duration || 'N/A'}</td>
                      <td><span className="badge bg-success">{activity.calories_burned || 'N/A'}</span></td>
                      <td>{new Date(activity.date).toLocaleDateString() || 'N/A'}</td>
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

export default Activities;
