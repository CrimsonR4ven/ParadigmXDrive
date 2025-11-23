import { useState } from 'react';
import { useLocation } from 'wouter';
import { useErrorHandlerCritical } from './ErrorHandlers.jsx';
import './style/LoginStyle.css';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [, setLocation] = useLocation();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await fetch('/api/Auth/Login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username,
                    password
                })
            });

            if (!response.ok) {
                setIsLoading(false);

                if (response.status === 401) {
                    setError('Invalid username or password');
                    return;
                } else if (response.status === 400) {
                    setError('Invalid request. Please check your input.');
                    return;
                } else
                {
                    useErrorHandlerCritical(response.status);
                    return;
                }
            }

            const data = await response.json();

            localStorage.setItem('authToken', data.token);
            localStorage.setItem('username', data.username);
            localStorage.setItem('role', data.role);

            setLocation('/');
        } catch (err) {
            console.error('Login error:', err);
            setError('Connection error. Please check your network and try again.');
            setIsLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h1 className="login-title">
                    Login
                </h1>

                <form onSubmit={handleSubmit}>
                    <div className="login-field">
                        <label className="login-label">
                            Username
                        </label>
                        <input
                            type="text"
                            className="login-input"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <div className="login-field">
                        <label className="login-label">
                            Password
                        </label>
                        <input
                            type="password"
                            className="login-input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={isLoading}
                        />
                    </div>

                    {error && (
                        <div className="login-error">
                            ⚠️ {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        className={`login-button ${isLoading ? 'login-button-loading' : ''}`}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Login;