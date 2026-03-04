import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import Cookies from 'js-cookie';
import type { User } from '../types/user.types';
import type { AuthTokens } from '../types/auth.types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setAuth: (user: User, tokens: AuthTokens) => void;
  clearAuth: () => void;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      setAuth: (user, tokens) => {
        Cookies.set('accessToken', tokens.accessToken, {
          expires: 1,
          secure: true
        });
        set({ user, isAuthenticated: true });
      },
      clearAuth: () => {
        Cookies.remove('accessToken');
        set({ user: null, isAuthenticated: false });
      },
      setUser: (user) => set({ user })
    }),
    {
      name: 'auth-store',
      partialize: (s) => ({ user: s.user, isAuthenticated: s.isAuthenticated })
    }
  )
);