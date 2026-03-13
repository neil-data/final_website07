import React, { useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Calendar, MapPin, Tag, CheckCircle2, ChevronRight, Laptop, Wrench, PartyPopper, Mic2, Cloud, Sparkles, ArrowRight, Clock, Users, ChevronLeft } from 'lucide-react';
import { useEventsStore } from '../store/eventsStore';
import { Badge, GlowButton, GradientCard, FloatingOrb } from '../components/UI';
import { cn } from '../hooks/useUtils';
import { WordReveal, LineReveal, TextReveal, RevealSection, StaggerChildren, StaggerItem, ParallaxLayer, MagneticElement, CountUp, MouseParallax } from '../components/Animations';

// Swiper imports
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Autoplay, Navigation, Pagination, Keyboard, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const EventIcon = ({ type }: { type: string }) => {
  switch (type) {
    case 'Hackathon': return <Laptop size={20} />;
    case 'Workshop': return <Wrench size={20} />;
    case 'DevFest': return <PartyPopper size={20} />;
    case 'Speaker': return <Mic2 size={20} />;
    case 'Study Jam': return <Cloud size={20} />;
    default: return <Calendar size={20} />;
  }
};

const eventColorMap: Record<string, string> = {
  Hackathon: 'text-google-red',
  Workshop: 'text-google-blue',
  DevFest: 'text-google-yellow',
  Speaker: 'text-google-green',
  'Study Jam': 'text-google-blue',
};

