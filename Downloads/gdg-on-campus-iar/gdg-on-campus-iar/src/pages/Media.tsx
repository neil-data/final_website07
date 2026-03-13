import React, { useState } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { ExternalLink, Play, Linkedin, Instagram, Twitter, Youtube, Filter, Calendar, ArrowRight, Sparkles, ChevronLeft, ChevronRight, type LucideIcon } from 'lucide-react';
import { type MediaPost } from '../mock/media';
import { useMediaStore } from '../store/mediaStore';
import { FloatingOrb } from '../components/UI';
import { cn } from '../hooks/useUtils';
import { WordReveal, LineReveal, TextReveal, RevealSection, StaggerChildren, StaggerItem, ParallaxLayer } from '../components/Animations';
import { useRef } from 'react';

// Swiper imports
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCards, Autoplay, Navigation, Thumbs } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import 'swiper/css/effect-cards';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';

/* ── Platform config ─────────────────────────────────── */
const PLATFORM_CONFIG: Record<string, { icon: LucideIcon; label: string; color: string; rgba: string; bgHover: string }> = {
  linkedin:  { icon: Linkedin,  label: 'LinkedIn',  color: 'text-[#0077b5]', rgba: 'rgba(0,119,181,',  bgHover: 'hover:bg-[#0077b5]/10' },
  instagram: { icon: Instagram, label: 'Instagram', color: 'text-[#E4405F]', rgba: 'rgba(228,64,95,',  bgHover: 'hover:bg-[#E4405F]/10' },
  twitter:   { icon: Twitter,   label: 'X / Twitter', color: 'text-white',   rgba: 'rgba(255,255,255,', bgHover: 'hover:bg-white/10' },
  youtube:   { icon: Play,      label: 'YouTube',   color: 'text-[#FF0000]', rgba: 'rgba(255,0,0,',    bgHover: 'hover:bg-[#FF0000]/10' },
};

const PLATFORMS = ['All', 'linkedin', 'instagram', 'twitter', 'youtube'] as const;

/* ── Format date helper ──────────────────────────────── */
const formatDate = (dateStr: string) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

/* ═══════════════════════════════════════════════════════
   ██  Media Card
   ═══════════════════════════════════════════════════════ */
