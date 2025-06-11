import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import './LandingPage.css';

function LandingPage() {
    return (
        <>
            <Header />
            <div className="landing-container">
                <header className="landing-header">
                    <h1>ATLAS</h1>
                    <p>YOUR DIGITAL MAP TO ONLINE SAFETY</p>
                    <div className="dynamic-text-container">
                        <div className="dynamic-words-wrapper">
                            <div className="dynamic-words-list">
                                <span><strong>PRESERVE WHAT'S REAL.</strong></span>
                                <span><strong>PRESERVE THE FACTS.</strong></span>
                                <span><strong>PRESERVE THE CERTAINTY.</strong></span>
                                <span><strong>PRESERVE THE TRUTH.</strong></span>
                            </div>
                        </div>
                    </div>
                </header>
                <main className="selection-container">
                    <div className="button-container">
                        <Link to="/text" className="action-button primary">
                            Text Analysis
                        </Link>
                        <Link to="/voice" className="action-button secondary">
                            Voice Analysis
                        </Link>
                        <Link to="/image" className="action-button secondary">
                            Image Analysis
                        </Link>
                    </div>
                </main>
            </div>
        </>
    );
}

export default LandingPage; 