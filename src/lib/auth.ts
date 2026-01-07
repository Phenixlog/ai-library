export interface User {
    id: string;
    email: string;
    name: string;
    avatar?: string;
}

export const AUTH_USER_KEY = 'promptozer_user';
export const AUTH_USERS_DB_KEY = 'promptozer_users_db'; // Mock DB of users

// Get currently logged in user
export const getCurrentUser = (): User | null => {
    const data = localStorage.getItem(AUTH_USER_KEY);
    return data ? JSON.parse(data) : null;
};

// Login with email (mock)
export const login = (email: string): User => {
    // In a real app, this would be an API call
    // For now, we find or create the user in our local "DB"
    const users = getAllUsers();
    let user = users.find(u => u.email === email);

    if (!user) {
        user = {
            id: crypto.randomUUID(),
            email,
            name: email.split('@')[0],
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`
        };
        saveUserToDb(user);
    }

    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    return user;
};

export const logout = (): void => {
    localStorage.removeItem(AUTH_USER_KEY);
    window.location.reload(); // Refresh to clear state
};

// Helper: Get all users from local mock DB
const getAllUsers = (): User[] => {
    const data = localStorage.getItem(AUTH_USERS_DB_KEY);
    return data ? JSON.parse(data) : [];
};

// Helper: Save user to local mock DB
const saveUserToDb = (user: User): void => {
    const users = getAllUsers();
    localStorage.setItem(AUTH_USERS_DB_KEY, JSON.stringify([...users, user]));
};
