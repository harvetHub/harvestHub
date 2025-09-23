import { create } from "zustand";


export type UserProfile = {
  id?: string;
  user_id?: string;
  username?: string | null;
  image_url?: string | null;
};

type AuthState = {
  user: UserProfile | null;
  isLogged: boolean;
  setUser: (u: UserProfile | null) => void;
  clearUser: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLogged: false,
  setUser: (u) => set({ user: u, isLogged: Boolean(u) }),
  clearUser: () => set({ user: null, isLogged: false }),
}));