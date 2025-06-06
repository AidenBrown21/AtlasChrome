import React from 'react';
import { Link } from 'react-router-dom';
import './Placeholder.css';

function ImageAnalysis() {
    return (
        <div className="placeholder-container">
            <h1>Image Analysis</h1>
            <p>This feature is currently under development and will be available soon.</p>
            <img src="https://placehold.co/400x300/2ecc71/white?text=Coming+Soon" alt="Coming Soon" />
            <Link to="/" className="back-link">Return to Home</Link>
        </div>
    );
}

export default ImageAnalysis; 