const MediaCard = ({ post, index }: { post: MediaPost; index: number }) => {
  const cfg = PLATFORM_CONFIG[post.platform];
  const Icon = cfg.icon;

  return (
    <motion.a
      href={post.url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.06, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
      className="group block glass-strong rounded-2xl overflow-hidden border border-white/[0.04] hover:border-white/[0.12] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
    >
      {/* Thumbnail */}
      <div className="relative h-52 overflow-hidden">
        <img
          src={post.thumbnail}
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg-base via-bg-base/30 to-transparent" />

        {/* Platform badge */}
        <div
          className="absolute top-4 left-4 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.15em] font-mono backdrop-blur-md flex items-center gap-1.5 border"
          style={{
            background: `${cfg.rgba}0.15)`,
            borderColor: `${cfg.rgba}0.3)`,
          }}
        >
          <Icon size={12} className={cfg.color} />
          <span className={cfg.color}>{cfg.label}</span>
        </div>

        {/* Play button for YouTube */}
        {post.platform === 'youtube' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-[#FF0000]/90 flex items-center justify-center shadow-[0_0_30px_rgba(255,0,0,0.4)] group-hover:scale-110 transition-transform duration-300">
              <Play size={24} fill="white" className="text-white ml-1" />
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-center gap-2 text-[10px] text-text-muted font-mono uppercase tracking-[0.15em] mb-3">
          <Calendar size={10} />
          {formatDate(post.date)}
          {post.author && (
            <>
              <span className="w-1 h-1 rounded-full bg-white/20" />
              {post.author}
            </>
          )}
        </div>
        <h3 className="text-lg font-sans font-bold mb-2 group-hover:text-gradient transition-all duration-300 line-clamp-2">
          {post.title}
        </h3>
        <p className="text-text-muted text-sm leading-relaxed line-clamp-3 mb-4">
          {post.description}
        </p>
        <span className={cn('inline-flex items-center gap-2 text-sm font-bold group-hover:gap-3 transition-all duration-300', cfg.color)}>
          View Post <ExternalLink size={14} />
        </span>
      </div>
    </motion.a>
  );
};

/* ═══════════════════════════════════════════════════════
   ██  MEDIA PAGE
   ═══════════════════════════════════════════════════════ */
export const Media = () => {
  const { posts } = useMediaStore();
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);

  const heroRef = useRef(null);
  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroOpacity = useTransform(heroScroll, [0, 0.6], [1, 0]);
  const heroY = useTransform(heroScroll, [0, 0.6], [0, 60]);

  const filteredPosts = activeFilter === 'All'
    ? posts
    : posts.filter(p => p.platform === activeFilter);

  return (
    <div className="relative">
      {/* ═══ PAGE HERO ═══ */}
      <section ref={heroRef} className="relative pt-40 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-google-red/[0.04] via-transparent to-transparent" />
        <ParallaxLayer speed={-0.2} className="absolute -top-20 -right-40 pointer-events-none">
          <FloatingOrb color="#E4405F" size={500} className="opacity-25" />
        </ParallaxLayer>
        <ParallaxLayer speed={0.1} className="absolute top-1/3 -left-32 pointer-events-none">
          <FloatingOrb color="#0077b5" size={350} className="opacity-20" />
        </ParallaxLayer>

        <motion.div style={{ opacity: heroOpacity, y: heroY }} className="max-w-7xl mx-auto text-center relative">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass-strong text-xs font-mono text-[#E4405F] tracking-wider uppercase mb-8 border border-[#E4405F]/10"
          >
            <Sparkles size={14} /> Media & Updates
          </motion.span>
          <WordReveal as="h1" className="text-5xl md:text-7xl lg:text-8xl font-sans font-extrabold mb-6 leading-[0.92] tracking-[-0.02em]">
            Media Hub
          </WordReveal>
          <LineReveal className="max-w-xs mx-auto mb-6" color="google-red" />
          <TextReveal className="text-lg text-text-muted font-mono max-w-2xl mx-auto" stagger={0.01}>
            Follow our journey across platforms — LinkedIn posts, Instagram highlights, YouTube talks, and more.
          </TextReveal>
        </motion.div>
      </section>

      {/* ═══ FEATURED GALLERY CAROUSEL ═══ */}
      <section className="px-6 max-w-6xl mx-auto mb-24">
        <div className="text-center mb-12">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-xs font-mono text-google-blue tracking-wider uppercase mb-6"
          >
            <Sparkles size={14} /> Featured
          </motion.span>
          <WordReveal as="h2" className="text-4xl md:text-5xl font-sans font-bold mb-4">
            Latest Highlights
          </WordReveal>
          <LineReveal className="max-w-xs mx-auto mt-2 mb-4" color="google-blue" />
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Main Gallery Swiper */}
          <div className="relative">
            <button className="media-prev absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full glass-strong flex items-center justify-center text-white hover:bg-white/[0.15] transition-all duration-300">
              <ChevronLeft size={20} />
            </button>
            <button className="media-next absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full glass-strong flex items-center justify-center text-white hover:bg-white/[0.15] transition-all duration-300">
              <ChevronRight size={20} />
            </button>

            <Swiper
              modules={[EffectCards, Autoplay, Navigation, Thumbs]}
              effect="cards"
              grabCursor
              autoplay={{
                delay: 5000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              navigation={{
                prevEl: '.media-prev',
                nextEl: '.media-next',
              }}
              thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
              className="!overflow-visible"
            >
              {posts.slice(0, 6).map((post) => {
                const cfg = PLATFORM_CONFIG[post.platform];
                const Icon = cfg.icon;
                return (
                  <SwiperSlide key={post.id}>
                    <a
                      href={post.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block group"
                    >
                      <div className="relative aspect-[4/3] rounded-3xl overflow-hidden glass-strong border border-white/[0.08]">
                        <img
                          src={post.thumbnail}
                          alt={post.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-bg-base via-bg-base/40 to-transparent" />
                        
                        {/* Platform badge */}
                        <div
                          className="absolute top-4 left-4 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.15em] font-mono backdrop-blur-md flex items-center gap-1.5 border"
                          style={{
                            background: `${cfg.rgba}0.2)`,
                            borderColor: `${cfg.rgba}0.4)`,
                          }}
                        >
                          <Icon size={12} className={cfg.color} />
                          <span className={cfg.color}>{cfg.label}</span>
                        </div>

                        {/* Play button overlay for YouTube */}
                        {post.platform === 'youtube' && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-16 h-16 rounded-full bg-[#FF0000]/90 flex items-center justify-center shadow-[0_0_40px_rgba(255,0,0,0.5)] group-hover:scale-110 transition-transform duration-300">
                              <Play size={28} fill="white" className="text-white ml-1" />
                            </div>
                          </div>
                        )}

                        {/* Content overlay */}
                        <div className="absolute bottom-0 left-0 right-0 p-6">
                          <h3 className="text-xl font-sans font-bold mb-2 group-hover:text-gradient transition-all duration-300 line-clamp-2">
                            {post.title}
                          </h3>
                          <p className="text-text-muted text-sm line-clamp-2">{post.description}</p>
                        </div>
                      </div>
                    </a>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </div>

          {/* Thumbnails Swiper */}
          <div className="hidden md:block">
            <Swiper
              modules={[Thumbs]}
              onSwiper={setThumbsSwiper}
              slidesPerView={3}
              spaceBetween={12}
              watchSlidesProgress
              direction="vertical"
              className="!h-[400px]"
            >
              {posts.slice(0, 6).map((post) => {
                const cfg = PLATFORM_CONFIG[post.platform];
                const Icon = cfg.icon;
                return (
                  <SwiperSlide key={post.id} className="!h-auto cursor-pointer">
                    <div className="flex gap-4 p-3 rounded-xl glass hover:glass-strong border border-white/[0.04] hover:border-white/[0.12] transition-all duration-300">
                      <div className="w-20 h-16 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={post.thumbnail}
                          alt={post.title}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-1">
                          <Icon size={10} className={cfg.color} />
                          <span className={cn('text-[9px] uppercase tracking-wider font-mono', cfg.color)}>
                            {cfg.label}
                          </span>
                        </div>
                        <h4 className="text-sm font-sans font-bold line-clamp-2">{post.title}</h4>
                      </div>
                    </div>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </div>
        </div>
      </section>

      {/* ═══ PLATFORM STATS ═══ */}
      <section className="px-6 max-w-5xl mx-auto mb-16">
        <StaggerChildren className="grid grid-cols-2 md:grid-cols-4 gap-4" stagger={0.08}>
          {(['linkedin', 'instagram', 'twitter', 'youtube'] as const).map((platform) => {
            const cfg = PLATFORM_CONFIG[platform];
            const count = posts.filter(p => p.platform === platform).length;
            const Icon = cfg.icon;
            return (
              <StaggerItem key={platform}>
                <button
                  onClick={() => setActiveFilter(platform)}
                  className={cn(
                    'w-full p-5 rounded-2xl glass border border-white/[0.04] hover:border-white/[0.1] transition-all duration-300 text-center group',
                    activeFilter === platform && 'glass-strong border-white/[0.15]'
                  )}
                >
                  <Icon size={24} className={cn(cfg.color, 'mx-auto mb-2 group-hover:scale-110 transition-transform')} />
                  <div className="text-2xl font-sans font-extrabold text-white">{count}</div>
                  <div className="text-[10px] font-mono text-text-muted uppercase tracking-[0.15em] mt-1">{cfg.label} Posts</div>
                </button>
              </StaggerItem>
            );
          })}
        </StaggerChildren>
      </section>

      {/* ═══ FILTER TABS ═══ */}
      <section className="px-6 max-w-7xl mx-auto mb-12">
        <div className="flex flex-wrap justify-center gap-3">
          {PLATFORMS.map((filter) => {
            const isActive = activeFilter === filter;
            const cfg = filter !== 'All' ? PLATFORM_CONFIG[filter] : null;
            const FilterIcon = cfg?.icon ?? Filter;
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
                    : 'bg-transparent text-text-muted border-white/10 hover:border-white/30 hover:bg-white/[0.03]'
                )}
              >
                <FilterIcon size={14} />
                {filter === 'All' ? 'All Platforms' : cfg?.label}
                {isActive && (
                  <motion.div
                    layoutId="mediaFilter"
                    className="absolute inset-0 bg-white rounded-full -z-10"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </section>

      {/* ═══ MEDIA GRID ═══ */}
      <section className="px-6 max-w-7xl mx-auto pb-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post, i) => (
                <MediaCard key={post.id} post={post} index={i} />
              ))
            ) : (
              <div className="col-span-full py-20 text-center glass-strong rounded-2xl border border-white/[0.03]">
                <p className="text-text-muted font-mono">No posts found for this platform yet.</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </section>

      {/* ═══ FOLLOW CTA ═══ */}
      <section className="px-6 max-w-4xl mx-auto pb-32">
        <RevealSection>
          <div className="glass-strong rounded-3xl p-12 md:p-16 text-center relative overflow-hidden border border-white/[0.06]">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#0077b5] via-[#E4405F] via-[#FF0000] to-white" />
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#E4405F]/[0.06] rounded-full blur-3xl" />
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#0077b5]/[0.06] rounded-full blur-3xl" />

            <h2 className="text-3xl md:text-5xl font-sans font-extrabold mb-4">
              Stay Connected
            </h2>
            <p className="text-text-muted font-mono max-w-lg mx-auto mb-8">
              Follow us on all platforms to never miss an update, event, or announcement from GDGoC IAR.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              {(['linkedin', 'instagram', 'twitter', 'youtube'] as const).map((platform) => {
                const cfg = PLATFORM_CONFIG[platform];
                const Icon = cfg.icon;
                return (
                  <motion.a
                    key={platform}
                    href="#"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -3 }}
                    whileTap={{ scale: 0.95 }}
                    className={cn(
                      'p-4 glass rounded-2xl transition-all duration-300 border border-white/[0.06]',
                      cfg.bgHover,
                    )}
                  >
                    <Icon size={24} className={cfg.color} />
                  </motion.a>
                );
              })}
            </div>
          </div>
        </RevealSection>
      </section>
    </div>
  );
};
