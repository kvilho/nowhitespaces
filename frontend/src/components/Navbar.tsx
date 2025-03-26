import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../styles/navbar.css';
import AuthService from '../services/authService';

const Navbar: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const authService = AuthService.getInstance();

    useEffect(() => {
        setIsAuthenticated(authService.isAuthenticated());
    }, [location.pathname]);

    const isActive = (path: string) => {
        return location.pathname === path ? 'active' : '';
    };

    const handleLogout = () => {
        authService.logout();
        setIsAuthenticated(false);
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-brand">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19,4H18V2H16V4H8V2H6V4H5A2,2 0 0,0 3,6V20A2,2 0 0,0 5,22H19A2,2 0 0,0 21,20V6A2,2 0 0,0 19,4M19,20H5V10H19V20M19,8H5V6H19V8Z" />
                    </svg>
                    HourBook
                </Link>

                <button 
                    className="mobile-menu-button"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                        <path d="M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z" />
                    </svg>
                </button>

                <div className={`nav-links ${isMenuOpen ? 'show' : ''}`}>
                    {isAuthenticated ? (
                        <>
                            <Link to="/" className={`nav-link ${isActive('/')}`}>
                                Home
                            </Link>
                            <Link to="/profile" className={`nav-link ${isActive('/profile')}`}>
                                Profile
                            </Link>
                            <button onClick={handleLogout} className="nav-link logout-button">
                                Logout
                            </button>
                        </>
                    ) : (
                        <Link to="/login" className={`nav-link ${isActive('/login')}`}>
                            Login
                        </Link>
                    )}
                    
                    <div className="profile-section">
                        <button className="profile-button">
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

