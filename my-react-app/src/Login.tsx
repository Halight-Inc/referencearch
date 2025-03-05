// filepath: /C:/code/referencearch/my-react-app/src/Login.tsx
import React, { useState } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const Login: React.FC<{ onLogin: (token: string) => void }> = ({ onLogin }) => {
    const [email, setEmail] = useState(''); // Changed from username to email
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async () => {
        try {
            const response = await axios.post(`${API_URL}/v1/auth/login`, { email, password }); // Updated request body
            const token = response.data.token;
            localStorage.setItem('jwtToken', token);
            onLogin(token);
        } catch (err) {
            console.error('Login error:', err);
            setError('Invalid credentials');
        }
    };

    return (
        <div>
            <h2>Login</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <input
                type="text"
                placeholder="Email" // Changed from Username to Email
                value={email} // Changed from username to email
                onChange={(e) => setEmail(e.target.value)} // Changed from setUsername to setEmail
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleLogin}>Login - Hi Team</button>
        </div>
    );
};

export default Login;
