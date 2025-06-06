import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

function LandingPage() {
    return (
        <div className="landing-container">
            <header className="landing-header">
                <h1>🛡️ Anti-Scam & Misinformation Agent</h1>
                <p>A smart agent to detect, verify, and explain scams in text, voice, or images.</p>
            </header>
            <main className="selection-container">
                <h2>Choose an Analysis Type</h2>
                <div className="card-container">
                    <Link to="/text" className="card text-card">
                        <h3>Text Analysis</h3>
                        <p>Analyze articles, emails, and messages for scams.</p>
                    </Link>
                    <Link to="/voice" className="card voice-card">
                        <h3>Voice Analysis</h3>
                        <p>Check audio clips for voice phishing and scams. (Coming Soon)</p>
                    </Link>
                    <Link to="/image" className="card image-card">
                        <h3>Image Analysis</h3>
                        <p>Detect manipulated images and visual misinformation. (Coming Soon)</p>
                    </Link>
                </div>
            </main>
        </div>
    );
}

export default LandingPage; 