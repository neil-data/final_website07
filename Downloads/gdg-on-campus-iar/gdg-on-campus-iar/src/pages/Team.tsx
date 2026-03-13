import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { Linkedin, Mail, Github, ChevronLeft, ChevronRight, Users, Crown, ArrowRight, Sparkles } from 'lucide-react';
import { type TeamMember } from '../mock/team';
import { useTeamStore } from '../store/teamStore';
import { GradientCard, FloatingOrb } from '../components/UI';
import { cn } from '../hooks/useUtils';
import { WordReveal, LineReveal, TextReveal, RevealSection, ParallaxLayer, MouseParallax } from '../components/Animations';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Navigation, Pagination, Autoplay, Keyboard, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

/* ── Color helpers (safe for Tailwind purge) ───────── */
const COLOR_MAP: Record<string, { bg: string; text: string; border: string; rgba: string }> = {
  'google-blue':   { bg: 'bg-google-blue',   text: 'text-google-blue',   border: 'border-google-blue/30', rgba: 'rgba(66,133,244,' },
  'google-red':    { bg: 'bg-google-red',     text: 'text-google-red',    border: 'border-google-red/30',  rgba: 'rgba(234,67,53,' },
  'google-green':  { bg: 'bg-google-green',   text: 'text-google-green',  border: 'border-google-green/30', rgba: 'rgba(52,168,83,' },
  'google-yellow': { bg: 'bg-google-yellow',  text: 'text-google-yellow', border: 'border-google-yellow/30', rgba: 'rgba(251,188,5,' },
};

const SUB_TEAM_META: Record<string, { description: string; color: string }> = {
  Technical:     { description: 'Building amazing things with code',                 color: 'google-blue' },
  Documentation: { description: 'Making knowledge accessible & well-documented',     color: 'google-red' },
  Marketing:     { description: 'Spreading the word & growing our community',        color: 'google-green' },
  Outreach:      { description: 'Building bridges with the wider tech ecosystem',    color: 'google-yellow' },
  Operations:    { description: 'Keeping everything running like clockwork',         color: 'google-blue' },
};

const subTeamNames = Object.keys(SUB_TEAM_META);

/* ═══════════════════════════════════════════════════════
   ██  Member Card (photo-centric, LDCE-style)
   ═══════════════════════════════════════════════════════ */
