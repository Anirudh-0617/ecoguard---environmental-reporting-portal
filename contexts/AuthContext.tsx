import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import * as authUtils from '../utils/auth';

interface AuthContextType {
    user: User | null;
    login: (user: User) => void;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Initialize user from local storage on mount
        const currentUser = authUtils.getCurrentUser();
        setUser(currentUser);
        setLoading(false);
    }, []);

    const login = (userData: User) => {
        authUtils.loginUser(userData);
        // After loginUser writes to localStorage, we read it back to get the ID/updates
        // or we can just use the data we have if we trust logic in loginUser
        // For consistency, let's read what was stored or just update state.
        // authUtils.loginUser modifies the object (adds ID). Let's peek at implementation or update state.
        // authUtils.loginUser does: localStorage.setItem('user', JSON.stringify(userWithId));
        // We should replicate that or update authUtils to return the user.
        // For now, let's just re-read the user from LS to be sure we have the exact same object.
        const storedUser = authUtils.getCurrentUser();
        setUser(storedUser);
    };

    const logout = () => {
        authUtils.logoutUser();
        setUser(null);
    };

    const isAuthenticated = !!user;

    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
