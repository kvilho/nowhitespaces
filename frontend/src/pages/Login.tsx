import { useState } from 'react';

import { Paper, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import "../styles/loginform.css";
import authService from '../services/authService';
import type { AuthResponse } from '../services/authService';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setError('');
        setIsLoading(true);
        
        try {
            const response = await authService.login({ email, password });
            if (response.token) {
                // Successfully logged in
                navigate('/');
            } else {
                setError('Login failed. Please try again.');
            }
        } catch (err: any) {
            console.error('Login error:', err);
            if (err.response?.status === 401 || err.response?.status === 400) {
                setError('Invalid email or password');
            } else if (err.response?.data) {
                setError(err.response.data);
            } else if (err.message === 'Network Error') {
                setError('Unable to connect to the server. Please try again later.');
            } else {
                setError('An unexpected error occurred. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="login-container">
            <Paper elevation={3} className="login-paper">
                <form onSubmit={handleSubmit} className="login-form">
                    <Typography variant="h4" className="login-title">
                        HourBook
                    </Typography>
                    <Typography variant="body2" className="login-subtitle">
                        Please sign in to continue
                    </Typography>

                    {error && (
                        <Typography color="error" className="error-message">
                            {error}
                        </Typography>
                    )}

                    {/* Email Field with Icon */}
                    <div className='input-field'>
                        <svg className="icon" stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 12c2.485 0 4.5-2.015 4.5-4.5S14.485 3 12 3 7.5 5.015 7.5 7.5 9.515 12 12 12zm0 2.25c-3.735 0-6.75 3.015-6.75 6.75h13.5c0-3.735-3.015-6.75-6.75-6.75z"></path>
                        </svg>
                        <input
                            className='input text-input'
                            placeholder='Email'
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={isLoading}
                        />
                    </div>

                    {/* Password Field with Icon and Toggle */}
                    <div className='input-field'>
                        <svg className="icon" stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" strokeLinejoin="round" strokeLinecap="round"></path>
                        </svg>
                        <input
                            className='input password-input'
                            placeholder='Password'
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={isLoading}
                        />

                        <button
                            type="button"
                            className="password-toggle"
                            onClick={togglePasswordVisibility}
                            disabled={isLoading}
                        >
                            <svg
                                className="eye-icon"
                                stroke="currentColor"
                                fill="none"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                {showPassword ? (
                                    <path d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                ) : (
                                    <>
                                        <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </>
                                )}
                            </svg>
                        </button>
                    </div>

                    <button 
                        type="submit" 
                        className="login-button"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>
            </Paper>
        </div>
    );
};

export default Login;
