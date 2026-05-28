import store from 'store';
import { create } from "zustand";

type Theme = 'light' | 'dark';

const getDefaultTheme = (): Theme => {
  const saved = store.get('theme') as Theme | undefined;
  if (saved) return saved;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export type ThemeState = {
  theme: Theme;
};

export type ThemeActions = {
  toggleTheme: () => void;
};

export const useThemeStore = create<ThemeState & ThemeActions>()((set, get) => ({
  theme: getDefaultTheme(),
  toggleTheme: () => {
    const next = get().theme === 'light' ? 'dark' : 'light';
    store.set('theme', next);
    set({ theme: next });
  }
}));
