import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ChevronRight, User, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';
import { Avatar, GlowButton } from './UI';
import { cn } from '../hooks/useUtils';
import { BrandLogo } from './BrandLogo';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuthStore();
  const isDark = useThemeStore((s) => s.theme === 'dark');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'About', path: '/' },
    { name: 'Events', path: '/events' },
    { name: 'Leaderboard', path: '/leaderboard' },
    { name: 'Team', path: '/team' },
    { name: 'Media', path: '/media' },
    { name: 'Announcements', path: '/announcements' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav className={cn(
      "fixed top-0 left-0 w-full z-50 transition-all duration-500 px-6",
      scrolled
        ? "py-3 glass-strong shadow-[0_4px_30px_rgba(0,0,0,0.3)]"
        : "py-5 bg-transparent"
    )}>
      {/* Animated bottom border on scroll */}
      {scrolled && (
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-google-blue/30 to-transparent" />
      )}

      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
            <BrandLogo size={34} />
          </div>
          <span className={cn("font-sans font-bold text-lg hidden sm:block bg-clip-text text-transparent",
            isDark ? "bg-gradient-to-r from-white to-white/80" : "bg-gradient-to-r from-gray-900 to-gray-700"
          )}>GDG on Campus IAR</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={cn(
                "relative text-sm font-medium px-4 py-2 rounded-full transition-all duration-300 group",
                location.pathname === link.path
                  ? "text-google-blue bg-google-blue/10"
                  : "text-text-muted hover:text-white hover:bg-white/[0.05]"
              )}
            >
              {link.name}
              {location.pathname === link.path ? (
                <motion.span
                  layoutId="navIndicator"
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-google-blue"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                />
              ) : (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] rounded-full bg-white/40 group-hover:w-4 transition-all duration-300" />
              )}
            </Link>
          ))}
        </div>

        {/* Auth Actions */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <div className="group relative">
              <Avatar src={user.avatar} size="sm" className="cursor-pointer ring-2 ring-transparent group-hover:ring-google-blue/30 transition-all duration-300" />
              <div className="absolute right-0 top-full mt-2 w-52 glass-strong rounded-2xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 shadow-[0_20px_60px_rgba(0,0,0,0.5)] border border-white/[0.05]">
                <Link to="/profile" className="flex items-center gap-2 px-4 py-2.5 hover:bg-white/10 text-sm transition-colors">
                  <User size={16} /> My Profile
                </Link>
                {user.role === 'Admin' && (
                  <Link to="/admin" className="flex items-center gap-2 px-4 py-2.5 hover:bg-white/10 text-sm transition-colors">
                    <LayoutDashboard size={16} /> Admin Panel
                  </Link>
                )}
                <div className="my-1 border-t border-white/[0.05]" />
                <button onClick={logout} className="w-full flex items-center gap-2 px-4 py-2.5 hover:bg-google-red/10 text-sm text-google-red transition-colors">
                  <LogOut size={16} /> Logout
                </button>
              </div>
            </div>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-text-muted hover:text-white transition-colors duration-300">Login</Link>
              <Link to="/register">
                <GlowButton className="py-2 px-5 text-sm">Register</GlowButton>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button className={cn("md:hidden p-2 glass rounded-xl", isDark ? "text-white" : "text-gray-900")} onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-40 bg-bg-base/95 backdrop-blur-2xl flex flex-col p-8"
          >
            <div className="flex justify-between items-center mb-12">
              <BrandLogo size={30} />
              <button onClick={() => setIsOpen(false)} className="p-2 glass rounded-xl"><X size={24} /></button>
            </div>
            <div className="flex flex-col gap-2">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                >
                  <Link
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "flex items-center justify-between text-2xl font-sans font-bold py-3 transition-colors duration-300",
                      isDark ? "border-b border-white/[0.04]" : "border-b border-black/[0.06]",
                      location.pathname === link.path ? "text-google-blue" : isDark ? "text-white hover:text-google-blue" : "text-gray-900 hover:text-google-blue"
                    )}
                  >
                    {link.name}
                    <ChevronRight size={20} className="text-text-muted" />
                  </Link>
                </motion.div>
              ))}
            </div>
            <div className="mt-auto pt-8">
              {isAuthenticated ? (
                <div className="space-y-3">
                  <Link to="/profile" onClick={() => setIsOpen(false)} className="flex items-center gap-3 text-lg font-sans py-2">
                    <User size={18} /> My Profile
                  </Link>
                  {user.role === 'Admin' && (
                    <Link to="/admin" onClick={() => setIsOpen(false)} className="flex items-center gap-3 text-lg font-sans py-2">
                      <LayoutDashboard size={18} /> Admin Panel
                    </Link>
                  )}
                  <button onClick={() => { logout(); setIsOpen(false); }} className="flex items-center gap-3 text-lg font-sans text-google-red py-2">
                    <LogOut size={18} /> Logout
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <Link to="/login" onClick={() => setIsOpen(false)} className="text-lg font-sans text-center py-3 glass rounded-xl">Login</Link>
                  <Link to="/register" onClick={() => setIsOpen(false)}>
                    <GlowButton className="w-full py-3">Register</GlowButton>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
