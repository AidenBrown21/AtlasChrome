// src/pages/DashboardPage.js

import React, { useState } from 'react';
import Header from '../components/Header';
import './DashboardPage.css';
// import API_URL from '../apiConfig';
// import { useAuth } from '../context/AuthContext';

function DashboardPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [scamText, setScamText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => {
        if (isSubmitting) return;
        setIsModalOpen(false);
        setScamText('');
    };

    const handleModalSubmit = (event) => {
        event.preventDefault();
        setIsSubmitting(true);
        console.log("Submitting scam text:", scamText);

        setTimeout(() => {
            console.log("Submission successful!");
            setIsSubmitting(false);
            closeModal();
        }, 1500);
    };

    return (
        <>
            <title>Dashboard - ATLAS Protection</title>
            <meta name="description" content="View your ATLAS dashboard for analysis history and statistics." />
            
            <Header />

            <div className="dashboard-container">
                <h1>Dashboard</h1>
                <div className="dashboard-grid">
                    <div className="dashboard-card tall-card">
                        <h3>Recent Activity</h3>
                        <p className="placeholder-text">Your recent analysis results will appear here.</p>
                    </div>
                    <div className="dashboard-card">
                        <h3>Statistics</h3>
                        <p className="placeholder-text">Usage stats will be shown here.</p>
                    </div>

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