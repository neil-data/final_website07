import { create } from 'zustand';

type Theme = 'dark';

interface ThemeStore {
  theme: Theme;
  toggle: () => void;
  setTheme: (t: Theme) => void;
}

const getInitialTheme = (): Theme => {
  return 'dark';
};

const applyTheme = (theme: Theme) => {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('gdg-theme', theme);
};

export const useThemeStore = create<ThemeStore>((set) => ({
  theme: getInitialTheme(),
  toggle: () =>
    set(() => {
      applyTheme('dark');
      return { theme: 'dark' };
    }),
  setTheme: (t: Theme) => {
    applyTheme('dark');
    set({ theme: 'dark' });
  },
}));
