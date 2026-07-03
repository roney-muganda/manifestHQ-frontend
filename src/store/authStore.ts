// src/store/authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthUser } from '@/types';
import { api } from '@/services/api';
import { queryClient } from '@/lib/queryClient'; // <-- Imported for Security Rule 6

interface AuthState {
  user: AuthUser | null;
  agent: AuthUser['agent'] | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterPayload) => Promise<void>;
  logout: () => void;
  fetchMe: () => Promise<void>;
  setUser: (user: AuthUser) => void;
}

interface RegisterPayload {
  business_name: string;
  kra_pin: string;
  full_name: string;
  email: string;
  phone: string;
  password: string;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      agent: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const { data } = await api.post('/api/auth/login', { email, password });
          localStorage.setItem('access_token', data.access_token);
          localStorage.setItem('refresh_token', data.refresh_token);
          await get().fetchMe();
        } finally {
          set({ isLoading: false });
        }
      },

      register: async (payload) => {
        set({ isLoading: true });
        try {
          await api.post('/api/auth/register', payload);
        } finally {
          set({ isLoading: false });
        }
      },

      logout: () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        queryClient.clear(); // <-- Rule 6: Wipes the React Query cache to prevent data leaks
        set({ user: null, agent: null, isAuthenticated: false });
      },

      fetchMe: async () => {
        const { data } = await api.get('/api/auth/me');
        set({ user: data, agent: data.agent, isAuthenticated: true });
      },

      setUser: (user) => set({ user, agent: user.agent, isAuthenticated: true }),
    }),
    {
      name: 'manifestHQ-auth',
      // Only persist the necessary state to avoid hydrating stale loading flags
      partialize: (state) => ({ user: state.user, agent: state.agent }),
    },
  ),
);