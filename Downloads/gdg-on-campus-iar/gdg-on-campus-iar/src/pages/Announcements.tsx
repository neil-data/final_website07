import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { Link } from 'react-router-dom';
import { Megaphone, Pin, Calendar, ArrowRight, Filter, Trophy, Zap, Bell, Info, Sparkles, type LucideIcon } from 'lucide-react';
import { type Announcement } from '../mock/media';
import { useMediaStore } from '../store/mediaStore';
import { FloatingOrb } from '../components/UI';
import { cn } from '../hooks/useUtils';
import { WordReveal, LineReveal, TextReveal, RevealSection, StaggerChildren, StaggerItem, ParallaxLayer, CountUp } from '../components/Animations';

/* ── Type config ─────────────────────────────────────── */
const TYPE_CONFIG: Record<string, { icon: LucideIcon; label: string; color: string; bg: string; rgba: string }> = {
  event:       { icon: Calendar, label: 'Event',       color: 'text-google-blue',   bg: 'bg-google-blue/10',   rgba: 'rgba(66,133,244,' },
  update:      { icon: Zap,      label: 'Update',      color: 'text-google-green',  bg: 'bg-google-green/10',  rgba: 'rgba(52,168,83,' },
  achievement: { icon: Trophy,   label: 'Achievement', color: 'text-google-yellow', bg: 'bg-google-yellow/10', rgba: 'rgba(251,188,5,' },
  general:     { icon: Info,     label: 'General',     color: 'text-text-muted',    bg: 'bg-white/5',          rgba: 'rgba(255,255,255,' },
};

const FILTERS = ['All', 'event', 'update', 'achievement', 'general'] as const;

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

/* ═══════════════════════════════════════════════════════
   ██  Announcement Card
   ═══════════════════════════════════════════════════════ */
const AnnouncementCard = ({ ann, index }: { ann: Announcement; index: number }) => {
  const tc = TYPE_CONFIG[ann.type] ?? TYPE_CONFIG.general;
  const Icon = tc.icon;

  const inner = (
    <div
      className={cn(
        'group flex flex-col sm:flex-row items-start gap-5 p-6 md:p-8 rounded-2xl glass border border-white/[0.04] transition-all duration-500',
        ann.link && 'hover:border-white/[0.12] hover:glass-strong hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(0,0,0,0.4)] cursor-pointer',
      )}
    >
      {/* Icon */}
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-all duration-500 group-hover:scale-110"
        style={{ background: `${tc.rgba}0.1)` }}
      >
        <Icon size={22} className={tc.color} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 flex-wrap mb-3">
          {ann.pinned && (
            <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-[0.15em] font-mono text-google-red bg-google-red/10">
              <Pin size={10} /> Pinned
            </span>
          )}
          <span className={cn('px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-[0.15em] font-mono', tc.color, tc.bg)}>
            {tc.label}
          </span>
          <span className="text-[10px] font-mono text-text-muted/60 flex items-center gap-1">
            <Calendar size={10} /> {formatDate(ann.date)}
          </span>
        </div>

        <h3 className="text-lg md:text-xl font-sans font-bold mb-2 group-hover:text-gradient transition-all duration-300">
          {ann.title}
        </h3>
        <p className="text-text-muted text-sm leading-relaxed">
          {ann.description}
        </p>
      </div>

      {/* Arrow */}
      {ann.link && (
        <ArrowRight
          size={18}
          className="text-text-muted group-hover:text-white shrink-0 mt-1 sm:mt-5 group-hover:translate-x-1 transition-all duration-300"
        />
      )}
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.06, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
    >
      {ann.link ? <Link to={ann.link}>{inner}</Link> : inner}
    </motion.div>
  );
};

/* ═══════════════════════════════════════════════════════
   ██  ANNOUNCEMENTS PAGE
   ═══════════════════════════════════════════════════════ */
