import { useEffect } from 'react';
import { useLocation } from 'wouter';

export function useAuth() {
    const token = localStorage.getItem('authToken');
    const username = localStorage.getItem('username');
    const role = localStorage.getItem('role');

    return {
        isAuthenticated: !!token,
        token,
        username,
        role
    };
}

export function ProtectedRoute({ children }) {
    const { isAuthenticated } = useAuth();
    const [, setLocation] = useLocation();

    useEffect(() => {
        if (!isAuthenticated) {
            setLocation('/login');
        }
    }, [isAuthenticated, setLocation]);

    if (!isAuthenticated) {
        return null;
    }

    return children;
}

export function authFetch(url, options = {}) {
    const token = localStorage.getItem('authToken');

    const headers = {
        ...options.headers,
        'Authorization': token ? `Bearer ${token}` : ''
    };

    return fetch(url, {
        ...options,
        headers
    }).then(async response => {
        // If unauthorized, redirect to login
        if (response.status === 401) {
            localStorage.removeItem('authToken');
            localStorage.removeItem('username');
            localStorage.removeItem('role');
            window.location.href = '/login';
        }
        return response;
    });
}

export function logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    window.location.href = '/login';
}