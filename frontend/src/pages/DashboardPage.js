// src/pages/DashboardPage.js

import React from 'react';
import './DashboardPage.css';

function DashboardPage() {
    return (
        <>
            <title>Your Dashboard - ATLAS Protection</title>
            <meta name="description" content="View your ATLAS dashboard for analysis history and statistics." />

            <div className="dashboard-container">
                <h1>Your Dashboard</h1>
                <div className="dashboard-grid">
                    <div className="dashboard-card tall-card">
                        <h3>Recent Activity</h3>
                        {/* Content will go here later */}
                    </div>
                    <div className="dashboard-card">
                        <h3>Statistics</h3>
                        {/* Content will go here later */}
                    </div>
                    <div className="dashboard-card">
                        <h3>Submit New Scam</h3>
                        {/* Content will go here later */}
                    </div>
                </div>
            </div>
        </>
    );
}

export default DashboardPage;