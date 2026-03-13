import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'motion/react';
import { ArrowRight, Users, Calendar, Rocket, ChevronDown, Sparkles, Globe, Zap, Code2, Trophy, Lightbulb, Heart, Star, ExternalLink, Megaphone, Play, Linkedin, Instagram, Pin } from 'lucide-react';
import { useMediaStore } from '../store/mediaStore';
import { HeroScene } from '../components/HeroScene';
import { GlowButton, GhostButton, GradientCard, FloatingOrb } from '../components/UI';
import { Link } from 'react-router-dom';
import { cn } from '../hooks/useUtils';
import {
  WordReveal,
  TextReveal,
  LineReveal,
  MagneticElement,
  RevealSection,
  ParallaxLayer,
  MouseParallax,
  StaggerChildren,
  StaggerItem,
  CountUp,
} from '../components/Animations';

/* Infinite-scroll marquee (CSS-only, no JS) */
const Marquee = ({ children, reverse = false, speed = 40 }: { children: React.ReactNode; reverse?: boolean; speed?: number }) => (
  <div className="overflow-hidden whitespace-nowrap select-none" style={{ maskImage: 'linear-gradient(to right,transparent,black 10%,black 90%,transparent)' }}>
    <div
      className="inline-flex gap-8"
      style={{
        animation: `marquee ${speed}s linear infinite`,
        animationDirection: reverse ? 'reverse' : 'normal',
      }}
    >
      {children}
      {children}
    </div>
  </div>
);

