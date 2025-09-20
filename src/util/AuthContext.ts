import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  isAuthenticated: boolean;
  name: string;
  email: string;
  token: string;
  login: (userData: { name: string; email: string; token?: string }) => void;
  logout: () => void;
  setAuthState: (authData: { isAuthenticated: boolean; name: string; email: string; token?: string }) => void;
  initializeAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      name: "",
      email: "",
      token: "",
      login: (userData) => {
        const token = userData.token || localStorage.getItem('token') || "";
        set({ 
          isAuthenticated: true, 
          name: userData.name, 
          email: userData.email,
          token 
        });
        if (userData.token) {
          localStorage.setItem('token', userData.token);
        }
      },
      logout: () => {
        set({ 
          isAuthenticated: false, 
          name: "", 
          email: "",
          token: ""
        });
        localStorage.removeItem('token');
      },
      setAuthState: (authData) => {
        const token = authData.token || localStorage.getItem('token') || "";
        set({
          ...authData,
          token
        });
        if (authData.token) {
          localStorage.setItem('token', authData.token);
        }
      },
      initializeAuth: () => {
        const token = localStorage.getItem('token');
        if (token && !get().isAuthenticated) {
          // Here you could make an API call to validate the token and get user data
          // For now, we'll just check if token exists
          const storedUserData = localStorage.getItem('userData');
          if (storedUserData) {
            try {
              const userData = JSON.parse(storedUserData);
              set({
                isAuthenticated: true,
                name: userData.name || "",
                email: userData.email || "",
                token
              });
            } catch (error) {
              console.error('Error parsing stored user data:', error);
              localStorage.removeItem('token');
              localStorage.removeItem('userData');
            }
          }
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        name: state.name,
        email: state.email,
      }),
    }
  )
);