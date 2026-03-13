import React, { useRef, useEffect, createContext, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

// Page Transition Context
const TransitionContext = createContext<{
  timeline: gsap.core.Timeline | null;
}>({ timeline: null });

export const usePageTransition = () => useContext(TransitionContext);

// GSAP Page Transition Wrapper
export const PageTransitionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const timeline = useRef(gsap.timeline({ paused: true }));

  return (
    <TransitionContext.Provider value={{ timeline: timeline.current }}>
      {children}
    </TransitionContext.Provider>
  );
};

// Animated Page Wrapper with GSAP
export const GSAPPageTransition: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const containerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Page enter animation
      const tl = gsap.timeline();
      
      tl.fromTo(overlayRef.current,
        { scaleY: 1, transformOrigin: 'top' },
        { scaleY: 0, duration: 0.6, ease: 'power4.inOut' }
      );
      
      tl.fromTo(containerRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
        '-=0.3'
      );
    }, containerRef);

    return () => ctx.revert();
  }, [location.pathname]);

  return (
    <>
      {/* Transition overlay */}
      <div
        ref={overlayRef}
        className="fixed inset-0 z-[9999] bg-gradient-to-b from-[#4285F4] via-[#34A853] to-[#EA4335] pointer-events-none"
        style={{ transformOrigin: 'top' }}
      />
      <div ref={containerRef}>
        {children}
      </div>
    </>
  );
};

// Scroll-triggered reveal animation
export const ScrollReveal: React.FC<{
  children: React.ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right';
  delay?: number;
  duration?: number;
  className?: string;
}> = ({ children, direction = 'up', delay = 0, duration = 1, className }) => {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const directions = {
      up: { y: 80, x: 0 },
      down: { y: -80, x: 0 },
      left: { y: 0, x: 80 },
      right: { y: 0, x: -80 },
    };

    gsap.fromTo(ref.current,
      { 
        opacity: 0, 
        y: directions[direction].y, 
        x: directions[direction].x,
        scale: 0.95
      },
      {
        opacity: 1,
        y: 0,
        x: 0,
        scale: 1,
        duration,
        delay,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 85%',
          end: 'top 50%',
          toggleActions: 'play none none reverse',
        }
      }
    );
  }, { scope: ref });

  return <div ref={ref} className={className}>{children}</div>;
};

// Parallax scroll effect
export const GSAPParallax: React.FC<{
  children: React.ReactNode;
  speed?: number;
  className?: string;
}> = ({ children, speed = 0.5, className }) => {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.to(ref.current, {
      y: () => -ScrollTrigger.maxScroll(window) * speed * 0.1,
      ease: 'none',
      scrollTrigger: {
        trigger: ref.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
        invalidateOnRefresh: true,
      }
    });
  }, { scope: ref });

  return <div ref={ref} className={className}>{children}</div>;
};

// Text split animation
export const SplitText: React.FC<{
  children: string;
  className?: string;
  delay?: number;
}> = ({ children, className, delay = 0 }) => {
  const containerRef = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    const chars = containerRef.current?.querySelectorAll('.char');
    if (!chars) return;

    gsap.fromTo(chars,
      { opacity: 0, y: 50, rotateX: -90 },
      {
        opacity: 1,
        y: 0,
        rotateX: 0,
        duration: 0.8,
        stagger: 0.03,
        delay,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        }
      }
    );
  }, { scope: containerRef });

  return (
    <span ref={containerRef} className={className} style={{ perspective: '1000px' }}>
      {children.split('').map((char, i) => (
        <span
          key={i}
          className="char inline-block"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </span>
  );
};

// Magnetic hover effect
export const MagneticHover: React.FC<{
  children: React.ReactNode;
  strength?: number;
  className?: string;
}> = ({ children, strength = 0.3, className }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      gsap.to(el, {
        x: x * strength,
        y: y * strength,
        duration: 0.3,
        ease: 'power2.out'
      });
    };

    const handleLeave = () => {
      gsap.to(el, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: 'elastic.out(1, 0.5)'
      });
    };

    el.addEventListener('mousemove', handleMove);
    el.addEventListener('mouseleave', handleLeave);

    return () => {
      el.removeEventListener('mousemove', handleMove);
      el.removeEventListener('mouseleave', handleLeave);
    };
  }, [strength]);

  return <div ref={ref} className={className}>{children}</div>;
};

