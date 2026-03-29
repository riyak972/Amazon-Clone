import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: 'CUSTOMER' | 'SELLER' | 'ADMIN';
    avatarUrl?: string | null;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    accessToken: string | null;
    login: (user: User, token: string) => void;
    logout: () => void;
    updateUser: (data: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,
            accessToken: null,
            login: (user, token) => set({ user, isAuthenticated: true, accessToken: token }),
            logout: () => set({ user: null, isAuthenticated: false, accessToken: null }),
            updateUser: (data) => set((state) => ({ user: state.user ? { ...state.user, ...data } : null }))
        }),
        { name: 'amazon-clone-auth' }
    )
);