export const Home = () => {
  const { posts, announcements } = useMediaStore();
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.10], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.10], [1, 0.88]);
  const heroY = useTransform(scrollYProgress, [0, 0.10], [0, 100]);

  // Section-level 3D scroll perspective
  const statsRef = useRef(null);
  const featuresRef = useRef(null);
  const whoRef = useRef(null);
  const techRef = useRef(null);
  const ctaRef = useRef(null);

  const { scrollYProgress: statsScroll } = useScroll({ target: statsRef, offset: ['start end', 'center center'] });
  const statsRotateX = useTransform(statsScroll, [0, 1], [10, 0]);
  const statsScale = useTransform(statsScroll, [0, 1], [0.92, 1]);

  const { scrollYProgress: featuresScroll } = useScroll({ target: featuresRef, offset: ['start end', 'center center'] });
  const featuresRotateX = useTransform(featuresScroll, [0, 1], [8, 0]);

  const { scrollYProgress: whoScroll } = useScroll({ target: whoRef, offset: ['start end', 'center center'] });
  const whoRotateX = useTransform(whoScroll, [0, 1], [6, 0]);

  const { scrollYProgress: techScroll } = useScroll({ target: techRef, offset: ['start end', 'center center'] });
  const techRotateX = useTransform(techScroll, [0, 1], [6, 0]);

  const announcementsRef = useRef(null);
  const mediaRef = useRef(null);

  const { scrollYProgress: announcementsScroll } = useScroll({ target: announcementsRef, offset: ['start end', 'center center'] });
  const announcementsRotateX = useTransform(announcementsScroll, [0, 1], [6, 0]);

  const { scrollYProgress: mediaScroll } = useScroll({ target: mediaRef, offset: ['start end', 'center center'] });
  const mediaRotateX = useTransform(mediaScroll, [0, 1], [6, 0]);

  const { scrollYProgress: ctaScroll } = useScroll({ target: ctaRef, offset: ['start end', 'center center'] });
  const ctaScale = useTransform(ctaScroll, [0, 1], [0.85, 1]);

  const features = [
    {
      title: 'Workshops & Study Jams',
      desc: 'Hands-on sessions with Google Developer Experts covering Android, Web, Cloud, AI/ML, and more.',
      icon: Code2,
      link: '/events',
      color: 'blue' as const,
      glowColor: 'rgba(66,133,244,0.08)',
    },
    {
      title: 'Hackathons & Challenges',
      desc: 'Build real-world solutions in 24-48hr sprints. Compete, collaborate, and showcase your skills.',
      icon: Rocket,
      link: '/events',
      color: 'red' as const,
      glowColor: 'rgba(234,67,53,0.08)',
    },
    {
      title: 'Community & Networking',
      desc: 'Connect with 500+ developers, mentors, and industry professionals. Grow together.',
      icon: Users,
      link: '/team',
      color: 'green' as const,
      glowColor: 'rgba(52,168,83,0.08)',
    },
    {
      title: 'Open Source Projects',
      desc: 'Contribute to meaningful projects that solve real campus problems using Google technologies.',
      icon: Lightbulb,
      link: '/events',
      color: 'yellow' as const,
      glowColor: 'rgba(251,188,5,0.08)',
    },
  ];

  const colorMap: Record<string, { bg: string; text: string; shadow: string; border: string }> = {
    blue: { bg: 'bg-google-blue/10', text: 'text-google-blue', shadow: 'group-hover:shadow-[0_0_40px_rgba(66,133,244,0.2)]', border: 'border-google-blue/20' },
    red: { bg: 'bg-google-red/10', text: 'text-google-red', shadow: 'group-hover:shadow-[0_0_40px_rgba(234,67,53,0.2)]', border: 'border-google-red/20' },
    green: { bg: 'bg-google-green/10', text: 'text-google-green', shadow: 'group-hover:shadow-[0_0_40px_rgba(52,168,83,0.2)]', border: 'border-google-green/20' },
    yellow: { bg: 'bg-google-yellow/10', text: 'text-google-yellow', shadow: 'group-hover:shadow-[0_0_40px_rgba(251,188,5,0.2)]', border: 'border-google-yellow/20' },
  };

  const techStack = ['Flutter', 'Firebase', 'TensorFlow', 'Angular', 'Google Cloud', 'Android', 'Kotlin', 'Dart', 'Gemini AI', 'Chrome', 'Go', 'gRPC'];

  const highlights = [
    { icon: Trophy, label: 'Award-winning Chapter', desc: 'Recognized among top GDG chapters globally', color: 'text-google-yellow' },
    { icon: Star, label: 'Google-supported', desc: 'Official Google Developer Groups program', color: 'text-google-blue' },
    { icon: Heart, label: 'Student-run', desc: '100% student organized and community driven', color: 'text-google-red' },
    { icon: Globe, label: 'Global Network', desc: 'Part of a worldwide developer community', color: 'text-google-green' },
  ];

  return (
    <div className="relative overflow-hidden">
      {/* ===== HERO SECTION ===== */}
      <section className="relative h-screen flex flex-col items-center justify-center px-6 text-center">
        <HeroScene />

        <MouseParallax depth={34} className="max-w-6xl z-10">
        <motion.div style={{ opacity: heroOpacity, scale: heroScale, y: heroY }} className="max-w-6xl z-10">
          {/* Tag */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
            className="mb-8"
          >
            <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass-strong text-xs font-mono text-google-blue tracking-wider uppercase border border-google-blue/10">
              <Sparkles size={14} className="animate-pulse" /> Google Developer Groups on Campus
            </span>
          </motion.div>

          {/* Hero headline */}
          <div className="mb-8">
            <WordReveal
              as="h1"
              className="text-6xl md:text-8xl lg:text-[8rem] font-sans font-extrabold text-white leading-[0.92] tracking-[-0.03em]"
              delay={0.4}
            >
              Build. Learn.
            </WordReveal>
            <WordReveal
              as="h1"
              className="text-6xl md:text-8xl lg:text-[8rem] font-sans font-extrabold text-gradient leading-[0.92] tracking-[-0.03em]"
              delay={0.7}
            >
              Innovate.
            </WordReveal>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.0, ease: [0.23, 1, 0.32, 1] }}
            className="text-lg md:text-xl text-text-muted mb-12 max-w-2xl mx-auto font-mono leading-relaxed"
          >
            GDG on Campus IAR — Where students become developers,{' '}
            <span className="text-white">ideas become innovations</span>,
            and code powers the future.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.3, ease: [0.23, 1, 0.32, 1] }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <MagneticElement strength={0.2}>
              <Link to="/register">
                <GlowButton className="w-full sm:w-auto px-10 py-4 text-base">
                  <Zap size={18} /> Join Community
                </GlowButton>
              </Link>
            </MagneticElement>
            <MagneticElement strength={0.2}>
              <Link to="/events">
                <GhostButton className="w-full sm:w-auto px-10 py-4 text-base">
                  <Globe size={18} /> Explore Events
                </GhostButton>
              </Link>
            </MagneticElement>
          </motion.div>
        </motion.div>
        </MouseParallax>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-text-muted/50"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="flex flex-col items-center gap-2"
          >
            <span className="text-[10px] uppercase tracking-[0.3em] font-mono">Scroll</span>
            <ChevronDown size={20} />
          </motion.div>
        </motion.div>
      </section>

      {/* ===== TECH MARQUEE STRIP ===== */}
      <section className="relative py-6 border-y border-white/[0.04] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-google-blue/[0.02] via-google-red/[0.02] to-google-green/[0.02]" />
        <Marquee speed={35}>
          {techStack.map((tech) => (
            <span key={tech} className="text-sm font-mono text-text-muted/60 uppercase tracking-[0.15em] flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-google-blue/40" />
              {tech}
            </span>
          ))}
        </Marquee>
      </section>

      {/* ===== STATS STRIP ===== */}
      <section ref={statsRef} className="relative py-32 border-b border-white/[0.04]" style={{ perspective: '1200px' }}>
        <div className="absolute inset-0 bg-gradient-to-r from-google-blue/[0.03] via-transparent to-google-red/[0.03]" />
        <div className="absolute inset-0 grid-pattern opacity-50" />

        <motion.div style={{ rotateX: statsRotateX, scale: statsScale }}>
          <StaggerChildren className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12 relative" stagger={0.12}>
            {[
              { value: 500, label: 'Active Members', icon: Users, color: 'text-google-blue', suffix: '+' },
              { value: 25, label: 'Events Hosted', icon: Calendar, color: 'text-google-red', suffix: '+' },
              { value: 40, label: 'Projects Built', icon: Rocket, color: 'text-google-green', suffix: '+' },
              { value: 15, label: 'Tech Domains', icon: Code2, color: 'text-google-yellow', suffix: '' },
            ].map((stat) => (
              <StaggerItem key={stat.label} className="text-center group">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl glass-strong mb-5 group-hover:shadow-[0_0_40px_rgba(66,133,244,0.25)] transition-all duration-500 group-hover:scale-110">
                  <stat.icon size={26} className={stat.color} />
                </div>
                <div className="text-5xl md:text-7xl font-sans font-extrabold text-white mb-3 tracking-tight">
                  <CountUp value={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-text-muted text-xs uppercase tracking-[0.25em] font-mono">{stat.label}</div>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </motion.div>
      </section>

      {/* ===== HIGHLIGHTS STRIP ===== */}
      <section className="relative py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" stagger={0.1}>
            {highlights.map((h) => (
              <StaggerItem key={h.label}>
                <div className="group flex items-start gap-4 p-6 rounded-2xl glass hover:glass-strong transition-all duration-500 border border-white/[0.03] hover:border-white/[0.08]">
                  <div className={cn('mt-0.5', h.color)}>
                    <h.icon size={22} />
                  </div>
                  <div>
                    <div className="text-white font-sans font-bold text-sm mb-1">{h.label}</div>
                    <div className="text-text-muted text-xs font-mono leading-relaxed">{h.desc}</div>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* ===== FEATURE CARDS ===== */}
      <section ref={featuresRef} className="relative py-36 px-6 max-w-7xl mx-auto" style={{ perspective: '1200px' }}>
        <ParallaxLayer speed={-0.15} className="absolute top-20 -left-40 pointer-events-none">
          <FloatingOrb color="#4285F4" size={500} className="opacity-40" />
        </ParallaxLayer>
        <ParallaxLayer speed={0.2} className="absolute bottom-20 -right-32 pointer-events-none">
          <FloatingOrb color="#EA4335" size={400} className="opacity-30" />
        </ParallaxLayer>

        <motion.div style={{ rotateX: featuresRotateX }}>
          <div className="text-center mb-20">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-xs font-mono text-google-blue tracking-wider uppercase mb-6"
            >
              <Code2 size={14} /> What We Do
            </motion.span>
            <WordReveal as="h2" className="text-4xl md:text-6xl font-sans font-bold mb-6 leading-tight">
              Learn by Doing
            </WordReveal>
            <LineReveal className="max-w-xs mx-auto mt-2 mb-6" />
            <TextReveal className="text-text-muted font-mono max-w-xl mx-auto" stagger={0.01}>
              From beginner workshops to advanced hackathons — we cover every stage of your developer journey.
            </TextReveal>
          </div>

          <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 gap-6" stagger={0.12}>
            {features.map((feature, i) => (
              <StaggerItem key={feature.title}>
                <GradientCard glowColor={feature.glowColor} className={cn('h-full flex flex-col group', colorMap[feature.color].shadow)}>
                  <div className="flex items-start gap-5">
                    <div
                      className={cn(
                        'w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-500',
                        colorMap[feature.color].bg,
                        colorMap[feature.color].text,
                        'group-hover:scale-110 group-hover:rotate-6',
                      )}
                    >
                      <feature.icon size={26} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-sans font-bold mb-2">{feature.title}</h3>
                      <p className="text-text-muted text-sm leading-relaxed mb-4">{feature.desc}</p>
                      <Link
                        to={feature.link}
                        className={cn(
                          'inline-flex items-center gap-2 text-sm font-bold group-hover:gap-3 transition-all duration-300',
                          colorMap[feature.color].text,
                        )}
                      >
                        Explore <ArrowRight size={16} />
                      </Link>
                    </div>
                  </div>
                </GradientCard>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </motion.div>
      </section>

      {/* ===== TECH STACK SHOWCASE ===== */}
      <section ref={techRef} className="relative py-36 px-6 overflow-hidden" style={{ perspective: '1200px' }}>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-google-blue/[0.03] to-transparent" />

        <motion.div style={{ rotateX: techRotateX }}>
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-xs font-mono text-google-yellow tracking-wider uppercase mb-6"
              >
                <Sparkles size={14} /> Technologies
              </motion.span>
              <WordReveal as="h2" className="text-4xl md:text-6xl font-sans font-bold mb-6">
                Powered by Google
              </WordReveal>
              <LineReveal className="max-w-xs mx-auto mb-6" color="google-yellow" />
              <TextReveal className="text-text-muted font-mono max-w-lg mx-auto" stagger={0.01}>
                We work with the latest Google technologies and open-source tools.
              </TextReveal>
            </div>

            <StaggerChildren className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4" stagger={0.06}>
              {techStack.map((tech) => (
                <StaggerItem key={tech}>
                  <div className="group relative text-center py-6 px-4 rounded-2xl glass border border-white/[0.03] hover:border-white/[0.1] hover:glass-strong transition-all duration-500 cursor-default">
                    <div className="text-white font-sans font-bold text-sm group-hover:text-gradient transition-colors duration-300">
                      {tech}
                    </div>
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </StaggerItem>
              ))}
            </StaggerChildren>
          </div>
        </motion.div>
      </section>

      {/* ===== WHO WE ARE ===== */}
      <section ref={whoRef} className="relative py-36 px-6 overflow-hidden" style={{ perspective: '1200px' }}>
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-google-green/[0.04] to-transparent" />
        <ParallaxLayer speed={-0.3} className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <FloatingOrb color="#34A853" size={600} className="opacity-25" />
        </ParallaxLayer>

        <motion.div style={{ rotateX: whoRotateX }}>
          <RevealSection className="max-w-5xl mx-auto relative">
            <div className="grid md:grid-cols-5 gap-16 items-center">
              {/* Left: Text content - 3 cols */}
              <div className="md:col-span-3 text-center md:text-left">
                <motion.span
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-xs font-mono text-google-green tracking-wider uppercase mb-6"
                >
                  <Globe size={14} /> About Us
                </motion.span>

                <WordReveal as="h2" className="text-4xl md:text-6xl font-sans font-bold mb-8 leading-tight">
                  Who We Are
                </WordReveal>

                <LineReveal className="max-w-md mb-8 mx-auto md:mx-0" color="google-green" />

                <TextReveal className="text-lg text-text-muted mb-10 leading-relaxed" stagger={0.008}>
                  We are a student-run community at IAR, dedicated to helping developers grow their skills and connect with like-minded individuals. Supported by Google Developers, we bring the best of technology to our campus through workshops, hackathons, and collaborative projects.
                </TextReveal>

                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                  <MagneticElement strength={0.15}>
                    <Link to="/team">
                      <GlowButton variant="secondary" className="px-8 py-4">
                        Meet the Team <ArrowRight size={18} />
                      </GlowButton>
                    </Link>
                  </MagneticElement>
                  <MagneticElement strength={0.15}>
                    <Link to="/events">
                      <GhostButton className="px-8 py-4">
                        See Events <ExternalLink size={16} />
                      </GhostButton>
                    </Link>
                  </MagneticElement>
                </div>
              </div>

              {/* Right: Visual element - 2 cols */}
              <div className="md:col-span-2 flex flex-col gap-4">
                {[
                  { num: '01', title: 'Workshops', desc: 'Weekly hands-on sessions', color: 'border-google-blue/30' },
                  { num: '02', title: 'Hackathons', desc: 'Quarterly build challenges', color: 'border-google-red/30' },
                  { num: '03', title: 'Mentorship', desc: 'One-on-one guidance', color: 'border-google-green/30' },
                  { num: '04', title: 'Community', desc: 'Events & networking', color: 'border-google-yellow/30' },
                ].map((item, i) => (
                  <motion.div
                    key={item.num}
                    initial={{ opacity: 0, x: 40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
                    className={cn('flex items-center gap-4 p-4 rounded-xl glass border-l-2 hover:glass-strong transition-all duration-500', item.color)}
                  >
                    <span className="text-2xl font-sans font-extrabold text-white/10">{item.num}</span>
                    <div>
                      <div className="text-white font-sans font-bold text-sm">{item.title}</div>
                      <div className="text-text-muted text-xs font-mono">{item.desc}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </RevealSection>
        </motion.div>
      </section>

      {/* ===== ANNOUNCEMENTS ===== */}
      <section ref={announcementsRef} className="relative py-36 px-6 overflow-hidden" style={{ perspective: '1200px' }}>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-google-yellow/[0.03] to-transparent" />
        <ParallaxLayer speed={-0.15} className="absolute top-20 -right-40 pointer-events-none">
          <FloatingOrb color="#FBBC05" size={400} className="opacity-25" />
        </ParallaxLayer>

        <motion.div style={{ rotateX: announcementsRotateX }}>
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-xs font-mono text-google-yellow tracking-wider uppercase mb-6"
              >
                <Megaphone size={14} /> Latest Updates
              </motion.span>
              <WordReveal as="h2" className="text-4xl md:text-6xl font-sans font-bold mb-6">
                Announcements
              </WordReveal>
              <LineReveal className="max-w-xs mx-auto mb-6" color="google-yellow" />
              <TextReveal className="text-text-muted font-mono max-w-xl mx-auto" stagger={0.01}>
                Stay up to date with the latest from GDGoC IAR.
              </TextReveal>
            </div>

            <div className="space-y-4">
              {announcements.slice(0, 4).map((ann, i) => {
                const typeConfig: Record<string, { color: string; bg: string; label: string }> = {
                  event:       { color: 'text-google-blue',   bg: 'bg-google-blue/10',   label: 'Event' },
                  update:      { color: 'text-google-green',  bg: 'bg-google-green/10',  label: 'Update' },
                  achievement: { color: 'text-google-yellow', bg: 'bg-google-yellow/10', label: 'Achievement' },
                  general:     { color: 'text-text-muted',    bg: 'bg-white/5',          label: 'General' },
                };
                const tc = typeConfig[ann.type] ?? typeConfig.general;
                return (
                  <motion.div
                    key={ann.id}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                  >
                    {ann.link ? (
                      <Link
                        to={ann.link}
                        className="group flex items-start gap-5 p-6 rounded-2xl glass border border-white/[0.04] hover:border-white/[0.1] hover:glass-strong transition-all duration-500 hover:-translate-y-0.5"
                      >
                        <div className="flex flex-col items-start gap-3 flex-1">
                          <div className="flex items-center gap-3 flex-wrap">
                            {ann.pinned && (
                              <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.15em] font-mono text-google-red">
                                <Pin size={10} /> Pinned
                              </span>
                            )}
                            <span className={cn('px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-[0.15em] font-mono', tc.color, tc.bg)}>
                              {tc.label}
                            </span>
                            <span className="text-[10px] font-mono text-text-muted/60">
                              {new Date(ann.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </span>
                          </div>
                          <h3 className="text-lg font-sans font-bold group-hover:text-gradient transition-all duration-300">{ann.title}</h3>
                          <p className="text-text-muted text-sm leading-relaxed">{ann.description}</p>
                        </div>
                        <ArrowRight size={18} className="text-text-muted group-hover:text-white transition-colors mt-6 shrink-0 group-hover:translate-x-1 transition-transform duration-300" />
                      </Link>
                    ) : (
                      <div className="flex items-start gap-5 p-6 rounded-2xl glass border border-white/[0.04] transition-all duration-500">
                        <div className="flex flex-col items-start gap-3 flex-1">
                          <div className="flex items-center gap-3 flex-wrap">
                            {ann.pinned && (
                              <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.15em] font-mono text-google-red">
                                <Pin size={10} /> Pinned
                              </span>
                            )}
                            <span className={cn('px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-[0.15em] font-mono', tc.color, tc.bg)}>
                              {tc.label}
                            </span>
                            <span className="text-[10px] font-mono text-text-muted/60">
                              {new Date(ann.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </span>
                          </div>
                          <h3 className="text-lg font-sans font-bold">{ann.title}</h3>
                          <p className="text-text-muted text-sm leading-relaxed">{ann.description}</p>
                        </div>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </section>

      {/* ===== MEDIA GLIMPSE ===== */}
      <section ref={mediaRef} className="relative py-36 px-6 overflow-hidden" style={{ perspective: '1200px' }}>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-google-red/[0.03] to-transparent" />
        <ParallaxLayer speed={0.15} className="absolute bottom-20 -left-32 pointer-events-none">
          <FloatingOrb color="#E4405F" size={350} className="opacity-20" />
        </ParallaxLayer>

        <motion.div style={{ rotateX: mediaRotateX }}>
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-xs font-mono text-google-red tracking-wider uppercase mb-6"
              >
                <Play size={14} /> From Our Socials
              </motion.span>
              <WordReveal as="h2" className="text-4xl md:text-6xl font-sans font-bold mb-6">
                Media Highlights
              </WordReveal>
              <LineReveal className="max-w-xs mx-auto mb-6" color="google-red" />
              <TextReveal className="text-text-muted font-mono max-w-xl mx-auto" stagger={0.01}>
                A glimpse of our latest posts across LinkedIn, Instagram, YouTube & more.
              </TextReveal>
            </div>

            <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12" stagger={0.1}>
              {posts.slice(0, 3).map((post) => {
                const cfg = { linkedin: { icon: Linkedin, color: 'text-[#0077b5]', rgba: 'rgba(0,119,181,' }, instagram: { icon: Instagram, color: 'text-[#E4405F]', rgba: 'rgba(228,64,95,' }, twitter: { icon: Globe, color: 'text-white', rgba: 'rgba(255,255,255,' }, youtube: { icon: Play, color: 'text-[#FF0000]', rgba: 'rgba(255,0,0,' } }[post.platform]!;
                const Icon = cfg.icon;
                return (
                  <StaggerItem key={post.id}>
                    <a
                      href={post.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group block glass-strong rounded-2xl overflow-hidden border border-white/[0.04] hover:border-white/[0.12] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
                    >
                      <div className="relative h-48 overflow-hidden">
                        <img src={post.thumbnail} alt={post.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" referrerPolicy="no-referrer" />
                        <div className="absolute inset-0 bg-gradient-to-t from-bg-base via-bg-base/30 to-transparent" />
                        <div
                          className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-[0.15em] font-mono backdrop-blur-md flex items-center gap-1 border"
                          style={{ background: `${cfg.rgba}0.15)`, borderColor: `${cfg.rgba}0.3)` }}
                        >
                          <Icon size={10} className={cfg.color} />
                          <span className={cfg.color}>{post.platform}</span>
                        </div>
                      </div>
                      <div className="p-5">
                        <h3 className="font-sans font-bold text-sm mb-1 group-hover:text-gradient transition-all duration-300 line-clamp-2">{post.title}</h3>
                        <p className="text-text-muted text-xs leading-relaxed line-clamp-2">{post.description}</p>
                      </div>
                    </a>
                  </StaggerItem>
                );
              })}
            </StaggerChildren>

            <div className="text-center">
              <MagneticElement strength={0.15}>
                <Link to="/media">
                  <GlowButton variant="secondary" className="px-8 py-4">
                    View All Media <ArrowRight size={18} />
                  </GlowButton>
                </Link>
              </MagneticElement>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section ref={ctaRef} className="relative py-40 px-6 overflow-hidden" style={{ perspective: '1200px' }}>
        <div className="absolute inset-0 bg-gradient-to-t from-google-blue/[0.06] via-transparent to-transparent" />
        <ParallaxLayer speed={-0.2} className="absolute bottom-0 left-1/4 pointer-events-none">
          <FloatingOrb color="#4285F4" size={400} className="opacity-30" />
        </ParallaxLayer>
        <ParallaxLayer speed={0.15} className="absolute top-10 right-1/4 pointer-events-none">
          <FloatingOrb color="#FBBC05" size={300} className="opacity-20" />
        </ParallaxLayer>

        <motion.div style={{ scale: ctaScale }}>
          <div className="max-w-4xl mx-auto text-center relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
              className="p-12 md:p-20 rounded-3xl glass-strong border border-white/[0.06]"
            >
              <WordReveal as="h2" className="text-4xl md:text-6xl font-sans font-bold mb-6 leading-tight">
                Ready to Start?
              </WordReveal>
              <TextReveal className="text-lg text-text-muted mb-10 max-w-lg mx-auto" stagger={0.01}>
                Join 500+ developers who are already building the future. No experience required.
              </TextReveal>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <MagneticElement strength={0.2}>
                  <Link to="/register">
                    <GlowButton className="px-10 py-4 text-lg">
                      <Zap size={20} /> Get Started Now
                    </GlowButton>
                  </Link>
                </MagneticElement>
              </div>

              <div className="mt-10 flex items-center justify-center gap-6 text-text-muted/50 text-xs font-mono">
                <span className="flex items-center gap-1.5"><Heart size={12} /> Free Forever</span>
                <span className="w-1 h-1 rounded-full bg-white/20" />
                <span className="flex items-center gap-1.5"><Users size={12} /> Open to All</span>
                <span className="w-1 h-1 rounded-full bg-white/20" />
                <span className="flex items-center gap-1.5"><Star size={12} /> Google Backed</span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>
    </div>
  );
};
