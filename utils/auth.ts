
import { User, UserRole } from '../types';

// Simple deterministic hash function to generate a UUID-like string from email
const generateUserId = (email: string): string => {
  let hash = 0;
  for (let i = 0; i < email.length; i++) {
    const char = email.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }

  // Create a deterministic UUID-like string using the hash
  // Format: 00000000-0000-0000-0000-000000000000
  const hashHex = Math.abs(hash).toString(16).padStart(8, '0');
  return `${hashHex}-0000-0000-0000-000000000000`;
};

export const loginUser = (userData: User) => {
  // If email is present, generate a consistent ID
  const userId = userData.email
    ? generateUserId(userData.email)
    : crypto.randomUUID(); // Fallback for guest/no-email

  const userWithId = { ...userData, id: userId };
  localStorage.setItem('user', JSON.stringify(userWithId));
};

export const logoutUser = () => {
  localStorage.removeItem('user');
};

export const getCurrentUser = (): User | null => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const isAuthenticated = (): boolean => {
  return getCurrentUser() !== null;
};

export const isCitizen = (): boolean => {
  const user = getCurrentUser();
  return user !== null && (user.type === UserRole.CITIZEN || user.type === UserRole.GUEST);
};

export const isOfficial = (): boolean => {
  const user = getCurrentUser();
  return user !== null && user.type === UserRole.OFFICIAL;
};
