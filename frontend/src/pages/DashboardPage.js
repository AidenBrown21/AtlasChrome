import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import './DashboardPage.css';
import API_URL from '../apiConfig';
import { jwtDecode } from 'jwt-decode';

const useAuth = () => {
    const token = localStorage.getItem('authToken');
    if (!token) return { user: null };

    try {
        const decoded = jwtDecode(token);
        return { user: decoded };
    } catch (e) {
        return { user: null };
    }
};

const LogItem = ({ item, isAdmin }) => {
    const logDate = new Date(item.approved_on).toLocaleDateString();

    return (
        <div className="activity-item">
            <span className="activity-icon">
                {isAdmin ? '✅' : '📤'}
            </span>
            <div className="activity-details">
                <span className="log-text-snippet">"{item.text.substring(0, 50)}..."</span>
                {isAdmin ? (
                    <span className="log-meta">You approved this on {logDate}</span>
                ) : (
                    <span className="log-meta">You submitted this (approved on {logDate})</span>
                )}
            </div>
        </div>
    );
};

function DashboardPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [scamText, setScamText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [logData, setLogData] = useState([]);
    const [stats, setStats] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const { showNotification } = useAppContext();
    const { user } = useAuth(); 
    const isAdmin = user && user.role === 'admin';

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('authToken');
            if (!token) {
                setIsLoading(false);
                return;
            }
            
            try {
                const [logRes, statsRes] = await Promise.all([
                    fetch(`${API_URL}/api/dashboard/log`, { headers: { 'Authorization': `Bearer ${token}` } }),
                    fetch(`${API_URL}/api/me/stats`, { headers: { 'Authorization': `Bearer ${token}` } })
                ]);

                if (!logRes.ok) throw new Error('Failed to fetch log data.');
                if (!statsRes.ok) throw new Error('Failed to fetch stats.');
                
                const logData = await logRes.json();
                const statsData = await statsRes.json();

                setLogData(logData);
                setStats(statsData);
            } catch (error) {
                console.error(error);
                showNotification(error.message, 'error');
            } finally {
                setIsLoading(false);
            }
        };

        if (user) {
            fetchData();
        }
    }, [user, showNotification]);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => {
        if (isSubmitting) return;
        setIsModalOpen(false);
        setScamText('');
    };

    const handleModalSubmit = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);

        const token = localStorage.getItem('authToken');

        if (!token) {
            showNotification('You must be logged in to submit.', 'error');
            setIsSubmitting(false);
            return;
        }

        try {
            const response = await fetch(`${API_URL}/api/submit-scam`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ text: scamText })
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Submission failed');
            }

            showNotification('Submission successful. Thank you!', 'success');
            closeModal();

        } catch (error) {
            showNotification(error.message, 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <title>Dashboard - ATLAS Protection</title>
            <meta name="description" content="View your ATLAS dashboard for analysis history and statistics." />

            <div className="dashboard-container">
                <h1>Dashboard</h1>
                <div className="dashboard-grid">
                    <div className="dashboard-card tall-card">
                        <h3>{isAdmin ? 'Your Approval History' : 'Your Submission History'}</h3>
                        {isLoading ? (
                            <p className="placeholder-text">Loading history...</p>
                        ) : logData.length > 0 ? (
                            <div className="activity-list">
                                {logData.map(item => (
                                    <LogItem key={item._id} item={item} isAdmin={isAdmin} />
                                ))}
                            </div>
                        ) : (
                            <p className="placeholder-text">{isAdmin ? 'Your approved items will appear here.' : 'Your submitted items will appear here after they are approved.'}</p>
                        )}
                    </div>

                    {isAdmin ? (
                        <Link to="/admin" className="dashboard-card admin-card">
                            <h3>Review Submissions</h3>
                            <p className="placeholder-text">Approve or reject new user-submitted scam examples.</p>
                        </Link>
                    ) : (
                        <div className="dashboard-card">
                            <h3>Statistics</h3>
                            {isLoading ? (
                                <p className="placeholder-text">Loading stats...</p>
                            ) : stats ? (
                                <div className="stats-grid">
                                    <div className="stat-item">
                                        <span className="stat-value">{stats.total_analyses}</span>
                                        <span className="stat-label">Analyses Ran</span>
                                    </div>
                                    <div className="stat-item">
                                        <span className="stat-value">{stats.scams_detected}</span>
                                        <span className="stat-label">Scams Detected</span>
                                    </div>
                                    <div className="stat-item">
                                        <span className="stat-value">{stats.community_submissions}</span>
                                        <span className="stat-label">Submissions Approved</span>
                                    </div>
                                </div>
                            ) : (
                                <p className="placeholder-text">No stats to show yet.</p>
                            )}
                        </div>
                    )}

                    <div className="dashboard-card submit-card" onClick={openModal}>
                        <h3>Submit New Scam</h3>
                        <p className="placeholder-text">Help improve ATLAS by submitting new scam examples you encounter.</p>
                    </div>
                </div>
            </div>


            {isModalOpen && (
                <div className="submission-modal-overlay" onClick={closeModal}>
                    <div className="submission-modal" onClick={(e) => e.stopPropagation()}>
                        <h2>Submit a Scam Example</h2>
                        <p className="modal-description">Paste the full text of a scam email, text, or message below. This will be reviewed by our team and used to improve ATLAS for everyone.</p>
                        <form onSubmit={handleModalSubmit}>
                            <textarea
                                value={scamText}
                                onChange={(e) => setScamText(e.target.value)}
                                placeholder="Paste scam text here..."
                                required
                                minLength="50"
                            />
                            <div className="modal-actions">
                                <button type="button" className="button-secondary" onClick={closeModal} disabled={isSubmitting}>Cancel</button>
                                <button type="submit" className="button-primary" disabled={isSubmitting || scamText.length < 50}>
                                    {isSubmitting ? 'Submitting...' : 'Submit for Review'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}

export default DashboardPage;