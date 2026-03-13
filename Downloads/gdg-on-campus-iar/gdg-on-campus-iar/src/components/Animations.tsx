import React, { useEffect, useRef, useCallback, useMemo, useState } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring, useInView } from 'motion/react';
import { cn } from '../hooks/useUtils';

/* ============================================================
   CUSTOM CURSOR – Active Theory-style floating cursor
   ============================================================ */
export const CursorFollower = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const posX = useRef(0);
  const posY = useRef(0);
  const mouseX = useRef(0);
  const mouseY = useRef(0);
  const scale = useRef(1);
  const targetScale = useRef(1);
  const rafId = useRef(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      mouseX.current = e.clientX;
      mouseY.current = e.clientY;
      if (!visible) setVisible(true);
    };

    const handleOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.closest('a') ||
        target.closest('button') ||
        target.closest('[data-magnetic]') ||
        target.closest('input') ||
        target.closest('textarea')
      ) {
        targetScale.current = 2.5;
      }
    };

    const handleOut = () => {
      targetScale.current = 1;
    };

    const handleLeave = () => setVisible(false);
    const handleEnter = () => setVisible(true);

    const animate = () => {
      // Smooth follow with lerp
      posX.current += (mouseX.current - posX.current) * 0.12;
      posY.current += (mouseY.current - posY.current) * 0.12;
      scale.current += (targetScale.current - scale.current) * 0.15;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${posX.current - 20}px, ${posY.current - 20}px, 0) scale(${scale.current})`;
      }
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouseX.current - 3}px, ${mouseY.current - 3}px, 0)`;
      }
      rafId.current = requestAnimationFrame(animate);
    };

    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseover', handleOver);
    document.addEventListener('mouseout', handleOut);
    document.addEventListener('mouseleave', handleLeave);
    document.addEventListener('mouseenter', handleEnter);
    rafId.current = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseover', handleOver);
      document.removeEventListener('mouseout', handleOut);
      document.removeEventListener('mouseleave', handleLeave);
      document.removeEventListener('mouseenter', handleEnter);
      cancelAnimationFrame(rafId.current);
    };
  }, [visible]);

  // Hide on touch devices
  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
    return null;
  }

  return (
    <>
      {/* Outer ring */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 z-[9999] pointer-events-none hidden md:block"
        style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.3s' }}
      >
        <div className="w-10 h-10 rounded-full border border-white/30 shadow-[0_0_15px_rgba(255,255,255,0.15),0_0_30px_rgba(66,133,244,0.1)]" />
      </div>
      {/* Inner dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 z-[9999] pointer-events-none hidden md:block"
        style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.3s' }}
      >
        <div className="w-1.5 h-1.5 rounded-full bg-white/80 shadow-[0_0_8px_rgba(255,255,255,0.4),0_0_20px_rgba(66,133,244,0.2)]" />
      </div>
    </>
  );
};

/* ============================================================
   TEXT REVEAL – Char-by-char scroll-driven reveal (Active Theory's signature)
   ============================================================ */
export const TextReveal = ({
  children,
  className,
  as: Tag = 'p',
  stagger = 0.02,
  once = true,
}: {
  children: string;
  className?: string;
  as?: 'p' | 'h1' | 'h2' | 'h3' | 'span';
  stagger?: number;
  once?: boolean;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, margin: '-10% 0px -10% 0px' });

  const words = children.split(' ');

  return (
    <Tag ref={ref} className={cn('overflow-hidden', className)}>
      {words.map((word, wi) => (
        <span key={wi} className="inline-block mr-[0.25em]">
          {word.split('').map((char, ci) => {
            const totalIndex = words.slice(0, wi).join(' ').length + ci;
            return (
              <motion.span
                key={ci}
                className="inline-block"
                initial={{ y: '100%', opacity: 0 }}
                animate={isInView ? { y: '0%', opacity: 1 } : { y: '100%', opacity: 0 }}
                transition={{
                  duration: 0.5,
                  delay: totalIndex * stagger,
                  ease: [0.23, 1, 0.32, 1],
                }}
              >
                {char}
              </motion.span>
            );
          })}
        </span>
      ))}
    </Tag>
  );
};

/* ============================================================
   LINE REVEAL – A horizontal line that draws itself on scroll
   ============================================================ */
export const LineReveal = ({ className, color = 'google-blue' }: { className?: string; color?: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-20% 0px' });

  const colorMap: Record<string, string> = {
    'google-blue': '#4285F4',
    'google-red': '#EA4335',
    'google-green': '#34A853',
    'google-yellow': '#FBBC05',
    white: '#ffffff',
  };

  return (
    <div ref={ref} className={cn('overflow-hidden', className)}>
      <motion.div
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1] }}
        style={{
          originX: 0,
          height: 1,
          background: `linear-gradient(90deg, ${colorMap[color] || color}, transparent)`,
        }}
      />
    </div>
  );
};

/* ============================================================
   MAGNETIC ELEMENT – Pulls toward cursor on hover
   ============================================================ */
