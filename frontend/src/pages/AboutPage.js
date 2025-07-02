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
                    ATLAS is your digital map to online safety. In the current age of widespread misinformation and advanced scams, ATLAS provides you with tools to help navigate the digital world with confidence.
                </p>
                <h2>Our Mission</h2>
                <p>
                    Our mission is to provide users smart tools to detect, verify, and understand scams and fake news. We believe that with the right tools and explanations, everyone can protect themselves from digital threats. ATLAS can analyze either text, audio, or image data and identify potential risks and provide clear explanations, helping you make informed decisions.
                </p>
                <h2>How It Works</h2>
                <p>
                    Using constantly-improving AI and machine learning models, ATLAS examines the content you provide for common patterns and indicators of scams. Whether it's  a strange email, an odd voice message, or a questionable image, our platform can scan through various forms of media to form an analysis to keep you safe.
                </p>
            </div>
        </>
    );
}

export default AboutPage; 