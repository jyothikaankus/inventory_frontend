import { create } from 'zustand';
import api from '../lib/axios';

interface User {
  user_id: number;
  name: string;
  email: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  getProfile: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('token'),
  
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    const { token } = response.data;
    localStorage.setItem('token', token);
    set({ token });
  },

  register: async (name: string, email: string, password: string) => {
    await api.post('/auth/register', { name, email, password });
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null });
  },

  getProfile: async () => {
    const response = await api.get('/auth/profile');
    set({ user: response.data });
  },
}));