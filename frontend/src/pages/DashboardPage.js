// src/pages/DashboardPage.js

import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import './DashboardPage.css';
import API_URL from '../apiConfig';

function DashboardPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [scamText, setScamText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const { showNotification } = useAppContext();

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => {
        if (isSubmitting) return;
        setIsModalOpen(false);
        setScamText('');
    };

    const handleModalSubmit = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);
        
        try {
            const response = await fetch(`${API_URL}/api/submit-scam`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: scamText })
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || 'Submission failed');
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
                {/* ... your existing dashboard JSX ... */}
            </div>

            {/* Your modal JSX is perfect and doesn't need to change */}
            {isModalOpen && (
              {/* ... */}
            )}
        </>
    );
}

export default DashboardPage;