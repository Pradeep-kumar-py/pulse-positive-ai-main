import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  isAuthenticated: boolean;
  accessToken: string | null;
  name: string | null;
  email: string | null;
  mood: string;
  intensity: string;
  description: string;
  journalTitle: string;
  journalContent: string;
  communityThought: string;
  setMood: (mood: string) => void;
  setIntensity: (intensity: string) => void;
  setDescription: (description: string) => void;
  setJournalTitle: (journalTitle: string) => void;
  setJournalContent: (journalContent: string) => void;
  setCommunityThought: (communityThought: string) => void;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  setAccessToken: (accessToken: string | null) => void;
  setSName: (name: string | null) => void;
  setSEmail: (email: string | null) => void;
}

// ...existing code...
export const useAuthStore = create<AuthState>((set, get) => ({
  isAuthenticated: false,
  accessToken: null,
  name: '',
  email: '',
  mood: '',
  intensity: '',
  description: '',
  journalTitle: '',
  journalContent: '',
  communityThought: '',
  setMood: (mood: string) => set({ mood }),
  setIntensity: (intensity: string) => set({ intensity }),
  setDescription: (description: string) => set({ description }),
  setJournalTitle: (journalTitle: string) => set({ journalTitle }),
  setJournalContent: (journalContent: string) => set({ journalContent }),
  setCommunityThought: (communityThought: string) => set({ communityThought }),
  setSEmail: (email: string | null) => set({ email }),
  setSName: (name: string | null) => set({ name }),
  setAccessToken: (accessToken: string | null) => set({ accessToken }),
  setIsAuthenticated: (isAuthenticated: boolean) => set({ isAuthenticated }),
}))