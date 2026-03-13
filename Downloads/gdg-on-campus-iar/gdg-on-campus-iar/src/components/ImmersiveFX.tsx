import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const selectors = [
  'main section',
  'main .glass-strong',
  'main .google-gradient-border',
].join(',');

export const ImmersiveFX = () => {
  const location = useLocation();

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    let lastX = 0;
    let lastY = 0;
    let enterTimeout: number | undefined;

    const onMove = (e: MouseEvent) => {
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      lastX = x * 2 - 1;
      lastY = y * 2 - 1;
      root.style.setProperty('--mx', lastX.toFixed(4));
      root.style.setProperty('--my', lastY.toFixed(4));
    };

    const onLeave = () => {
      root.style.setProperty('--exit-x', lastX.toFixed(4));
      root.style.setProperty('--exit-y', lastY.toFixed(4));
      body.classList.add('fx-screen-exit');
    };

    const onEnter = () => {
      if (enterTimeout) window.clearTimeout(enterTimeout);
      enterTimeout = window.setTimeout(() => {
        body.classList.remove('fx-screen-exit');
      }, 140);
    };

    window.addEventListener('mousemove', onMove);
    document.documentElement.addEventListener('mouseleave', onLeave);
    document.documentElement.addEventListener('mouseenter', onEnter);

    const targets = Array.from(document.querySelectorAll<HTMLElement>(selectors));
    const tiltCleanup: Array<() => void> = [];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const el = entry.target as HTMLElement;
          if (entry.isIntersecting) el.classList.add('fx-in');
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' },
    );

    targets.forEach((el, idx) => {
      el.classList.add('fx-auto');
      el.style.setProperty('--fx-delay', `${Math.min(idx * 22, 360)}ms`);
      observer.observe(el);

      const onCardMove = (e: MouseEvent) => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / Math.max(r.width, 1);
        const py = (e.clientY - r.top) / Math.max(r.height, 1);
        const ry = (px - 0.5) * 10;
        const rx = (0.5 - py) * 8;
        const tx = (px - 0.5) * 12;
        const ty = (py - 0.5) * 8;
        el.style.setProperty('--rx', `${rx.toFixed(3)}deg`);
        el.style.setProperty('--ry', `${ry.toFixed(3)}deg`);
        el.style.setProperty('--tx', `${tx.toFixed(3)}px`);
        el.style.setProperty('--ty', `${ty.toFixed(3)}px`);
      };

      const onCardLeave = () => {
        el.style.setProperty('--rx', '0deg');
        el.style.setProperty('--ry', '0deg');
        el.style.setProperty('--tx', '0px');
        el.style.setProperty('--ty', '0px');
      };

      el.addEventListener('mousemove', onCardMove);
      el.addEventListener('mouseleave', onCardLeave);
      tiltCleanup.push(() => {
        el.removeEventListener('mousemove', onCardMove);
        el.removeEventListener('mouseleave', onCardLeave);
      });
    });

    return () => {
      if (enterTimeout) window.clearTimeout(enterTimeout);
      window.removeEventListener('mousemove', onMove);
      document.documentElement.removeEventListener('mouseleave', onLeave);
      document.documentElement.removeEventListener('mouseenter', onEnter);
      body.classList.remove('fx-screen-exit');
      observer.disconnect();
      tiltCleanup.forEach((fn) => fn());
    };
  }, [location.pathname]);

  return null;
};
