import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';
// import API_URL from '../apiConfig';
import REACT_APP_API_URL from '../apiConfig';
import Notification from './Notification/Notification';

function Header() {
    const [showLogin, setShowLogin] = useState(false);
    const [showSignup, setShowSignup] = useState(false);
    const [user, setUser] = useState(null);
    const [loginError, setLoginError] = useState('');
    const [signupError, setSignupError] = useState('');
    const [loginForm, setLoginForm] = useState({ username: '', password: '' });
    const [signupForm, setSignupForm] = useState({ first_name: '', last_name: '', username: '', password: '' });
    const [showLoginPassword, setShowLoginPassword] = useState(false);
    const [showSignupPassword, setShowSignupPassword] = useState(false);

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const [notification, setNotification] = useState({ message: '', visible: false });
    const location = useLocation();
    const isHomePage = location.pathname === '/';

    useEffect(() => {
        if (notification.visible) {
            const timer = setTimeout(() => {
                setNotification(prev => ({ ...prev, visible: false }));
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [notification.visible]);

    const showNotification = (message) => {
        setNotification({ message, visible: true });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoginError('');
        try {
            const res = await fetch(`${REACT_APP_API_URL}/api/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(loginForm),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Login failed');
            setUser(data.user);
            setShowLogin(false);
            setLoginForm({ username: '', password: '' });
            showNotification('Login Successful!');
        } catch (err) {
            setLoginError(err.message);
        }
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        setSignupError('');
        try {
            const res = await fetch(`${REACT_APP_API_URL}/api/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(signupForm),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Sign up failed');
            // Auto-login after signup
            await handleLogin({
                preventDefault: () => {},
                target: { value: '' },
            });
            setShowSignup(false);
            setSignupForm({ first_name: '', last_name: '', username: '', password: '' });
            showNotification('Signup Successful!');
        } catch (err) {
            setSignupError(err.message);
        }
    };

    const handleLogout = async () => {
        await fetch(`${REACT_APP_API_URL}/api/logout`, {
            method: 'POST',
            credentials: 'include',
        });
        setUser(null);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    return (
        <>
        <header className={`app-header ${!isHomePage ? 'is-static' : ''}`}>
            <header className="app-header">
                <Link to="/" className="logo">
                    <img src="/logo.jpg" alt="ATLAS Logo" className="logo-img" />
                </Link>
                <button className={`hamburger-button ${isMenuOpen ? 'is-open' : ''}`} onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
                <nav className="main-nav-desktop">
                    <Link to="/features">Features</Link>
                    <Link to="/about">About</Link>
                    <Link to="/contact">Contact</Link>
                </nav>
                <div className="header-actions-desktop">
                    {user ? (
                        <>
                            <span className="user-greeting">Hi, {user.first_name}</span>
                            <button className="logout-button" onClick={handleLogout}>Sign Out</button>
                        </>
                    ) : (
                        <>
                            <button className="login-button" onClick={() => setShowLogin(true)}>Login</button>
                            <button className="signup-button" onClick={() => setShowSignup(true)}>Sign Up</button>
                        </>
                    )}
                </div>
                {isMenuOpen && (
                    <div className="mobile-menu">
                        {user && (
                            <div className="mobile-user-info">
                                <span>Hi, {user.first_name} {user.last_name}</span>
                            </div>
                        )}

                        <nav className="mobile-nav-links">
                            <Link to="/features" className="mobile-menu-button" onClick={closeMenu}>Features</Link>
                            <Link to="/about" className="mobile-menu-button" onClick={closeMenu}>About</Link>
                            <Link to="/contact" className="mobile-menu-button" onClick={closeMenu}>Contact</Link>
                        </nav>

                        <div className="mobile-auth-actions">
                            {user ? (
                                <button className="mobile-menu-button logout-button" onClick={() => { handleLogout(); closeMenu(); }}>Sign Out</button>
                            ) : (
                                <div className="mobile-login-signup-group">
                                    <button className="mobile-menu-button login-button" onClick={() => { setShowLogin(true); closeMenu(); }}>Login</button>
                                    <button className="mobile-menu-button signup-button" onClick={() => { setShowSignup(true); closeMenu(); }}>Sign Up</button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
                {/* Login Modal */}
                {showLogin && (
                    <div className="modal-overlay">
                        <div className="modal">
                            <h2>Login</h2>
                            <form onSubmit={handleLogin}>
                                <input
                                    type="text"
                                    placeholder="Username"
                                    value={loginForm.username}
                                    onChange={e => setLoginForm(f => ({ ...f, username: e.target.value }))}
                                    required
                                />
                                <div style={{ position: 'relative', width: '100%' }}>
                                    <input
                                        type={showLoginPassword ? 'text' : 'password'}
                                        placeholder="Password"
                                        value={loginForm.password}
                                        onChange={e => setLoginForm(f => ({ ...f, password: e.target.value }))}
                                        required
                                        style={{ width: '100%' }}
                                    />
                                    <button
                                        type="button"
                                        className="toggle-password-btn"
                                        onClick={() => setShowLoginPassword(v => !v)}
                                        tabIndex={-1}
                                        style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#0b285e', cursor: 'pointer', fontSize: '0.95rem' }}
                                    >
                                        {showLoginPassword ? 'Hide' : 'Show'}
                                    </button>
                                </div>
                                {loginError && <div className="error-message">{loginError}</div>}
                                <button type="submit" className="analyze-button">Login</button>
                            </form>
                            <button className="modal-close" onClick={() => setShowLogin(false)}>Close</button>
                        </div>
                    </div>
                )}
                {/* Signup Modal */}
                {showSignup && (
                    <div className="modal-overlay">
                        <div className="modal">
                            <h2>Sign Up</h2>
                            <form onSubmit={handleSignup}>
                                <input
                                    type="text"
                                    placeholder="First Name"
                                    value={signupForm.first_name}
                                    onChange={e => setSignupForm(f => ({ ...f, first_name: e.target.value }))}
                                    required
                                />
                                <input
                                    type="text"
                                    placeholder="Last Name"
                                    value={signupForm.last_name}
                                    onChange={e => setSignupForm(f => ({ ...f, last_name: e.target.value }))}
                                    required
                                />
                                <input
                                    type="text"
                                    placeholder="Username"
                                    value={signupForm.username}
                                    onChange={e => setSignupForm(f => ({ ...f, username: e.target.value }))}
                                    required
                                />
                                <div style={{ position: 'relative', width: '100%' }}>
                                    <input
                                        type={showSignupPassword ? 'text' : 'password'}
                                        placeholder="Password"
                                        value={signupForm.password}
                                        onChange={e => setSignupForm(f => ({ ...f, password: e.target.value }))}
                                        required
                                        style={{ width: '100%' }}
                                    />
                                    <button
                                        type="button"
                                        className="toggle-password-btn"
                                        onClick={() => setShowSignupPassword(v => !v)}
                                        tabIndex={-1}
                                        style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#0b285e', cursor: 'pointer', fontSize: '0.95rem' }}
                                    >
                                        {showSignupPassword ? 'Hide' : 'Show'}
                                    </button>
                                </div>
                                {signupError && <div className="error-message">{signupError}</div>}
                                <button type="submit" className="analyze-button">Sign Up</button>
                            </form>
                            <button className="modal-close" onClick={() => setShowSignup(false)}>Close</button>
                        </div>
                    </div>
                )}
            </header>
        </header>
        <Notification 
            message={notification.message} 
            visible={notification.visible} 
        />
        </>
    );
}

export default Header; 