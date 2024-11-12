import { create } from 'zustand';
import { User } from '../types/auth';
import api from '../lib/axios';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  verifyAccount: (token: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),

  login: async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      set({ user, token, isAuthenticated: true });
    } catch (error) {
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null, isAuthenticated: false });
  },

  register: async (name: string, email: string, password: string) => {
    try {
      await api.post('/auth/register', { name, email, password });
    } catch (error) {
      throw error;
    }
  },

  resetPassword: async (email: string) => {
    try {
      await api.post('/auth/reset-password', { email });
    } catch (error) {
      throw error;
    }
  },

  verifyAccount: async (token: string) => {
    try {
      await api.post('/auth/verify', { token });
    } catch (error) {
      throw error;
    }
  },
}));