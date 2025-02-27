// filepath: /C:/code/referencearch/my-react-app/src/Login.tsx
import React, { useState } from 'react';
import axios from 'axios';

const API_URL = typeof process !== 'undefined' && process.env.REACT_APP_API_URL ? process.env.REACT_APP_API_URL : 'http://localhost:3000';

const Login: React.FC<{ onLogin: (token: string) => void }> = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async () => {
        try {
            const response = await axios.post(`${API_URL}/login`, { username, password });
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
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleLogin}>Login</button>
        </div>
    );
};

export default Login;