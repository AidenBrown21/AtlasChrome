import React from 'react';
import Header from '../components/Header';
import './ContactPage.css';

function ContactPage() {
    return (
        <>
            <Header />
            <div className="contact-container">
                <h1>Contact Us</h1>
                <div className="contact-columns">
                    <div className="contact-column">
                        <a href="https://github.com/inthezone006/" target="_blank" rel="noopener noreferrer" className="contact-photo-link">
                            <img src="/Rahul.jpg" alt="Rahul Menon" className="contact-photo" />
                            <div className="photo-overlay">
                                <p>Click to go to Github Page</p>
                            </div>
                        </a>
                        <p><strong>Rahul Menon</strong></p>
                        <p>menon75@purdue.edu</p>
                        <a href="https://www.linkedin.com/in/rahul-menon6/" target="_blank" rel="noopener noreferrer">
                            <img src="/INlogo.jpg" alt="LinkedIn" className="linkedin-logo" />
                        </a>
                    </div>
                    <div className="contact-column">
                        <a href="https://github.com/aidenbrown21" target="_blank" rel="noopener noreferrer" className="contact-photo-link">
                            <img src="/Aiden.jpg" alt="Aiden Brown" className="contact-photo" />
                            <div className="photo-overlay">
                                <p>Click to go to Github Page</p>
                            </div>
                        </a>
                        <p><strong>Aiden Brown</strong></p>
                        <p>brow2423@purdue.edu</p>
                        <a href="https://www.linkedin.com/in/aidenbrown21/" target="_blank" rel="noopener noreferrer">
                            <img src="/INlogo.jpg" alt="LinkedIn" className="linkedin-logo" />
                        </a>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ContactPage;