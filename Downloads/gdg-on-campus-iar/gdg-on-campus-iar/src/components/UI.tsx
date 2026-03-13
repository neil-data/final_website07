import React, { useRef, useCallback, useState } from 'react';
import { motion, HTMLMotionProps } from 'motion/react';
import { cn } from '../hooks/useUtils';

interface GlowButtonProps extends HTMLMotionProps<'button'> {
  variant?: 'primary' | 'secondary' | 'ghost';
  children: React.ReactNode;
}

export const GlowButton = ({ className, variant = 'primary', children, ...props }: GlowButtonProps) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        "relative px-6 py-3 rounded-full font-sans font-semibold transition-all duration-300 overflow-hidden group",
        variant === 'primary' && "bg-gradient-to-r from-google-blue to-blue-500 text-white shadow-[0_0_25px_rgba(66,133,244,0.4),0_4px_15px_rgba(0,0,0,0.3)] hover:shadow-[0_0_40px_rgba(66,133,244,0.6),0_8px_25px_rgba(0,0,0,0.3)]",
        variant === 'secondary' && "bg-white/[0.08] text-white hover:bg-white/[0.15] backdrop-blur-sm border border-white/10 hover:border-white/20 shadow-[0_4px_15px_rgba(0,0,0,0.2)]",
        variant === 'ghost' && "bg-transparent border border-white/20 text-white hover:border-white/40 hover:bg-white/[0.05] shadow-[0_4px_15px_rgba(0,0,0,0.1)]",
        className
      )}
      {...props}
    >
      {/* Shimmer on hover */}
      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
      <span className="relative z-10 flex items-center justify-center gap-2">{children}</span>
    </motion.button>
  );
};

export const GhostButton = ({ className, children, ...props }: GlowButtonProps) => (
  <GlowButton variant="ghost" className={className} {...props}>
    {children}
  </GlowButton>
);

/* ---------- 3D Tilt Card (throttled with rAF) ---------- */
export const GradientCard = ({ className, children, glowColor }: { className?: string; children: React.ReactNode; glowColor?: string }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const rafId = useRef<number>(0);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    // Throttle to one update per frame
    cancelAnimationFrame(rafId.current);
    const clientX = e.clientX;
    const clientY = e.clientY;
    rafId.current = requestAnimationFrame(() => {
      const rect = card.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      const rotateX = ((y - rect.height / 2) / (rect.height / 2)) * -3;
      const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 3;
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(5px)`;
      if (glowRef.current) {
        glowRef.current.style.background = `radial-gradient(400px circle at ${x}px ${y}px, ${glowColor || 'rgba(66,133,244,0.06)'}, transparent 40%)`;
      }
    });
  }, [glowColor]);

  const handleMouseLeave = useCallback(() => {
    cancelAnimationFrame(rafId.current);
    if (cardRef.current) {
      cardRef.current.style.transform = '';
    }
    if (glowRef.current) {
      glowRef.current.style.background = 'transparent';
    }
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "google-gradient-border bg-bg-card/80 p-6 rounded-2xl relative overflow-hidden",
        "transition-[transform,box-shadow] duration-300 ease-out will-change-transform",
        "hover:shadow-[0_20px_60px_rgba(0,0,0,0.4),0_0_30px_rgba(66,133,244,0.08)]",
        className
      )}
    >
      <div ref={glowRef} className="absolute inset-0 pointer-events-none rounded-2xl" />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export const Avatar = ({ src, className, size = 'md' }: { src: string; className?: string; size?: 'sm' | 'md' | 'lg' }) => {
  const sizes = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-24 h-24'
  };

  return (
    <div className={cn(
      "relative rounded-full p-[2px] google-gradient-border group/avatar",
      sizes[size],
      className
    )}>
      <img
        src={src}
        alt="Avatar"
        className="w-full h-full rounded-full object-cover transition-transform duration-500 group-hover/avatar:scale-105"
        referrerPolicy="no-referrer"
      />
      <div className="absolute inset-0 rounded-full opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-500 bg-gradient-to-tr from-google-blue/20 via-transparent to-google-red/20 pointer-events-none" />
    </div>
  );
};

export const Badge = ({ children, color = 'blue', className }: { children: React.ReactNode; color?: 'red' | 'blue' | 'yellow' | 'green'; className?: string }) => {
  const colors = {
    red: 'bg-google-red/15 text-google-red border-google-red/25 shadow-[0_0_10px_rgba(234,67,53,0.1)]',
    blue: 'bg-google-blue/15 text-google-blue border-google-blue/25 shadow-[0_0_10px_rgba(66,133,244,0.1)]',
    yellow: 'bg-google-yellow/15 text-google-yellow border-google-yellow/25 shadow-[0_0_10px_rgba(251,188,5,0.1)]',
    green: 'bg-google-green/15 text-google-green border-google-green/25 shadow-[0_0_10px_rgba(52,168,83,0.1)]'
  };

  return (
    <span className={cn(
      "px-3 py-1 rounded-full text-xs font-semibold border backdrop-blur-sm",
      colors[color],
      className
    )}>
      {children}
    </span>
  );
};

/* ---------- Section header ---------- */
export const SectionHeader = ({ title, subtitle, className }: { title: string; subtitle?: string; className?: string }) => (
  <div className={cn("text-center mb-20", className)}>
    <motion.h2
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-4xl md:text-5xl font-sans font-bold mb-4 relative inline-block"
    >
      {title}
      <span className="absolute -bottom-2 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-google-blue/50 to-transparent" />
    </motion.h2>
    {subtitle && (
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="text-text-muted font-mono mt-4"
      >
        {subtitle}
      </motion.p>
    )}
  </div>
);

/* ---------- Floating orb decoration ---------- */
export const FloatingOrb = ({ color, size, className }: { color: string; size: number; className?: string }) => (
  <div
    className={cn("absolute rounded-full pointer-events-none", className)}
    style={{
      width: size,
      height: size,
      background: `radial-gradient(circle, ${color}15 0%, transparent 70%)`,
      willChange: 'transform',
    }}
  />
);
