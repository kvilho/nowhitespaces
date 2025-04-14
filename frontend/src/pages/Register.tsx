import { useState } from 'react';
import { Paper, Typography, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import "../styles/loginform.css";
import authService from '../services/authService';

const Register: React.FC = () => {
    const [formData, setFormData] = useState({
        username: '',
        firstname: '',
        lastname: '',
        email: '',
        password: '',
        phone: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await authService.register(
                formData.username,
                formData.firstname,
                formData.lastname,
                formData.email,
                formData.password,
                formData.phone
            );
            navigate('/login', { state: { message: 'Registration successful! Please login.' } });
        } catch (err: any) {
            console.error('Registration error:', err);
            if (err.response?.data) {
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

    return (
        <div className="login-container">
            <Paper elevation={3} className="login-paper">
                <form onSubmit={handleSubmit} className="login-form">
                    <Typography variant="h4" className="login-title">
                        Create Account
                    </Typography>
                    <Typography variant="body2" className="login-subtitle">
                        Please fill in your details to register
                    </Typography>

                    {error && (
                        <Typography color="error" className="error-message">
                            {error}
                        </Typography>
                    )}

                    {/* Username Field */}
                    <div className='input-field'>
                        <svg className="icon" stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 12c2.485 0 4.5-2.015 4.5-4.5S14.485 3 12 3 7.5 5.015 7.5 7.5 9.515 12 12 12zm0 2.25c-3.735 0-6.75 3.015-6.75 6.75h13.5c0-3.735-3.015-6.75-6.75-6.75z"></path>
                        </svg>
                        <input
                            className='input text-input'
                            placeholder='Username'
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            disabled={isLoading}
                        />
                    </div>

                    {/* First Name Field */}
                    <div className='input-field'>
                        <svg className="icon" stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 12c2.485 0 4.5-2.015 4.5-4.5S14.485 3 12 3 7.5 5.015 7.5 7.5 9.515 12 12 12zm0 2.25c-3.735 0-6.75 3.015-6.75 6.75h13.5c0-3.735-3.015-6.75-6.75-6.75z"></path>
                        </svg>
                        <input
                            className='input text-input'
                            placeholder='First Name'
                            type="text"
                            name="firstname"
                            value={formData.firstname}
                            onChange={handleChange}
                            required
                            disabled={isLoading}
                        />
                    </div>

                    {/* Last Name Field */}
                    <div className='input-field'>
                        <svg className="icon" stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 12c2.485 0 4.5-2.015 4.5-4.5S14.485 3 12 3 7.5 5.015 7.5 7.5 9.515 12 12 12zm0 2.25c-3.735 0-6.75 3.015-6.75 6.75h13.5c0-3.735-3.015-6.75-6.75-6.75z"></path>
                        </svg>
                        <input
                            className='input text-input'
                            placeholder='Last Name'
                            type="text"
                            name="lastname"
                            value={formData.lastname}
                            onChange={handleChange}
                            required
                            disabled={isLoading}
                        />
                    </div>

                    {/* Email Field */}
                    <div className='input-field'>
                        <svg className="icon" stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"></path>
                        </svg>
                        <input
                            className='input text-input'
                            placeholder='Email'
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            disabled={isLoading}
                        />
                    </div>

                    {/* Password Field */}
                    <div className='input-field'>
                        <svg className="icon" stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" strokeLinejoin="round" strokeLinecap="round"></path>
                        </svg>
                        <input
                            className='input password-input'
                            placeholder='Password'
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            disabled={isLoading}
                        />
                    </div>

                    {/* Phone Field */}
                    <div className='input-field'>
                        <svg className="icon" stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"></path>
                        </svg>
                        <input
                            className='input text-input'
                            placeholder='Phone Number'
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <button 
                        type="submit" 
                        className="login-button"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Creating Account...' : 'Create Account'}
                    </button>

                    <Typography variant="body2" className="login-subtitle" style={{ marginTop: '1rem' }}>
                        Already have an account?{' '}
                        <Link href="/login" style={{ color: '#1976d2', textDecoration: 'none' }}>
                            Sign in
                        </Link>
                    </Typography>
                </form>
            </Paper>
        </div>
    );
};

export default Register; 