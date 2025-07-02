// src/pages/AdminPage.js

import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import './AdminPage.css';
import API_URL from '../apiConfig';

function AdminPage() {
    const [submissions, setSubmissions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // We will add the logic to fetch, approve, and reject submissions here later.

    return (
        <>
            <title>Admin Dashboard - ATLAS</title>
            <Header />
            <div className="admin-container">
                <h1>Pending Submissions</h1>
                <p className="admin-description">Review user-submitted scam messages. Approving adds them to the main dataset for model retraining. Rejecting deletes them permanently.</p>

                {/* We will map over the submissions and display them here later */}
            </div>
        </>
    );
}

export default AdminPage;