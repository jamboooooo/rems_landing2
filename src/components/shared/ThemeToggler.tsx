import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

const STORAGE_KEY = 'theme';

function getSystemTheme(): Theme {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle('dark', theme === 'dark');
}

export function ThemeToggler() {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY) as Theme | null;
    const initial = saved ?? getSystemTheme();
    setTheme(initial);
    applyTheme(initial);
  }, []);

  const toggle = () => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    applyTheme(next);
    window.localStorage.setItem(STORAGE_KEY, next);
  };

  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle theme"
      className="group relative inline-flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border border-[color-mix(in_srgb,var(--color-primary)_30%,var(--color-border))] bg-[color-mix(in_srgb,var(--color-background)_78%,transparent)] shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,transparent_35%,color-mix(in_srgb,white_40%,transparent)_50%,transparent_65%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      <Sun
        size={18}
        className={`absolute transition-all duration-300 ${
          isDark ? 'scale-0 -rotate-90 opacity-0' : 'scale-100 rotate-0 opacity-100'
        }`}
      />
      <Moon
        size={18}
        className={`absolute transition-all duration-300 ${
          isDark ? 'scale-100 rotate-0 opacity-100' : 'scale-0 rotate-90 opacity-0'
        }`}
      />
    </button>
  );
}
