export interface User {
    id: string;
    email: string;
    name: string;
    avatar?: string;
}

const API_BASE = '/api';
const AUTH_USER_KEY = 'promptozer_user';

// Get currently logged in user from localStorage cache
export const getCurrentUser = (): User | null => {
    const data = localStorage.getItem(AUTH_USER_KEY);
    return data ? JSON.parse(data) : null;
};

// Login with email - calls API and caches result
export const login = async (email: string): Promise<User> => {
    const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
    });

    if (!response.ok) {
        throw new Error('Login failed');
    }

    const user: User = await response.json();
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    return user;
};

export const logout = (): void => {
    localStorage.removeItem(AUTH_USER_KEY);
    window.location.reload();
};
