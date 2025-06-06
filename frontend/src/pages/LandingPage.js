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