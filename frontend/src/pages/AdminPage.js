// src/pages/AdminPage.js

import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext'; // Import the context hook for notifications
import './AdminPage.css';
import API_URL from '../apiConfig';

function AdminPage() {
    const [submissions, setSubmissions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const { showNotification } = useAppContext(); // Get the notification function

    useEffect(() => {
        // The function is now defined inside the effect
        const fetchSubmissions = async () => {
            setIsLoading(true);
            setError(null);
            const token = localStorage.getItem('authToken');
            try {
                const response = await fetch(`${API_URL}/api/admin/pending-submissions`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!response.ok) {
                    throw new Error('Could not fetch submissions. Are you an admin?');
                }
                const data = await response.json();
                setSubmissions(data);
            } catch (err) {
                setError(err.message);
                showNotification(err.message, 'error');
            } finally {
                setIsLoading(false);
            }
        };

        fetchSubmissions();
    }, [showNotification]);

    const handleAction = async (submissionId, action) => {
        const token = localStorage.getItem('authToken');
        try {
            const response = await fetch(`${API_URL}/api/admin/submission/${submissionId}/${action}`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error);
            
            showNotification(`Submission ${action}d successfully!`, 'success');
            // Remove the submission from the list in the UI without a page refresh
            setSubmissions(prev => prev.filter(sub => sub._id !== submissionId));
        } catch (err) {
            showNotification(err.message, 'error');
        }
    };

    const handleApprove = (submissionId) => handleAction(submissionId, 'approve');
    const handleReject = (submissionId) => handleAction(submissionId, 'reject');

    return (
        <>
            <title>Admin Dashboard - ATLAS</title>
            <div className="admin-container">
                <h1>Pending Submissions ({submissions.length})</h1>
                <p className="admin-description">Review user-submitted scam messages. Approving adds them to the main dataset for model retraining. Rejecting deletes them permanently.</p>

                {isLoading && <p>Loading submissions...</p>}
                {error && <p className="error-message">{error}</p>}
                
                {!isLoading && submissions.length === 0 && (
                    <p>There are no pending submissions to review. Great job!</p>
                )}

                <div className="submission-list">
                    {submissions.map(submission => (
                        <div key={submission._id} className="submission-card">
                            <div className="submission-card-header">
                                <div className="submission-meta">
                                    <span>Submitted on: {new Date(submission.submitted_on).toLocaleDateString()}</span>
                                </div>
                                <div className="submission-actions">
                                    <button className="approve-btn" onClick={() => handleApprove(submission._id)}>Approve</button>
                                    <button className="reject-btn" onClick={() => handleReject(submission._id)}>Reject</button>
                                </div>
                            </div>
                            <div className="submission-text">
                                {submission.text}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

export default AdminPage;