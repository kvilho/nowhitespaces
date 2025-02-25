import React, { useState } from 'react';
import { Paper, Typography } from '@mui/material';
import "../styles/loginform.css";

const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        // Handle login logic here
        console.log('Username:', username);
        console.log('Password:', password);
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

                    {/* Username Field with Icon */}
                    <div className='input-field'>
                        <svg className="icon" stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 12c2.485 0 4.5-2.015 4.5-4.5S14.485 3 12 3 7.5 5.015 7.5 7.5 9.515 12 12 12zm0 2.25c-3.735 0-6.75 3.015-6.75 6.75h13.5c0-3.735-3.015-6.75-6.75-6.75z"></path>
                        </svg>
                        <input
                            className='input text-input'
                            placeholder='Username'
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>

                    {/* Password Field with Icon */}
                    <div className='input-field'>
                        <svg className="icon" stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" strokeLinejoin="round" strokeLinecap="round"></path>
                        </svg>
                        <input
                            className='input password-input'
                            placeholder='Password'
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button type="submit" className="login-button">
                        Sign In
                    </button>
                </form>
            </Paper>
        </div>
    );
};

export default Login;
