import React from 'react';
import './AboutPage.css';

function AboutPage() {
    return (
        <>
            <title>About ATLAS - Our Mission for Online Safety</title>
            <meta name="description" content="Learn about ATLAS, the powerful scam protection tool designed to keep you safe online. Discover our mission to fight misinformation and empower users." />
            <div className="about-container">
                <h1>About ATLAS</h1>
                <p>
                    ATLAS is your digital map to online safety. In an age of rampant misinformation and sophisticated scams, ATLAS provides you with the tools to navigate the digital world with confidence.
                </p>
                <h2>Our Mission</h2>
                <p>
                    Our mission is to empower users to detect, verify, and understand scams and fake news. We believe that with the right tools, everyone can protect themselves from digital threats. We analyze text, voice, and images to identify potential risks and provide clear explanations, helping you make informed decisions.
                </p>
                <h2>How It Works</h2>
                <p>
                    Using state-of-the-art AI and machine learning models, ATLAS examines the content you provide for common patterns and indicators of scams. Whether it's a suspicious email, a strange voice message, or a questionable image, our platform gives you a real-time analysis to keep you safe.
                </p>
            </div>
        </>
    );
}

export default AboutPage; 