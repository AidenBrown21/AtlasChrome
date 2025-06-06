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
                        <img src="/Rahul.jpg" alt="Rahul Menon" className="contact-photo" />
                        <p><strong>Rahul Menon</strong></p>
                        <p>menon75@purdue.edu</p>
                    </div>
                    <div className="contact-column">
                        <img src="/Aiden.jpg" alt="Aiden Brown" className="contact-photo" />
                        <p><strong>Aiden Brown</strong></p>
                        <p>brow2423@purdue.edu</p>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ContactPage; 