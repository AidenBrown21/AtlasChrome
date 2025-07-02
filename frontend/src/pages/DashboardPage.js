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

const ActivityItem = ({ item, isAdmin }) => {
    const isScam = isAdmin ? false : item.result_score > 4.0;
    const itemDate = new Date(isAdmin ? item.approved_on : item.created_at).toLocaleDateString();

    return (
        <div className="activity-item">
            <div className="activity-details">
                {isAdmin ? (
                    <>
                        <strong>ID: {item.id}</strong>
                        <span>Submitted by: {item.submitted_by}</span>
                    </>
                ) : (
                    <>
                        <strong>{item.analysis_type.charAt(0).toUpperCase() + item.analysis_type.slice(1)} Analysis</strong>
                        <span className={`activity-result ${isScam ? 'scam' : 'legit'}`}>{isScam ? 'Scam Detected' : 'Seemed Legit'}</span>
                    </>
                )}
            </div>
            <span className="activity-date">{itemDate}</span>
        </div>
    );
};

function DashboardPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [scamText, setScamText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [logData, setLogData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { showNotification } = useAppContext();
    const { user } = useAuth(); 

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('authToken');
            if (!token || !user) {
                setIsLoading(false);
                return;
            }

            const isAdmin = user.role === 'admin';
            const endpoint = isAdmin ? '/api/admin/approval-log' : '/api/me/activity';
            
            try {
                const response = await fetch(`${API_URL}${endpoint}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!response.ok) throw new Error('Failed to fetch data.');
                const data = await response.json();
                setLogData(data);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [user]);

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

    const isAdmin = user && user.role === 'admin';

    return (
        <>
            <title>Dashboard - ATLAS Protection</title>
            <meta name="description" content="View your ATLAS dashboard for analysis history and statistics." />

            <div className="dashboard-container">
                <h1>Dashboard</h1>
                <div className="dashboard-grid">
                    <div className="dashboard-card tall-card">
                        <h3>{isAdmin ? 'Approval Log' : 'Recent Activity'}</h3>
                        {isLoading ? (
                            <p className="placeholder-text">Loading data...</p>
                        ) : logData.length > 0 ? (
                            <div className="activity-list">
                                {logData.map(item => (
                                    <ActivityItem key={item.id || item._id} item={item} isAdmin={isAdmin} />
                                ))}
                            </div>
                        ) : (
                            <p className="placeholder-text">{isAdmin ? 'No approved items to show.' : 'Your recent analyses will appear here.'}</p>
                        )}
                    </div>

                    {user && user.role === 'admin' ? (
                        <Link to="/admin" className="dashboard-card admin-card">
                            <h3>Review Submissions</h3>
                            <p className="placeholder-text">Approve or reject user-submitted scam examples.</p>
                        </Link>
                    ) : (
                        <div className="dashboard-card">
                            <h3>Statistics</h3>
                            <p className="placeholder-text">Usage stats will be shown here.</p>
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