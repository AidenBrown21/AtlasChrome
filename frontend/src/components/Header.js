import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';
import { useTheme } from '../context/ThemeContext';
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
    const { theme, toggleTheme } = useTheme();
    const [notification, setNotification] = useState({ message: '', type: 'info', visible: false });
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const location = useLocation();
    const isHomePage = location.pathname === '/';

    const dropdownRef = useRef(null);

    useEffect(() => {
        if (notification.visible) {
            const timer = setTimeout(() => {
                setNotification(prev => ({ ...prev, visible: false }));
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [notification.visible]);

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownRef]);

    const showNotification = (message, type = 'info') => {
        setNotification({ message, type, visible: true });
    };

    useEffect(() => {
        fetch(`${REACT_APP_API_URL}/api/me`, { credentials: 'include' })
            .then(res => res.json())
            .then(data => setUser(data.user));
    }, []);

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
            showNotification(err.message, 'error');
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
            showNotification(err.message, 'error');
        }
    };

    const handleLogout = async () => {
        await fetch(`${REACT_APP_API_URL}/api/logout`, {
            method: 'POST',
            credentials: 'include',
        });
        setUser(null);
        showNotification('You have been signed out.', 'info');
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    const getInitials = () => {
        if (!user) return '';
        const firstInitial = user.first_name ? user.first_name[0] : '';
        const lastInitial = user.last_name ? user.last_name[0] : '';
        return `${firstInitial}${lastInitial}`.toUpperCase();
    };

    return (
        <>
        <header className={`app-header ${!isHomePage ? 'is-static' : ''}`}>
                <Link to="/" className="logo" onClick={() => { closeMenu(); setIsDropdownOpen(false); }}>
                    <img 
                        src={theme === 'light' ? '/logo.jpg' : '/logo_dark.png'} 
                        alt="ATLAS Logo" 
                        className="logo-img" 
                    />
                </Link>
                <nav className="main-nav-desktop">
                    <Link to="/features">Features</Link>
                    <Link to="/about">About</Link>
                    <Link to="/contact">Contact</Link>
                </nav>
                <div className="header-actions-desktop">
                    {user ? (
                        <div className="profile-container" ref={dropdownRef}>
                            <div className="user-avatar" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                                {getInitials()}
                            </div>

                            {isDropdownOpen && (
                                <div className="profile-dropdown">
                                    <div className="dropdown-user-info">
                                        <strong>{user.first_name} {user.last_name}</strong>
                                        <span>{user.username}</span>
                                    </div>
                                    <button className="logout-button" onClick={() => { handleLogout(); setIsDropdownOpen(false); }}>
                                        <center>Sign Out</center>
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <>
                            <button className="login-button" onClick={() => setShowLogin(true)}>Login</button>
                            <button className="signup-button" onClick={() => setShowSignup(true)}>Sign Up</button>
                        </>
                    )}
                    <button onClick={toggleTheme} className="theme-toggle-button">
                        {theme === 'light' ? '🌙' : '☀️'}
                    </button>
                </div>
                <div className="mobile-header-actions">
                    <button onClick={toggleTheme} className="theme-toggle-button">
                        {theme === 'light' ? '🌙' : '☀️'}
                    </button>
                <button className={`hamburger-button ${isMenuOpen ? 'is-open' : ''}`} onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
                </div>
                {isMenuOpen && (
                    <div className="mobile-menu">
                        {user && (
                            <div className="mobile-user-info">
                                <span>Hi, {user.first_name} {user.last_name}!</span>
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
        <Notification 
            message={notification.message} 
            type={notification.type}
            visible={notification.visible} 
        />
        </>
    );
}

export default Header; 