import React from 'react';
import './ContactPage.css';

function ContactPage() {
    return (
        <>
            <title>Contact Us - ATLAS Scam Protection</title>
            <meta name="description" content="Get in touch with the development team behind ATLAS. We welcome your feedback and questions about our online safety and scam analysis tools." />
            <div className="contact-container">
                <h1>Contact The Team</h1>
                <div className="contact-columns">
                    <div className="contact-column">
                        <a href="https://github.com/inthezone006/" target="_blank" rel="noopener noreferrer" className="contact-photo-link">
                            <img src="/Rahul.jpg" alt="Rahul Menon" className="contact-photo" />
                            <div className="photo-overlay">
                                <p>Click to go to Github Page</p>
                            </div>
                        </a>
                        <div className="contact-name-container">
                            <p><strong>Rahul Menon</strong></p>
                            <a href="https://www.linkedin.com/in/rahul-menon6/" target="_blank" rel="noopener noreferrer">
                                <img src="/INlogo.jpg" alt="LinkedIn" className="linkedin-logo" />
                            </a>
                        </div>
                        <p>menon75@purdue.edu</p>
                    </div>
                    <div className="contact-column">
                        <a href="https://github.com/aidenbrown21" target="_blank" rel="noopener noreferrer" className="contact-photo-link">
                            <img src="/Aiden.jpg" alt="Aiden Brown" className="contact-photo" />
                            <div className="photo-overlay">
                                <p>Click to go to Github Page</p>
                            </div>
                        </a>
                        <div className="contact-name-container">
                            <p><strong>Aiden Brown</strong></p>
                            <a href="https://www.linkedin.com/in/aidenbrown21/" target="_blank" rel="noopener noreferrer">
                                <img src="/INlogo.jpg" alt="LinkedIn" className="linkedin-logo" />
                            </a>
                        </div>
                        <p>brow2423@purdue.edu</p>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ContactPage;