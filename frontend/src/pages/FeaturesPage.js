import React from 'react';
import Header from '../components/Header';
import './FeaturesPage.css';

function FeaturesPage() {
    return (
        <>
            <Header />
            <div className="features-container">
                <div className="features-hero">
                    <h1>Powerful Tools for Your Digital Safety</h1>
                    <p className="features-subtitle">ATLAS provides a suite of analysis tools to protect you from online scams and misinformation. Here's how we keep you safe.</p>
                </div>

                <div className="features-grid">
                    <div className="feature-card">
                        <div className="feature-icon">🔍</div>
                        <h3>Comprehensive Text Analysis</h3>
                        <p>Paste any text, from suspicious emails to weird text messages. Our AI scans for high-risk keywords, phishing language, and other red flags to give you an instant risk assessment.</p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">🔊</div>
                        <h3>Advanced Voice & Audio Analysis</h3>
                        <p>Received a strange voicemail or audio file? Upload it directly. We support a wide range of audio formats (like MP3, WAV, and M4A) by automatically converting them for analysis. Our system transcribes the audio and then scans the text for scam patterns.</p>
                    </div>
                    
                    <div className="feature-card">
                        <div className="feature-icon">🖼️</div>
                        <h3>Screenshot & Image Scanning</h3>
                        <p>Scammers often use images to bypass text-based filters. Upload a screenshot of a suspicious social media post, a meme, or a message. Our Optical Character Recognition (OCR) technology extracts any text from the image and analyzes it for threats.</p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">📊</div>
                        <h3>Intelligent Scam Scoring</h3>
                        <p>Don't guess—get a clear, data-driven rating. Every analysis provides a score indicating how likely the content is a scam, along with a simple explanation. This helps you make quick, informed decisions without needing to be a security expert.</p>
                    </div>
                </div>

                <div className="why-use-atlas">
                    <h2>Why Use ATLAS?</h2>
                    <p>In a digital world full of noise, ATLAS is your clear, simple map to safety. We handle the technical details—like file conversions and complex analysis—so you can get the answers you need instantly. Protect yourself and your loved ones with confidence.</p>
                </div>
            </div>
        </>
    );
}

export default FeaturesPage; 