import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  isAuthenticated: boolean;
  accessToken: string | null;
  name: string | null;
  email: string | null;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  setAccessToken: (accessToken: string | null) => void;
  setSName: (name: string | null) => void;
  setSEmail: (email: string | null) => void;
}

// ...existing code...
export const useAuthStore = create<AuthState>((set, get) => ({
  isAuthenticated: false,
  accessToken: null,
  name: null,
  email: null,
  setSEmail: (email: string | null) => set({ email }),
  setSName: (name: string | null) => set({ name }),
  setAccessToken: (accessToken: string | null) => set({ accessToken }),
  setIsAuthenticated: (isAuthenticated: boolean) => set({ isAuthenticated }),
}))