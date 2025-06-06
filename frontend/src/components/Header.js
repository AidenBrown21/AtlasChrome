import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

function Header() {
    return (
        <header className="app-header">
            <Link to="/" className="logo">
                <img src="/logo.jpg" alt="ATLAS Logo" className="logo-img" />
            </Link>
            <nav className="main-nav">
                <Link to="/features">Features</Link>
                <Link to="/about">About</Link>
                <Link to="/contact">Contact</Link>
            </nav>
            <div className="header-actions">
                <button className="login-button">Login</button>
                <button className="signup-button">Sign Up</button>
            </div>
        </header>
    );
}

export default Header; 