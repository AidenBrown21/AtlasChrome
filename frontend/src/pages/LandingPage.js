import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

function LandingPage() {
    return (
        <>
            <title>ATLAS | Your Digital Map to Online Safety</title>
            <meta name="description" content="Protect yourself from online scams with ATLAS. Our free suite of analysis tools for text, voice, and images helps you identify threats and navigate the digital world safely." />
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
                <Link to="/vision" className="cta-button">
                        Check out our mission →
                </Link>
            </div>
        </>
    );
}

export default LandingPage; 