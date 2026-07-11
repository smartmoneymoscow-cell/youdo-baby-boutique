import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Role = "admin" | "customer";
export type UserProfile = {
  username: string;
  role: Role;
  name: string;
  email: string;
  phone: string;
  bonuses: number;
};

type AuthState = {
  user: UserProfile | null;
  login: (username: string, password: string) => { ok: boolean; error?: string };
  logout: () => void;
  updateProfile: (patch: Partial<UserProfile>) => void;
  addBonuses: (amount: number) => void;
};

// Demo credentials (frontend-only auth as requested).
const ADMIN = { username: "Админ", password: "123" };

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      login: (username, password) => {
        if (username.trim() === ADMIN.username && password === ADMIN.password) {
          set({
            user: {
              username: "Админ",
              role: "admin",
              name: "Администратор YouDo",
              email: "admin@youdo.ru",
              phone: "+7 (495) 000-00-00",
              bonuses: 12400,
            },
          });
          return { ok: true };
        }
        // Any other creds → treat as customer demo login
        if (username.trim().length >= 2 && password.length >= 1) {
          set({
            user: {
              username: username.trim(),
              role: "customer",
              name: username.trim(),
              email: `${username.trim().toLowerCase()}@youdo.ru`,
              phone: "+7 (___) ___-__-__",
              bonuses: 1250,
            },
          });
          return { ok: true };
        }
        return { ok: false, error: "Введите логин и пароль" };
      },
      logout: () => set({ user: null }),
      updateProfile: (patch) =>
        set((s) => (s.user ? { user: { ...s.user, ...patch } } : {})),
      addBonuses: (amount) =>
        set((s) => (s.user ? { user: { ...s.user, bonuses: s.user.bonuses + amount } } : {})),
    }),
    { name: "youdo-auth" },
  ),
);