// Smooth scroll progress indicator
export const ScrollProgress: React.FC = () => {
  const progressRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.to(progressRef.current, {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.3,
      }
    });
  });

  return (
    <div className="fixed top-0 left-0 right-0 h-1 z-[100] bg-white/10">
      <div
        ref={progressRef}
        className="h-full bg-gradient-to-r from-[#4285F4] via-[#34A853] to-[#EA4335] origin-left"
        style={{ transform: 'scaleX(0)' }}
      />
    </div>
  );
};

// Stagger reveal for lists
export const StaggerReveal: React.FC<{
  children: React.ReactNode[];
  stagger?: number;
  className?: string;
}> = ({ children, stagger = 0.1, className }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const items = containerRef.current?.children;
    if (!items) return;

    gsap.fromTo(items,
      { opacity: 0, y: 60, scale: 0.9 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        stagger,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        }
      }
    );
  }, { scope: containerRef });

  return <div ref={containerRef} className={className}>{children}</div>;
};

// Horizontal scroll section
export const HorizontalScroll: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const scrollWidth = scrollRef.current?.scrollWidth || 0;
    const containerWidth = containerRef.current?.offsetWidth || 0;

    gsap.to(scrollRef.current, {
      x: -(scrollWidth - containerWidth),
      ease: 'none',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: () => `+=${scrollWidth - containerWidth}`,
        scrub: 1,
        pin: true,
        anticipatePin: 1,
      }
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className={`overflow-hidden ${className}`}>
      <div ref={scrollRef} className="flex">
        {children}
      </div>
    </div>
  );
};

// 3D Tilt card effect
export const TiltCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  intensity?: number;
}> = ({ children, className, intensity = 15 }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      gsap.to(el, {
        rotateY: x * intensity,
        rotateX: -y * intensity,
        transformPerspective: 1000,
        duration: 0.3,
        ease: 'power2.out'
      });
    };

    const handleLeave = () => {
      gsap.to(el, {
        rotateY: 0,
        rotateX: 0,
        duration: 0.5,
        ease: 'power2.out'
      });
    };

    el.addEventListener('mousemove', handleMove);
    el.addEventListener('mouseleave', handleLeave);

    return () => {
      el.removeEventListener('mousemove', handleMove);
      el.removeEventListener('mouseleave', handleLeave);
    };
  }, [intensity]);

  return (
    <div ref={ref} className={className} style={{ transformStyle: 'preserve-3d' }}>
      {children}
    </div>
  );
};

// Cursor follower
export const CustomCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const follower = followerRef.current;
    if (!cursor || !follower) return;

    const moveCursor = (e: MouseEvent) => {
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1,
      });
      gsap.to(follower, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.3,
      });
    };

    const handleHover = () => {
      gsap.to(cursor, { scale: 0.5, duration: 0.2 });
      gsap.to(follower, { scale: 1.5, duration: 0.3 });
    };

    const handleLeave = () => {
      gsap.to(cursor, { scale: 1, duration: 0.2 });
      gsap.to(follower, { scale: 1, duration: 0.3 });
    };

    window.addEventListener('mousemove', moveCursor);
    document.querySelectorAll('a, button').forEach(el => {
      el.addEventListener('mouseenter', handleHover);
      el.addEventListener('mouseleave', handleLeave);
    });

    return () => {
      window.removeEventListener('mousemove', moveCursor);
    };
  }, []);

  return (
    <>
      <div
        ref={cursorRef}
        className="fixed w-2 h-2 bg-white rounded-full pointer-events-none z-[10000] mix-blend-difference"
        style={{ transform: 'translate(-50%, -50%)' }}
      />
      <div
        ref={followerRef}
        className="fixed w-8 h-8 border border-white/50 rounded-full pointer-events-none z-[9999] mix-blend-difference"
        style={{ transform: 'translate(-50%, -50%)' }}
      />
    </>
  );
};
