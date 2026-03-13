import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Linkedin, Twitter, Instagram, ArrowUp, Heart, Mail, Zap } from 'lucide-react';
import { cn } from '../hooks/useUtils';
import { BrandLogo } from './BrandLogo';
import { useThemeStore } from '../store/themeStore';

export const Footer = () => {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  const isDark = useThemeStore((s) => s.theme === 'dark');

  return (
    <footer className={cn("relative bg-bg-base pt-24 pb-10 px-6 overflow-hidden",
      isDark ? "border-t border-white/[0.04]" : "border-t border-black/[0.06]"
    )}>
      {/* Animated gradient border */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-google-red via-google-blue to-google-green animate-gradient-move bg-[length:400%_100%]" />
      
      {/* Background glow spots */}
      <div className="absolute bottom-0 left-1/4 w-[600px] h-[300px] bg-google-blue/[0.03] rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[250px] bg-google-red/[0.02] rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative">
        {/* Top section: Logo + Newsletter */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-16 pb-12 border-b border-white/[0.04]">
          <div className="flex items-center gap-3">
            <BrandLogo size={44} />
            <div>
              <span className={cn("font-sans font-bold text-xl bg-clip-text text-transparent block",
                isDark ? "bg-gradient-to-r from-white to-white/70" : "bg-gradient-to-r from-gray-900 to-gray-700"
              )}>GDG on Campus IAR</span>
              <span className="text-[10px] font-mono text-text-muted uppercase tracking-[0.2em]">Powered by Google</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-3 glass rounded-xl text-sm text-text-muted">
              <Mail size={16} />
              <span className="font-mono">gdg.iar@example.com</span>
            </div>
            <Link to="/register" className="px-5 py-3 bg-google-blue text-white rounded-xl text-sm font-bold flex items-center gap-2 hover:shadow-[0_0_25px_rgba(66,133,244,0.3)] transition-all duration-300">
              <Zap size={16} /> Join Us
            </Link>
          </div>
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <p className="text-text-muted max-w-md mb-8 leading-relaxed">
              Join the developer ecosystem powered by Google technology. Build, learn, and innovate with the student-run community at IAR.
            </p>
            <div className="flex gap-3">
              {[
                { icon: Github, color: 'hover:text-white hover:bg-white/10 hover:shadow-[0_0_25px_rgba(255,255,255,0.12)]', link: '#', label: 'GitHub' },
                { icon: Linkedin, color: 'hover:text-[#0077b5] hover:bg-[#0077b5]/10 hover:shadow-[0_0_25px_rgba(0,119,181,0.25)]', link: '#', label: 'LinkedIn' },
                { icon: Twitter, color: 'hover:text-[#1da1f2] hover:bg-[#1da1f2]/10 hover:shadow-[0_0_25px_rgba(29,161,242,0.25)]', link: '#', label: 'Twitter' },
                { icon: Instagram, color: 'hover:text-[#e1306c] hover:bg-[#e1306c]/10 hover:shadow-[0_0_25px_rgba(225,48,108,0.25)]', link: '#', label: 'Instagram' },
              ].map((social, i) => (
                <a key={i} href={social.link} className={cn(
                  "p-3 glass rounded-xl transition-all duration-300 group flex flex-col items-center gap-1",
                  social.color
                )}>
                  <social.icon size={20} className="transition-transform duration-300 group-hover:scale-110" />
                  <span className="text-[8px] font-mono uppercase tracking-wider text-text-muted/30 group-hover:text-current transition-colors">{social.label}</span>
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-sans font-bold mb-6 text-xs uppercase tracking-[0.2em] text-text-muted">Quick Links</h4>
            <ul className="flex flex-col gap-3 text-text-muted text-sm">
              {[
                { label: 'About Us', path: '/' },
                { label: 'Events', path: '/events' },
                { label: 'Leaderboard', path: '/leaderboard' },
                { label: 'Our Team', path: '/team' },
                { label: 'Contact', path: '/contact' },
              ].map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="hover:text-white transition-all duration-300 hover:translate-x-1 inline-flex items-center gap-1.5 group">
                    <span className="w-0 h-[1px] bg-google-blue group-hover:w-3 transition-all duration-300" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-sans font-bold mb-6 text-xs uppercase tracking-[0.2em] text-text-muted">Resources</h4>
            <ul className="flex flex-col gap-3 text-text-muted text-sm">
              <li><a href="#" className="hover:text-white transition-all duration-300 hover:translate-x-1 inline-flex items-center gap-1.5 group"><span className="w-0 h-[1px] bg-google-red group-hover:w-3 transition-all duration-300" />Google Developers</a></li>
              <li><a href="#" className="hover:text-white transition-all duration-300 hover:translate-x-1 inline-flex items-center gap-1.5 group"><span className="w-0 h-[1px] bg-google-green group-hover:w-3 transition-all duration-300" />GCP Documentation</a></li>
              <li><a href="#" className="hover:text-white transition-all duration-300 hover:translate-x-1 inline-flex items-center gap-1.5 group"><span className="w-0 h-[1px] bg-google-yellow group-hover:w-3 transition-all duration-300" />Community Guidelines</a></li>
              <li><Link to="/contact" className="hover:text-white transition-all duration-300 hover:translate-x-1 inline-flex items-center gap-1.5 group"><span className="w-0 h-[1px] bg-google-blue group-hover:w-3 transition-all duration-300" />Contact Support</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/[0.04]">
          <p className="text-text-muted text-xs mb-4 md:mb-0 flex items-center gap-1.5 font-mono">
            © {new Date().getFullYear()} GDG on Campus IAR. Made with <Heart size={12} className="text-google-red inline animate-pulse" /> by the community.
          </p>
          <button 
            onClick={scrollToTop}
            className="flex items-center gap-2 text-xs font-mono text-text-muted hover:text-white transition-all duration-300 group"
          >
            Back to Top
            <div className="p-1.5 rounded-lg glass group-hover:bg-white/10 group-hover:shadow-[0_0_15px_rgba(66,133,244,0.2)] transition-all duration-300">
              <ArrowUp size={14} className="group-hover:-translate-y-0.5 transition-transform duration-300" />
            </div>
          </button>
        </div>
      </div>
    </footer>
  );
};
