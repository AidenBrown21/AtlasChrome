import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

function LandingPage() {
    return (
        <>
            <div className="landing-container">
                <header className="landing-header">
                    <h1>ATLAS</h1>
                    <p>YOUR DIGITAL MAP TO ONLINE SAFETY</p>
                    <div className="dynamic-text-container">
                        <div className="dynamic-words-wrapper">
                            <div className="dynamic-words-list">
                                <div className="phrase">
                                    <span className="phrase-preserve"><strong>PRESERVE</strong></span>
                                    <span className="phrase-dynamic"><strong>WHAT'S REAL.</strong></span>
                                </div>
                                <div className="phrase">
                                    <span className="phrase-preserve"><strong>PRESERVE</strong></span>
                                    <span className="phrase-dynamic"><strong>THE FACTS.</strong></span>
                                </div>
                                <div className="phrase">
                                    <span className="phrase-preserve"><strong>PRESERVE</strong></span>
                                    <span className="phrase-dynamic"><strong>THE CERTAINTY.</strong></span>
                                </div>
                                <div className="phrase">
                                    <span className="phrase-preserve"><strong>PRESERVE</strong></span>
                                    <span className="phrase-dynamic"><strong>THE TRUTH.</strong></span>
                                </div>
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