export const Announcements = () => {
  const { announcements } = useMediaStore();
  const [activeFilter, setActiveFilter] = useState<string>('All');

  const heroRef = useRef(null);
  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroOpacity = useTransform(heroScroll, [0, 0.6], [1, 0]);
  const heroY = useTransform(heroScroll, [0, 0.6], [0, 60]);

  const filtered = activeFilter === 'All'
    ? announcements
    : announcements.filter(a => a.type === activeFilter);

  // Sort: pinned first, then by date desc
  const sorted = [...filtered].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return (
    <div className="relative">
      {/* ═══ PAGE HERO ═══ */}
      <section ref={heroRef} className="relative pt-40 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-google-yellow/[0.04] via-transparent to-transparent" />
        <ParallaxLayer speed={-0.2} className="absolute -top-20 -right-40 pointer-events-none">
          <FloatingOrb color="#FBBC05" size={500} className="opacity-25" />
        </ParallaxLayer>
        <ParallaxLayer speed={0.1} className="absolute top-1/3 -left-32 pointer-events-none">
          <FloatingOrb color="#34A853" size={350} className="opacity-20" />
        </ParallaxLayer>

        <motion.div style={{ opacity: heroOpacity, y: heroY }} className="max-w-7xl mx-auto text-center relative">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass-strong text-xs font-mono text-google-yellow tracking-wider uppercase mb-8 border border-google-yellow/10"
          >
            <Megaphone size={14} /> Announcements
          </motion.span>
          <WordReveal as="h1" className="text-5xl md:text-7xl lg:text-8xl font-sans font-extrabold mb-6 leading-[0.92] tracking-[-0.02em]">
            Stay Updated
          </WordReveal>
          <LineReveal className="max-w-xs mx-auto mb-6" color="google-yellow" />
          <TextReveal className="text-lg text-text-muted font-mono max-w-2xl mx-auto" stagger={0.01}>
            All the latest news, events, and milestones from GDGoC IAR — in one place.
          </TextReveal>
        </motion.div>
      </section>

      {/* ═══ STATS ═══ */}
      <section className="px-6 max-w-4xl mx-auto mb-16">
        <StaggerChildren className="grid grid-cols-2 md:grid-cols-4 gap-4" stagger={0.08}>
          {(['event', 'update', 'achievement', 'general'] as const).map((type) => {
            const tc = TYPE_CONFIG[type];
            const count = announcements.filter(a => a.type === type).length;
            const Icon = tc.icon;
            return (
              <StaggerItem key={type}>
                <button
                  onClick={() => setActiveFilter(type)}
                  className={cn(
                    'w-full p-5 rounded-2xl glass border border-white/[0.04] hover:border-white/[0.1] transition-all duration-300 text-center group',
                    activeFilter === type && 'glass-strong border-white/[0.15]',
                  )}
                >
                  <Icon size={22} className={cn(tc.color, 'mx-auto mb-2 group-hover:scale-110 transition-transform')} />
                  <div className="text-2xl font-sans font-extrabold text-white"><CountUp value={count} /></div>
                  <div className="text-[10px] font-mono text-text-muted uppercase tracking-[0.15em] mt-1">{tc.label}s</div>
                </button>
              </StaggerItem>
            );
          })}
        </StaggerChildren>
      </section>

      {/* ═══ FILTER TABS ═══ */}
      <section className="px-6 max-w-7xl mx-auto mb-12">
        <div className="flex flex-wrap justify-center gap-3">
          {FILTERS.map((filter) => {
            const isActive = activeFilter === filter;
            const tc = filter !== 'All' ? TYPE_CONFIG[filter] : null;
            const FilterIcon = tc?.icon ?? Filter;
            return (
              <motion.button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  'px-5 py-2.5 rounded-full font-mono text-sm transition-all duration-300 border relative overflow-hidden flex items-center gap-2',
                  isActive
                    ? 'bg-white text-bg-base border-white shadow-[0_0_25px_rgba(255,255,255,0.2)] font-bold'
                    : 'bg-transparent text-text-muted border-white/10 hover:border-white/30 hover:bg-white/[0.03]',
                )}
              >
                <FilterIcon size={14} />
                {filter === 'All' ? 'All' : tc?.label}
                {isActive && (
                  <motion.div
                    layoutId="annFilter"
                    className="absolute inset-0 bg-white rounded-full -z-10"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </section>

      {/* ═══ ANNOUNCEMENTS LIST ═══ */}
      <section className="px-6 max-w-4xl mx-auto pb-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            className="space-y-4"
          >
            {sorted.length > 0 ? (
              sorted.map((ann, i) => (
                <AnnouncementCard key={ann.id} ann={ann} index={i} />
              ))
            ) : (
              <div className="py-20 text-center glass-strong rounded-2xl border border-white/[0.03]">
                <p className="text-text-muted font-mono">No announcements found for this category.</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </section>

      {/* ═══ SUBSCRIBE CTA ═══ */}
      <section className="px-6 max-w-4xl mx-auto pb-32">
        <RevealSection>
          <div className="glass-strong rounded-3xl p-12 md:p-16 text-center relative overflow-hidden border border-white/[0.06]">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-google-yellow via-google-green to-google-blue" />
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-google-yellow/[0.06] rounded-full blur-3xl" />
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-google-green/[0.06] rounded-full blur-3xl" />

            <Bell size={32} className="text-google-yellow mx-auto mb-6 opacity-60" />
            <h2 className="text-3xl md:text-5xl font-sans font-extrabold mb-4">
              Never Miss an Update
            </h2>
            <p className="text-text-muted font-mono max-w-lg mx-auto mb-8">
              Follow us on social media and check back regularly to stay in the loop with everything GDGoC IAR.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a
                href="/media"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-google-yellow to-yellow-500 text-bg-base font-sans font-semibold shadow-[0_0_25px_rgba(251,188,5,0.4)] hover:shadow-[0_0_40px_rgba(251,188,5,0.6)] transition-shadow duration-300"
              >
                <Sparkles size={18} /> Visit Media Hub
              </motion.a>
              <motion.a
                href="/contact"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-transparent border border-white/20 text-white font-sans font-semibold hover:border-white/40 hover:bg-white/[0.05] transition-all duration-300"
              >
                Contact Us <ArrowRight size={18} />
              </motion.a>
            </div>
          </div>
        </RevealSection>
      </section>
    </div>
  );
};