const MemberCard = ({ member, index, color }: { member: TeamMember; index: number; color: string }) => {
  const c = COLOR_MAP[color] ?? COLOR_MAP['google-blue'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
      className="snap-start shrink-0 w-[260px] sm:w-[280px] md:w-[300px]"
    >
      <div className="glass-strong rounded-2xl overflow-hidden group hover:shadow-[0_20px_60px_rgba(0,0,0,0.5)] transition-all duration-500 hover:-translate-y-2 border border-white/[0.04] hover:border-white/[0.12] relative">
        {/* LEAD badge */}
        {member.isLead && (
          <div
            className="absolute top-4 right-4 z-10 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] font-mono backdrop-blur-sm flex items-center gap-1.5 border"
            style={{
              background: `${c.rgba}0.15)`,
              color: `${c.rgba}1)`,
              borderColor: `${c.rgba}0.3)`,
            }}
          >
            <Crown size={12} /> Lead
          </div>
        )}

        {/* Large photo */}
        <div className="relative h-72 overflow-hidden">
          <img
            src={member.avatar}
            alt={member.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg-base via-bg-base/40 to-transparent" />
          <div className="absolute top-0 left-0 right-0 h-1" style={{ background: `${c.rgba}0.8)` }} />
        </div>

        {/* Info */}
        <div className="p-5 -mt-8 relative z-10">
          <h3 className="text-lg font-sans font-bold uppercase tracking-wide mb-1 group-hover:text-gradient transition-all duration-300">
            {member.name}
          </h3>
          <p className="text-xs font-mono uppercase tracking-[0.15em] mb-4" style={{ color: `${c.rgba}1)` }}>
            {member.role}
          </p>
          <div className="flex gap-2">
            {member.socials.linkedin && (
              <a href={member.socials.linkedin} target="_blank" rel="noopener noreferrer"
                className="p-2 glass rounded-lg hover:text-[#0077b5] hover:bg-[#0077b5]/10 transition-all duration-300 text-text-muted">
                <Linkedin size={16} />
              </a>
            )}
            {member.socials.gmail && (
              <a href={member.socials.gmail}
                className="p-2 glass rounded-lg hover:text-google-red hover:bg-google-red/10 transition-all duration-300 text-text-muted">
                <Mail size={16} />
              </a>
            )}
            {member.socials.github && (
              <a href={member.socials.github} target="_blank" rel="noopener noreferrer"
                className="p-2 glass rounded-lg hover:text-white hover:bg-white/10 transition-all duration-300 text-text-muted">
                <Github size={16} />
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

/* ═══════════════════════════════════════════════════════
   ██  Horizontal carousel with nav arrows
   ═══════════════════════════════════════════════════════ */
const TeamCarousel = ({ members, color, carouselId }: { members: TeamMember[]; color: string; carouselId: string }) => {
  const prevClass = `team-prev-${carouselId}`;
  const nextClass = `team-next-${carouselId}`;
  const paginationClass = `team-pagination-${carouselId}`;

  return (
    <div className="relative group/carousel">
      {/* Left arrow */}
      <button
        className={cn(
          prevClass,
          'absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-20 w-10 h-10 rounded-full glass-strong flex items-center justify-center text-white opacity-0 group-hover/carousel:opacity-100 transition-all duration-300 hover:bg-white/10 hover:scale-110'
        )}
        aria-label="Scroll left"
      >
        <ChevronLeft size={20} />
      </button>

      <Swiper
        modules={[EffectCoverflow, Navigation, Pagination, Autoplay, Keyboard, A11y]}
        effect="coverflow"
        grabCursor
        centeredSlides
        keyboard={{ enabled: true }}
        speed={900}
        loop={members.length > 3}
        autoplay={{
          delay: 3200,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        coverflowEffect={{
          rotate: 0,
          stretch: 0,
          depth: 120,
          modifier: 2,
          slideShadows: false,
        }}
        navigation={{
          prevEl: `.${prevClass}`,
          nextEl: `.${nextClass}`,
        }}
        pagination={{
          el: `.${paginationClass}`,
          clickable: true,
          dynamicBullets: true,
        }}
        breakpoints={{
          0: { slidesPerView: 1.08, spaceBetween: 14 },
          640: { slidesPerView: 1.4, spaceBetween: 18 },
          1024: { slidesPerView: 2.2, spaceBetween: 24 },
          1280: { slidesPerView: 2.6, spaceBetween: 26 },
        }}
        className="!px-2 !pb-10"
      >
        {members.map((member, i) => (
          <SwiperSlide key={member.id}>
            <MemberCard member={member} index={i} color={color} />
          </SwiperSlide>
        ))}
      </Swiper>

      <div className={cn(paginationClass, 'mt-2')} />

      {/* Right arrow */}
      <button
        className={cn(
          nextClass,
          'absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-20 w-10 h-10 rounded-full glass-strong flex items-center justify-center text-white opacity-0 group-hover/carousel:opacity-100 transition-all duration-300 hover:bg-white/10 hover:scale-110'
        )}
        aria-label="Scroll right"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════
   ██  Sub-team section (heading + description + carousel)
   ═══════════════════════════════════════════════════════ */
const SubTeamSection = ({ teamName, members }: { teamName: string; members: TeamMember[] }) => {
  const meta = SUB_TEAM_META[teamName];
  const c = COLOR_MAP[meta?.color ?? 'google-blue'];
  if (!meta || members.length === 0) return null;

  // Put lead first
  const lead = members.find(m => m.isLead);
  const sorted = lead ? [lead, ...members.filter(m => !m.isLead)] : members;
  const carouselId = teamName.toLowerCase().replace(/\s+/g, '-');

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6 }}
      className="mb-20"
    >
      <div className="flex items-center gap-4 mb-2">
        <div className="w-3 h-3 rounded-full" style={{ background: `${c.rgba}1)` }} />
        <h3 className="text-2xl md:text-3xl font-sans font-bold">{teamName} Team</h3>
        <span className="text-xs font-mono text-text-muted ml-2">({members.length} members)</span>
      </div>
      <p className="text-text-muted font-mono text-sm mb-8 ml-7">{meta.description}</p>
      <TeamCarousel members={sorted} color={meta.color} carouselId={carouselId} />
    </motion.div>
  );
};

/* ═══════════════════════════════════════════════════════
   ██  TEAM PAGE
   ═══════════════════════════════════════════════════════ */
export const Team = () => {
  const { members, leads } = useTeamStore();
  const [activeFilter, setActiveFilter] = useState('All');
  const filters = ['All', ...subTeamNames];

  const heroRef = useRef(null);
  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroOpacity = useTransform(heroScroll, [0, 0.6], [1, 0]);
  const heroY = useTransform(heroScroll, [0, 0.6], [0, 60]);

  const visibleTeams = activeFilter === 'All' ? subTeamNames : [activeFilter];

  return (
    <div className="relative">
      {/* ═══ PAGE HERO ═══ */}
      <section ref={heroRef} className="relative pt-40 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-google-blue/[0.04] via-transparent to-transparent" />
        <ParallaxLayer speed={-0.2} className="absolute -top-20 -right-40 pointer-events-none">
          <FloatingOrb color="#4285F4" size={500} className="opacity-30" />
        </ParallaxLayer>
        <ParallaxLayer speed={0.1} className="absolute top-1/3 -left-32 pointer-events-none">
          <FloatingOrb color="#EA4335" size={350} className="opacity-20" />
        </ParallaxLayer>

        <MouseParallax depth={28} className="max-w-7xl mx-auto text-center relative">
        <motion.div style={{ opacity: heroOpacity, y: heroY }} className="max-w-7xl mx-auto text-center relative">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass-strong text-xs font-mono text-google-blue tracking-wider uppercase mb-8 border border-google-blue/10"
          >
            <Users size={14} /> Our People
          </motion.span>
          <WordReveal as="h1" className="text-5xl md:text-7xl lg:text-8xl font-sans font-extrabold mb-6 leading-[0.92] tracking-[-0.02em]">
            Meet the Team
          </WordReveal>
          <LineReveal className="max-w-xs mx-auto mb-6" />
          <TextReveal className="text-lg text-text-muted font-mono max-w-2xl mx-auto" stagger={0.01}>
            The amazing people who make GDG on Campus IAR possible.
          </TextReveal>
        </motion.div>
        </MouseParallax>
      </section>

      {/* ═══ CAMPUS LEADS HERO ═══ */}
      <section className="px-6 max-w-6xl mx-auto mb-28">
        <RevealSection>
          <div className="text-center mb-12">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-xs font-mono text-google-yellow tracking-wider uppercase mb-6"
            >
              <Crown size={14} /> Leadership
            </motion.span>
            <WordReveal as="h2" className="text-3xl md:text-5xl font-sans font-bold mb-2">
              Campus Leads
            </WordReveal>
            <LineReveal className="max-w-xs mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {leads.map((lead, i) => {
              const accentColor = i === 0 ? 'google-blue' : 'google-green';
              const accentRgba = i === 0 ? 'rgba(66,133,244,' : 'rgba(52,168,83,';
              return (
                <GradientCard
                  key={lead.id}
                  glowColor={`${accentRgba}0.12)`}
                  className="!p-0 overflow-hidden group"
                >
                  {/* Color bar */}
                  <div className="h-1 w-full" style={{ background: `${accentRgba}0.8)` }} />

                  {/* Large photo */}
                  <div className="relative h-72 overflow-hidden">
                    <img
                      src={lead.avatar}
                      alt={lead.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-bg-card via-bg-card/50 to-transparent" />
                  </div>

                  {/* Info */}
                  <div className="p-8 -mt-16 relative z-10">
                    <span
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] font-mono backdrop-blur-sm border mb-4"
                      style={{
                        background: `${accentRgba}0.15)`,
                        color: `${accentRgba}1)`,
                        borderColor: `${accentRgba}0.3)`,
                      }}
                    >
                      <Crown size={12} /> Campus Lead
                    </span>
                    <h3 className="text-2xl md:text-3xl font-sans font-extrabold mb-1 group-hover:text-gradient transition-all duration-300">
                      {lead.name}
                    </h3>
                    <p className="text-xs font-mono uppercase tracking-[0.15em] mb-4" style={{ color: `${accentRgba}1)` }}>
                      {lead.role}
                    </p>
                    <p className="text-text-muted text-sm leading-relaxed mb-6">
                      {lead.bio}
                    </p>
                    <div className="flex gap-2">
                      {lead.socials.linkedin && (
                        <a href={lead.socials.linkedin} target="_blank" rel="noopener noreferrer"
                          className="p-2.5 glass rounded-xl hover:text-[#0077b5] hover:bg-[#0077b5]/10 transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,119,181,0.25)]">
                          <Linkedin size={18} />
                        </a>
                      )}
                      {lead.socials.gmail && (
                        <a href={lead.socials.gmail}
                          className="p-2.5 glass rounded-xl hover:text-google-red hover:bg-google-red/10 transition-all duration-300 hover:shadow-[0_0_20px_rgba(234,67,53,0.25)]">
                          <Mail size={18} />
                        </a>
                      )}
                      {lead.socials.github && (
                        <a href={lead.socials.github} target="_blank" rel="noopener noreferrer"
                          className="p-2.5 glass rounded-xl hover:text-white hover:bg-white/10 transition-all duration-300 hover:shadow-[0_0_15px_rgba(255,255,255,0.15)]">
                          <Github size={18} />
                        </a>
                      )}
                    </div>
                  </div>
                </GradientCard>
              );
            })}
          </div>
        </RevealSection>
      </section>

      {/* ═══ TEAM FILTER TABS ═══ */}
      <section className="px-6 max-w-7xl mx-auto mb-16">
        <RevealSection>
          <div className="text-center mb-10">
            <WordReveal as="h2" className="text-3xl md:text-5xl font-sans font-bold mb-3">
              Our Teams
            </WordReveal>
            <LineReveal className="max-w-xs mx-auto" color="google-red" />
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            {filters.map((filter) => {
              const isActive = activeFilter === filter;
              return (
                <motion.button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={cn(
                    'px-6 py-2.5 rounded-full font-mono text-sm transition-all duration-300 border relative overflow-hidden',
                    isActive
                      ? 'bg-white text-bg-base border-white shadow-[0_0_25px_rgba(255,255,255,0.2)] font-bold'
                      : 'bg-transparent text-text-muted border-white/10 hover:border-white/30 hover:bg-white/[0.03]'
                  )}
                >
                  {filter === 'All' ? 'All Teams' : `${filter}`}
                  {isActive && (
                    <motion.div
                      layoutId="teamFilter"
                      className="absolute inset-0 bg-white rounded-full -z-10"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </motion.button>
              );
            })}
          </div>
        </RevealSection>
      </section>

      {/* ═══ TEAM SECTIONS ═══ */}
      <section className="px-6 max-w-7xl mx-auto pb-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
          >
            {visibleTeams.map((teamName) => (
              <SubTeamSection
                key={teamName}
                teamName={teamName}
                members={members.filter(m => m.subTeam === teamName)}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      </section>

      {/* ═══ JOIN CTA ═══ */}
      <section className="px-6 max-w-4xl mx-auto pb-32">
        <RevealSection>
          <div className="glass-strong rounded-3xl p-12 md:p-16 text-center relative overflow-hidden border border-white/[0.06]">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-google-blue via-google-red via-google-yellow to-google-green" />
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-google-blue/[0.06] rounded-full blur-3xl" />
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-google-green/[0.06] rounded-full blur-3xl" />

            <Sparkles size={32} className="text-google-yellow mx-auto mb-6 opacity-60" />
            <h2 className="text-3xl md:text-5xl font-sans font-extrabold mb-4">
              Want to join our team?
            </h2>
            <p className="text-text-muted font-mono max-w-lg mx-auto mb-8">
              We're always looking for passionate individuals to join GDG on Campus IAR.
              If you're ready to learn, build, and grow with us — let's connect!
            </p>
            <motion.a
              href="mailto:gdg@example.com"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-google-blue to-blue-500 text-white font-sans font-semibold shadow-[0_0_25px_rgba(66,133,244,0.4)] hover:shadow-[0_0_40px_rgba(66,133,244,0.6)] transition-shadow duration-300"
            >
              Get in Touch <ArrowRight size={18} />
            </motion.a>
          </div>
        </RevealSection>
      </section>
    </div>
  );
};
