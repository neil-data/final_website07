import React from 'react';
import { motion } from 'motion/react';
import { Sun, Moon } from 'lucide-react';
import { useThemeStore } from '../store/themeStore';

export const ThemeToggle = ({ className }: { className?: string }) => {
  const { theme, toggle } = useThemeStore();
  const isDark = theme === 'dark';

  return (
    <motion.button
      onClick={toggle}
      whileTap={{ scale: 0.85, rotate: 15 }}
      className={`relative w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
        isDark
          ? 'bg-white/[0.06] hover:bg-white/[0.12] text-google-yellow border border-white/[0.08]'
          : 'bg-black/[0.04] hover:bg-black/[0.08] text-google-blue border border-black/[0.06]'
      } ${className ?? ''}`}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      <motion.div
        key={theme}
        initial={{ rotate: -90, scale: 0, opacity: 0 }}
        animate={{ rotate: 0, scale: 1, opacity: 1 }}
        exit={{ rotate: 90, scale: 0, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 280, damping: 18 }}
      >
        {isDark ? <Sun size={18} /> : <Moon size={18} />}
      </motion.div>

      {/* Glow ring */}
      <span
        className={`absolute inset-0 rounded-xl transition-opacity duration-300 pointer-events-none ${
          isDark
            ? 'shadow-[0_0_12px_rgba(251,188,5,0.2)] opacity-0 hover:opacity-100'
            : 'shadow-[0_0_12px_rgba(66,133,244,0.15)] opacity-0 hover:opacity-100'
        }`}
      />
    </motion.button>
  );
};