export const MagneticElement = ({
  children,
  className,
  strength = 0.3,
}: {
  children: React.ReactNode;
  className?: string;
  strength?: number;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 150, damping: 15, mass: 0.1 });
  const springY = useSpring(y, { stiffness: 150, damping: 15, mass: 0.1 });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      x.set((e.clientX - cx) * strength);
      y.set((e.clientY - cy) * strength);
    },
    [strength, x, y],
  );

  const handleMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  return (
    <motion.div
      ref={ref}
      data-magnetic
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/* ============================================================
   REVEAL SECTION – Cinematic section entry with scale + clip
   ============================================================ */
export const RevealSection = ({
  children,
  className,
  direction = 'up',
}: {
  children: React.ReactNode;
  className?: string;
  direction?: 'up' | 'left' | 'right';
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-8% 0px' });

  const variants = {
    up: { hidden: { opacity: 0, y: 80 }, visible: { opacity: 1, y: 0 } },
    left: { hidden: { opacity: 0, x: -80 }, visible: { opacity: 1, x: 0 } },
    right: { hidden: { opacity: 0, x: 80 }, visible: { opacity: 1, x: 0 } },
  };

  return (
    <motion.div
      ref={ref}
      initial={variants[direction].hidden}
      animate={isInView ? variants[direction].visible : variants[direction].hidden}
      transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/* ============================================================
   PARALLAX LAYER – Scroll-driven depth parallax
   ============================================================ */
export const ParallaxLayer = ({
  children,
  className,
  speed = 0.5,
  offset,
}: {
  children: React.ReactNode;
  className?: string;
  speed?: number;
  offset?: { start?: string; end?: string };
}) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: [
      (offset?.start as any) || 'start end',
      (offset?.end as any) || 'end start',
    ],
  });
  const y = useTransform(scrollYProgress, [0, 1], [speed * 100, speed * -100]);

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
};

/* ============================================================
   MOUSE PARALLAX – Cursor-reactive depth layer
   ============================================================ */
export const MouseParallax = ({
  children,
  className,
  depth = 24,
}: {
  children: React.ReactNode;
  className?: string;
  depth?: number;
}) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 110, damping: 24, mass: 0.35 });
  const sy = useSpring(y, { stiffness: 110, damping: 24, mass: 0.35 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const nx = e.clientX / window.innerWidth - 0.5;
      const ny = e.clientY / window.innerHeight - 0.5;
      x.set(nx * depth);
      y.set(ny * depth * 0.8);
    };
    const onLeave = () => {
      x.set(0);
      y.set(0);
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseleave', onLeave);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseleave', onLeave);
    };
  }, [depth, x, y]);

  return (
    <motion.div
      style={{ x: sx, y: sy, transformStyle: 'preserve-3d' }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/* ============================================================
   WORD REVEAL – Words slide up one at a time (lighter than char reveal)
   ============================================================ */
export const WordReveal = ({
  children,
  className,
  as: Tag = 'h2',
  delay = 0,
}: {
  children: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
  delay?: number;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-15% 0px' });

  const words = children.split(' ');

  return (
    <Tag ref={ref} className={className}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden mr-[0.3em]">
          <motion.span
            className="inline-block"
            initial={{ y: '110%' }}
            animate={isInView ? { y: '0%' } : { y: '110%' }}
            transition={{
              duration: 0.7,
              delay: delay + i * 0.08,
              ease: [0.23, 1, 0.32, 1],
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
};

/* ============================================================
   SCROLL PROGRESS BAR – Thin line at top of page like Active Theory
   ============================================================ */
export const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2px] z-[100] origin-left"
      style={{
        scaleX: scrollYProgress,
        background: 'linear-gradient(90deg, #EA4335, #4285F4, #FBBC05, #34A853)',
      }}
    />
  );
};

/* ============================================================
   STAGGER CHILDREN – Wrapper that staggers children on scroll
   ============================================================ */
export const StaggerChildren = ({
  children,
  className,
  stagger = 0.1,
}: {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-10% 0px' });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={{
        visible: { transition: { staggerChildren: stagger } },
        hidden: {},
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const StaggerItem = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, y: 40 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.23, 1, 0.32, 1] } },
    }}
    className={className}
  >
    {children}
  </motion.div>
);

/* ============================================================
   IMAGE REVEAL – Clip-path reveal like Active Theory's projects
   ============================================================ */
export const ImageReveal = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-10% 0px' });

  return (
    <div ref={ref} className={cn('overflow-hidden', className)}>
      <motion.div
        initial={{ clipPath: 'inset(100% 0% 0% 0%)', scale: 1.2 }}
        animate={
          isInView
            ? { clipPath: 'inset(0% 0% 0% 0%)', scale: 1 }
            : { clipPath: 'inset(100% 0% 0% 0%)', scale: 1.2 }
        }
        transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1] }}
      >
        {children}
      </motion.div>
    </div>
  );
};

/* ============================================================
   NUMBER COUNTER – Smooth count-up triggered on scroll
   ============================================================ */
export const CountUp = ({
  value,
  suffix = '',
  className,
  duration = 2000,
}: {
  value: number;
  suffix?: string;
  className?: string;
  duration?: number;
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const increment = value / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, value, duration]);

  return (
    <span ref={ref} className={className}>
      {count}{suffix}
    </span>
  );
};
