import React from 'react';
import './WhatsNewPage.css';

function WhatsNewPage() {
    return (
        <>
            <title>What's New - ATLAS Protection</title>
            <meta name="description" content="See the latest updates, new features, and future roadmap for the ATLAS Scam Protection suite of tools." />

            <div className="whats-new-container">
                <h1>What's New in ATLAS</h1>
                <p className="subtitle">Follow our progress as we build the best tools for digital safety.</p>
                
                <div className="update-section">
                    <h2>Version 2.0 - The Dashboard & Admin Update</h2>
                    <p className="update-date">Released June 2025</p>
                    <ul className="update-list">
                        <li><span className="badge new">NEW</span> Introduced the User Dashboard, a central hub for all logged-in users.</li>
                        <li><span className="badge new">NEW</span> Added a dynamic log to the dashboard showing personal activity for users and an approval log for admins.</li>
                        <li><span className="badge new">NEW</span> Implemented the "Submit New Scam" feature, allowing the community to contribute to our dataset via a pop-up modal.</li>
                        <li><span className="badge new">NEW</span> Created a complete back-end Admin system for reviewing and approving/rejecting user-submitted scams.</li>
                        <li><span className="badge improve">IMPROVE</span> The dashboard now intelligently shows different content based on whether the user is a regular user or an admin.</li>
                    </ul>
                </div>

                <div className="update-section">
                    <h2>Version 1.0 - The Foundation</h2>
                    <p className="update-date">Released May 2025</p>
                    <ul className="update-list">
                        <li><span className="badge new">NEW</span> Deployed the core backend (Flask) and frontend (React) infrastructure on Azure.</li>
                        <li><span className="badge new">NEW</span> Launched the three core analysis engines: Text, Voice, and Image.</li>
                        <li><span className="badge new">NEW</span> Implemented a full Dark Mode theme across the entire site with a toggle in the header.</li>
                        <li><span className="badge new">NEW</span> Reworked user authentication to use a robust, persistent token-based system that works on all devices.</li>
                        <li><span className="badge improve">IMPROVE</span> Made the entire website fully responsive for a seamless experience on desktop and mobile.</li>
                        <li><span className="badge improve">IMPROVE</span> Redesigned the landing page with a dynamic video background and updated header navigation with multi-level dropdowns.</li>
                        <li><span className="badge improve">IMPROVE</span> Set up the website as an installable Progressive Web App (PWA) with custom icons.</li>
                    </ul>
                </div>

                <div className="update-section">
                    <h2>What's Next - The Roadmap</h2>
                    <p className="update-date">Coming Soon</p>
                    <ul className="update-list">
                        <li><span className="badge future">PLANNED</span> Automated retraining pipeline for the machine learning model using new submissions.</li>
                        <li><span className="badge future">PLANNED</span> Building out the "Statistics" card on the user dashboard.</li>
                        <li><span className="badge future">PLANNED</span> Native desktop and mobile applications.</li>
                    </ul>
                </div>

            </div>
        </>
    );
}

export default WhatsNewPage;