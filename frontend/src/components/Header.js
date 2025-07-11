import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Header.css';
import { useAppContext } from '../context/AppContext';
import REACT_APP_API_URL from '../apiConfig';
import Notification from './Notification/Notification';

function Header() {
    const navigate = useNavigate();
    const [showLogin, setShowLogin] = useState(false);
    const [showSignup, setShowSignup] = useState(false);
    const [user, setUser] = useState(null);
    const [loginError, setLoginError] = useState('');
    const [signupError, setSignupError] = useState('');
    const [loginForm, setLoginForm] = useState({ username: '', password: '' });
    const [signupForm, setSignupForm] = useState({ first_name: '', last_name: '', username: '', password: '' });
    const [showLoginPassword, setShowLoginPassword] = useState(false);
    const [showSignupPassword, setShowSignupPassword] = useState(false);
    const [activeMobileMenu, setActiveMobileMenu] = useState('main');
    const { theme, toggleTheme, notification, showNotification } = useAppContext();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProductsDropdownOpen, setIsProductsDropdownOpen] = useState(false);
    const [isOnlineServicesOpen, setIsOnlineServicesOpen] = useState(false);
    const [isDesktopAppsOpen, setIsDesktopAppsOpen] = useState(false);
    const [isMobileAppsOpen, setIsMobileAppsOpen] = useState(false);
    const location = useLocation();
    const isHomePage = location.pathname === '/';

    const dropdownRef = useRef(null);

    const openMobileMenu = () => {
        setActiveMobileMenu('main');
        setIsMobileMenuOpen(true);
    };

    const closeMobileMenu = () => setIsMobileMenuOpen(false);

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

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
            fetch(`${REACT_APP_API_URL}/api/me`, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            .then(res => res.ok ? res.json() : Promise.reject('Invalid token'))
            .then(data => {
                if (data.user) setUser(data.user);
            })
            .catch(err => {
                console.error("Session check failed:", err);
                localStorage.removeItem('authToken');
            });
        }
    }, []);

    useEffect(() => {
        const token = localStorage.getItem('authToken');

        if (token) {
            fetch(`${REACT_APP_API_URL}/api/me`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(res => {
                if (!res.ok) {
                    localStorage.removeItem('authToken');
                    return Promise.reject('Invalid token');
                }
                return res.json();
            })
            .then(data => {
                if (data.user) {
                    setUser(data.user);
                }
            })
            .catch(err => console.error("Session check failed:", err));
        }
    }, [])

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoginError('');
        try {
            const res = await fetch(`${REACT_APP_API_URL}/api/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(loginForm),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Login failed');
            localStorage.setItem('authToken', data.token);

            setUser(data.user);
            setShowLogin(false);
            setLoginForm({ username: '', password: '' });
            showNotification('Login Successful!', 'success');
        } catch (err) {
            showNotification(err.message, 'error');
            localStorage.removeItem('authToken');
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
        localStorage.removeItem('authToken');
        await fetch(`${REACT_APP_API_URL}/api/logout`, {
            method: 'POST',
        });
        
        setUser(null);
        showNotification('You have been signed out.', 'info');
        setIsDropdownOpen(false);
        navigate('/');
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
                <Link to="/" className="logo" onClick={() => { closeMobileMenu(); setIsDropdownOpen(false); }}>
                    <img 
                        src={theme === 'light' ? '/logo.jpg' : '/logo_dark.png'} 
                        alt="ATLAS Logo" 
                        className="logo-img" 
                    />
                </Link>
                <nav className="main-nav-desktop">
                    <Link to="/" className="nav-link">Home</Link>

                    <div 
                        className="nav-item dropdown" 
                        onMouseEnter={() => setIsProductsDropdownOpen(true)} 
                        onMouseLeave={() => setIsProductsDropdownOpen(false)}
                    >
                        <span className="nav-link">Products</span>
                        {isProductsDropdownOpen && (
                            <div className="dropdown-menu">
                                <div 
                                    className="dropdown-item nested-dropdown"
                                    onMouseEnter={() => setIsOnlineServicesOpen(true)}
                                    onMouseLeave={() => setIsOnlineServicesOpen(false)}
                                >
                                    <span>🌎 Online Services ▸</span>
                                    {isOnlineServicesOpen && (
                                        <div className="nested-menu">
                                            <Link to="/text" className="dropdown-item">📝 Text Analysis</Link>
                                            <Link to="/voice" className="dropdown-item">🎤 Voice Analysis</Link>
                                            <Link to="/image" className="dropdown-item">🖼️ Image Analysis</Link>
                                            <Link to="/chrome-extension" className="dropdown-item">🌐 ATLAS on Chrome</Link>
                                        </div>
                                    )}
                                </div>

                                <div 
                                    className="dropdown-item nested-dropdown"
                                    onMouseEnter={() => setIsDesktopAppsOpen(true)}
                                    onMouseLeave={() => setIsDesktopAppsOpen(false)}
                                >
                                    <span>💻 ATLAS on Desktop ▸</span>
                                    {isDesktopAppsOpen && (
                                        <div className="nested-menu">
                                            <Link to="/apps/windows" className="dropdown-item">🪟 Windows</Link>
                                            <Link to="/apps/macos" className="dropdown-item">🧭 MacOS</Link>
                                        </div>
                                    )}
                                </div>

                                <div 
                                    className="dropdown-item nested-dropdown"
                                    onMouseEnter={() => setIsMobileAppsOpen(true)}
                                    onMouseLeave={() => setIsMobileAppsOpen(false)}
                                >
                                    <span>📱 ATLAS on Mobile ▸</span>
                                    {isMobileAppsOpen && (
                                        <div className="nested-menu">
                                            <Link to="/apps/android" className="dropdown-item">🤖 Android</Link>
                                            <Link to="/apps/ios" className="dropdown-item">🍎 iOS</Link>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    <Link to="/whats-new" className="nav-link">What's New</Link>
                    <Link to="/vision" className="nav-link">Our Vision</Link>
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
                                    <Link to="/dashboard" className="dropdown-link" onClick={() => setIsDropdownOpen(false)}>
                                        Dashboard
                                    </Link>
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
                <button 
                    className={`hamburger-button ${isMobileMenuOpen ? 'is-open' : ''}`} 
                    onClick={isMobileMenuOpen ? closeMobileMenu : openMobileMenu}
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
                </div>
                {isMobileMenuOpen && (
                    <div className="mobile-menu">
                        <div className={`menu-panel ${activeMobileMenu === 'main' ? 'is-active' : ''}`}>
                            <div className="mobile-menu-header">
                                <span>Menu</span>
                            </div>
                            {user && (
                                <div className="mobile-nav-links">
                                    <Link to="/dashboard" className="mobile-menu-button" onClick={closeMobileMenu}>📊 Dashboard</Link>
                                </div>
                            )}
                            <nav className="mobile-nav-links">
                                <Link to="/" className="mobile-menu-button" onClick={closeMobileMenu}>🏠 Home</Link>
                                <button className="mobile-menu-button" onClick={() => setActiveMobileMenu('products')}>🛍️ Products ▸</button>
                                <Link to="/whats-new" className="mobile-menu-button" onClick={closeMobileMenu}>🆕 What's New</Link>
                                <Link to="/vision" className="mobile-menu-button" onClick={closeMobileMenu}>👁️ Our Vision</Link>
                            </nav>

                            <div className="mobile-auth-actions">
                                {user ? (
                                    <button className="mobile-menu-button logout-button" onClick={() => { handleLogout(); closeMobileMenu(); }}>🔒 Sign Out</button>
                                ) : (
                                    <div className="mobile-login-signup-group">
                                        <button className="mobile-menu-button login-button" onClick={() => { setShowLogin(true); closeMobileMenu(); }}>🔑 Login</button>
                                        <button className="mobile-menu-button signup-button" onClick={() => { setShowSignup(true); closeMobileMenu(); }}>📝 Sign Up</button>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className={`menu-panel ${activeMobileMenu === 'products' ? 'is-active' : ''}`}>
                            <div className="mobile-menu-header">
                                <button className="back-button" onClick={() => setActiveMobileMenu('main')}>◂ Menu</button>
                                <span>Products</span>
                            </div>
                            <nav className="mobile-nav-links">
                                <button className="mobile-menu-button" onClick={() => setActiveMobileMenu('online')}>🌎 Online Services ▸</button>
                                <button className="mobile-menu-button" onClick={() => setActiveMobileMenu('desktop')}>💻 ATLAS on Desktop ▸</button>
                                <button className="mobile-menu-button" onClick={() => setActiveMobileMenu('mobile')}>📱 ATLAS on Mobile ▸</button>
                            </nav>
                        </div>
                        <div className={`menu-panel ${activeMobileMenu === 'online' ? 'is-active' : ''}`}>
                            <div className="mobile-menu-header">
                                <button className="back-button" onClick={() => setActiveMobileMenu('products')}>◂ Products</button>
                                <span>Online Services</span>
                            </div>
                            <nav className="mobile-nav-links">
                                <Link to="/text" className="mobile-menu-button" onClick={closeMobileMenu}>📝 Text Analysis</Link>
                                <Link to="/voice" className="mobile-menu-button" onClick={closeMobileMenu}>🎤 Voice Analysis</Link>
                                <Link to="/image" className="mobile-menu-button" onClick={closeMobileMenu}>🖼️ Image Analysis</Link>
                                <Link to="/chrome-extension" className="mobile-menu-button" onClick={closeMobileMenu}>🌐 ATLAS on Chrome</Link>
                            </nav>
                        </div>
                        <div className={`menu-panel ${activeMobileMenu === 'desktop' ? 'is-active' : ''}`}>
                            <div className="mobile-menu-header">
                                <button className="back-button" onClick={() => setActiveMobileMenu('products')}>◂ Products</button>
                                <span>Desktop Apps</span>
                            </div>
                            <nav className="mobile-nav-links">
                                <Link to="/apps/windows" className="mobile-menu-button" onClick={closeMobileMenu}>🪟 Windows</Link>
                                <Link to="/apps/macos" className="mobile-menu-button" onClick={closeMobileMenu}>🍎 MacOS</Link>
                            </nav>
                        </div>
                        <div className={`menu-panel ${activeMobileMenu === 'mobile' ? 'is-active' : ''}`}>
                            <div className="mobile-menu-header">
                                <button className="back-button" onClick={() => setActiveMobileMenu('products')}>◂ Products</button>
                                <span>Mobile Apps</span>
                            </div>
                            <nav className="mobile-nav-links">
                                <Link to="/apps/android" className="mobile-menu-button" onClick={closeMobileMenu}>🤖 Android</Link>
                                <Link to="/apps/ios" className="mobile-menu-button" onClick={closeMobileMenu}>📱 iOS</Link>
                            </nav>
                        </div>
                    </div>
                )}
                
                <Notification 
                message={notification.message} 
                type={notification.type}
                visible={notification.visible} 
                />

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