export const Events = () => {
  const { events, registerForEvent } = useEventsStore();
  const [filter, setFilter] = useState('All');
  const [registeredEvents, setRegisteredEvents] = useState<string[]>([]);

  const heroRef = useRef(null);
  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroOpacity = useTransform(heroScroll, [0, 0.6], [1, 0]);
  const heroY = useTransform(heroScroll, [0, 0.6], [0, 60]);

  const filteredEvents = filter === 'All' 
    ? events 
    : events.filter(e => e.type === filter);

  const handleRegister = (id: string) => {
    if (registeredEvents.includes(id)) return;
    registerForEvent(id);
    setRegisteredEvents([...registeredEvents, id]);
  };

  const eventTypes = ['All', 'Hackathon', 'Workshop', 'DevFest', 'Speaker', 'Study Jam'];

  const completedCount = events.filter(e => e.status === 'Completed').length;
  const upcomingCount = events.filter(e => e.status !== 'Completed').length;

  return (
    <div className="relative">
      {/* ===== PAGE HERO ===== */}
      <section ref={heroRef} className="relative pt-40 pb-24 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-google-yellow/[0.04] via-transparent to-transparent" />
        <ParallaxLayer speed={-0.2} className="absolute -top-20 -right-40 pointer-events-none">
          <FloatingOrb color="#FBBC05" size={500} className="opacity-30" />
        </ParallaxLayer>
        <ParallaxLayer speed={0.1} className="absolute top-1/2 -left-32 pointer-events-none">
          <FloatingOrb color="#4285F4" size={350} className="opacity-20" />
        </ParallaxLayer>

        <MouseParallax depth={26} className="max-w-7xl mx-auto text-center relative">
        <motion.div style={{ opacity: heroOpacity, y: heroY }} className="max-w-7xl mx-auto text-center relative">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass-strong text-xs font-mono text-google-yellow tracking-wider uppercase mb-8 border border-google-yellow/10"
          >
            <Calendar size={14} /> Events & Workshops
          </motion.span>
          <WordReveal as="h1" className="text-5xl md:text-7xl lg:text-8xl font-sans font-extrabold mb-6 leading-[0.92] tracking-[-0.02em]">
            Our Events
          </WordReveal>
          <LineReveal className="max-w-xs mx-auto mb-6" color="google-yellow" />
          <TextReveal className="text-lg text-text-muted font-mono max-w-xl mx-auto mb-12" stagger={0.01}>
            From hackathons to study jams — explore every experience we craft for developers.
          </TextReveal>

          {/* Mini stats */}
          <div className="flex items-center justify-center gap-8 text-center">
            {[
              { value: events.length, label: 'Total Events', color: 'text-google-yellow' },
              { value: completedCount, label: 'Completed', color: 'text-google-green' },
              { value: upcomingCount, label: 'Upcoming', color: 'text-google-blue' },
            ].map((s) => (
              <div key={s.label}>
                <div className={cn('text-3xl md:text-4xl font-sans font-extrabold', s.color)}>
                  <CountUp value={s.value} />
                </div>
                <div className="text-[10px] uppercase tracking-[0.2em] font-mono text-text-muted mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
        </MouseParallax>
      </section>

      {/* ===== FEATURED EVENTS CAROUSEL ===== */}
      <section className="px-6 max-w-7xl mx-auto mb-36">
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
            Upcoming Highlights
          </WordReveal>
          <LineReveal className="max-w-xs mx-auto mt-2 mb-4" color="google-blue" />
        </div>

        <div className="relative">
          {/* Custom Navigation Buttons */}
          <button className="events-prev absolute left-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full glass-strong flex items-center justify-center text-white hover:bg-white/[0.1] transition-all duration-300 -translate-x-2 md:-translate-x-6">
            <ChevronLeft size={24} />
          </button>
          <button className="events-next absolute right-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full glass-strong flex items-center justify-center text-white hover:bg-white/[0.1] transition-all duration-300 translate-x-2 md:translate-x-6">
            <ChevronRight size={24} />
          </button>

          <Swiper
            modules={[EffectCoverflow, Autoplay, Navigation, Pagination, Keyboard, A11y]}
            effect="coverflow"
            grabCursor
            centeredSlides
            speed={900}
            keyboard={{ enabled: true }}
            slidesPerView={1.1}
            coverflowEffect={{
              rotate: 12,
              stretch: 0,
              depth: 200,
              modifier: 1.2,
              slideShadows: false,
            }}
            autoplay={{
              delay: 3200,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            navigation={{
              prevEl: '.events-prev',
              nextEl: '.events-next',
            }}
            pagination={{
              clickable: true,
              dynamicBullets: true,
            }}
            breakpoints={{
              0: { slidesPerView: 1.08, spaceBetween: 14 },
              640: { slidesPerView: 1.25, spaceBetween: 18 },
              1024: { slidesPerView: 1.7, spaceBetween: 24 },
              1280: { slidesPerView: 2.1, spaceBetween: 28 },
            }}
            loop={events.filter(e => e.status !== 'Completed').length > 2}
            className="!py-12 !px-4"
          >
            {events.filter(e => e.status !== 'Completed').map((event) => (
              <SwiperSlide key={event.id}>
                <div className="relative group">
                  {/* Glow effect background */}
                  <div className={cn(
                    'absolute inset-0 rounded-3xl blur-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-500',
                    event.type === 'Hackathon' ? 'bg-google-red' :
                    event.type === 'Workshop' ? 'bg-google-blue' :
                    event.type === 'DevFest' ? 'bg-google-yellow' :
                    'bg-google-green'
                  )} />

                  <GradientCard className="relative h-[320px] flex flex-col p-8 overflow-hidden">
                    {/* Top accent bar */}
                    <div className={cn('absolute top-0 left-0 right-0 h-1.5',
                      event.type === 'Hackathon' ? 'bg-gradient-to-r from-google-red via-google-red/50 to-transparent' :
                      event.type === 'Workshop' ? 'bg-gradient-to-r from-google-blue via-google-blue/50 to-transparent' :
                      event.type === 'DevFest' ? 'bg-gradient-to-r from-google-yellow via-google-yellow/50 to-transparent' :
                      'bg-gradient-to-r from-google-green via-google-green/50 to-transparent'
                    )} />

                    <div className="flex items-start justify-between mb-6">
                      <div className={cn('p-4 glass-strong rounded-2xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-6', eventColorMap[event.type] || 'text-google-blue')}>
                        <EventIcon type={event.type} />
                      </div>
                      <Badge color="blue">{event.type}</Badge>
                    </div>

                    <h3 className="text-2xl font-sans font-bold mb-3 group-hover:text-gradient transition-all duration-300 line-clamp-2">
                      {event.name}
                    </h3>

                    <p className="text-text-muted text-sm mb-6 flex-grow line-clamp-2 leading-relaxed">
                      {event.description}
                    </p>

                    <div className="flex items-center justify-between text-xs text-text-muted font-mono">
                      <span className="flex items-center gap-1.5">
                        <Calendar size={14} className="text-google-yellow" /> {event.date}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Users size={14} className="text-google-blue" /> {event.registeredCount}+
                      </span>
                    </div>

                    {/* Decorative corner */}
                    <div className="absolute bottom-0 right-0 w-24 h-24 opacity-10">
                      <div className={cn(
                        'w-full h-full rounded-tl-full',
                        event.type === 'Hackathon' ? 'bg-google-red' :
                        event.type === 'Workshop' ? 'bg-google-blue' :
                        event.type === 'DevFest' ? 'bg-google-yellow' :
                        'bg-google-green'
                      )} />
                    </div>
                  </GradientCard>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* ===== ROADMAP ===== */}
      <section className="px-6 max-w-7xl mx-auto mb-36">
        <div className="text-center mb-20">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-xs font-mono text-google-yellow tracking-wider uppercase mb-6"
          >
            <Sparkles size={14} /> Timeline
          </motion.span>
          <WordReveal as="h2" className="text-4xl md:text-6xl font-sans font-bold mb-4">
            Event Roadmap
          </WordReveal>
          <LineReveal className="max-w-xs mx-auto mt-2 mb-4" color="google-yellow" />
        </div>

        <div className="relative max-w-5xl mx-auto">
          {/* Vertical Line */}
          <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-google-blue/40 via-google-yellow/20 to-google-green/40" />
          
          <div className="space-y-20">
            {events.sort((a, b) => a.roadmapPosition - b.roadmapPosition).map((event, i) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: i % 2 === 0 ? -60 : 60, y: 20 }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
                className={cn(
                  "relative flex items-center justify-between gap-8",
                  i % 2 === 0 ? "flex-row" : "flex-row-reverse"
                )}
              >
                {/* Content */}
                <div className="w-[45%]">
                  <GradientCard className="p-6 group hover:shadow-[0_10px_50px_rgba(0,0,0,0.4)] transition-all duration-500">
                    <div className="flex items-center justify-between mb-4">
                      <Badge color={event.status === 'Completed' ? 'green' : 'blue'}>{event.type}</Badge>
                      <span className="text-xs font-mono text-text-muted flex items-center gap-1">
                        <Clock size={12} /> {event.date}
                      </span>
                    </div>
                    <h3 className="text-xl font-sans font-bold mb-2 group-hover:text-gradient transition-all duration-300">{event.name}</h3>
                    <p className="text-sm text-text-muted mb-4 line-clamp-2 leading-relaxed">{event.description}</p>
                    <div className="flex items-center gap-4 text-xs text-text-muted">
                      <span className="flex items-center gap-1"><MapPin size={14} /> {event.location}</span>
                      <span className="flex items-center gap-1"><Users size={14} /> {event.registeredCount} attending</span>
                    </div>
                  </GradientCard>
                </div>

                {/* Node */}
                <div className={cn(
                  "absolute left-1/2 -translate-x-1/2 w-14 h-14 rounded-full flex items-center justify-center z-10 border-4 border-bg-base transition-all duration-500",
                  event.status === 'Completed' 
                    ? "bg-google-green shadow-[0_0_30px_rgba(52,168,83,0.5)]" 
                    : "bg-bg-card border-white/20 hover:border-white/40 hover:shadow-[0_0_20px_rgba(66,133,244,0.3)]"
                )}>
                  {event.status === 'Completed' ? (
                    <CheckCircle2 size={24} className="text-white" />
                  ) : (
                    <div className={cn("w-3 h-3 rounded-full animate-pulse", eventColorMap[event.type] ? 'bg-google-blue' : 'bg-white/30')} />
                  )}
                </div>

                {/* Spacer */}
                <div className="w-[45%]" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== EVENTS GRID ===== */}
      <section className="px-6 max-w-7xl mx-auto pb-24">
        <RevealSection>
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
            <div>
              <WordReveal as="h2" className="text-3xl md:text-4xl font-sans font-bold mb-2">Browse Events</WordReveal>
              <p className="text-text-muted text-sm font-mono">Filter and explore all our events</p>
            </div>
          
            {/* Filter Bar */}
            <div className="flex flex-wrap justify-center gap-2 p-1.5 glass-strong rounded-full">
              {eventTypes.map(type => (
                <button
                  key={type}
                  onClick={() => setFilter(type)}
                  className={cn(
                    "px-4 py-2 rounded-full text-xs font-mono transition-all duration-300",
                    filter === type 
                      ? "bg-google-blue text-white shadow-[0_0_20px_rgba(66,133,244,0.4)]" 
                      : "text-text-muted hover:text-white hover:bg-white/[0.05]"
                  )}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </RevealSection>

        <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" stagger={0.08}>
          {filteredEvents.map((event) => (
            <StaggerItem key={event.id}>
              <GradientCard className="h-full flex flex-col group">
                {/* Card header with color accent */}
                <div className={cn('w-full h-1 rounded-full mb-6', 
                  event.type === 'Hackathon' ? 'bg-google-red' :
                  event.type === 'Workshop' ? 'bg-google-blue' :
                  event.type === 'DevFest' ? 'bg-google-yellow' :
                  'bg-google-green'
                )} />

                <div className="flex items-center justify-between mb-6">
                  <div className={cn('p-3 glass-strong rounded-xl transition-all duration-500 group-hover:scale-110', eventColorMap[event.type] || 'text-google-blue')}>
                    <EventIcon type={event.type} />
                  </div>
                  <Badge color={event.status === 'Completed' ? 'green' : 'blue'}>{event.status}</Badge>
                </div>
                
                <h3 className="text-xl font-sans font-bold mb-2 group-hover:text-gradient transition-all duration-300">{event.name}</h3>
                <div className="flex items-center gap-4 text-xs text-text-muted mb-4 font-mono">
                  <span className="flex items-center gap-1"><Calendar size={13} /> {event.date}</span>
                  <span className="flex items-center gap-1"><MapPin size={13} /> {event.location}</span>
                </div>

                <p className="text-text-muted text-sm mb-6 flex-grow leading-relaxed">{event.description}</p>
                
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {event.tags.map((tag: string) => (
                    <span key={tag} className="text-[10px] uppercase tracking-wider px-2.5 py-1 bg-white/[0.04] rounded-lg border border-white/[0.06] text-text-muted font-mono">
                      {tag}
                    </span>
                  ))}
                </div>

                <GlowButton 
                  onClick={() => handleRegister(event.id)}
                  disabled={event.status === 'Completed' || registeredEvents.includes(event.id)}
                  className={cn(
                    "w-full py-3",
                    registeredEvents.includes(event.id) && "bg-google-green shadow-[0_0_20px_rgba(52,168,83,0.4)]"
                  )}
                >
                  {registeredEvents.includes(event.id) ? (
                    <span className="flex items-center justify-center gap-2"><CheckCircle2 size={18} /> Registered</span>
                  ) : event.status === 'Completed' ? 'Event Ended' : (
                    <span className="flex items-center justify-center gap-2">Register Now <ArrowRight size={16} /></span>
                  )}
                </GlowButton>
              </GradientCard>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </section>
    </div>
  );
};
