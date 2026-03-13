import React, { useRef } from 'react';
import { useForm } from 'react-hook-form';
import { motion, useScroll, useTransform } from 'motion/react';
import { Mail, Linkedin, Instagram, Twitter, Send, MapPin, Phone, MessageCircle, ArrowRight } from 'lucide-react';
import { GlowButton, GradientCard, FloatingOrb } from '../components/UI';
import { useQueryStore } from '../store/queryStore';
import { useAuthStore } from '../store/authStore';
import { cn } from '../hooks/useUtils';
import toast from 'react-hot-toast';
import { WordReveal, TextReveal, RevealSection, LineReveal, MagneticElement, ParallaxLayer, StaggerChildren, StaggerItem } from '../components/Animations';

export const Contact = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const { addQuery } = useQueryStore();
  const { user } = useAuthStore();

  const heroRef = useRef(null);
  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroOpacity = useTransform(heroScroll, [0, 0.6], [1, 0]);
  const heroY = useTransform(heroScroll, [0, 0.6], [0, 60]);

  const onSubmit = (data: any) => {
    addQuery({
      userId: user?.id || 'guest',
      name: data.name,
      email: data.email,
      subject: data.subject,
      message: data.message,
    });
    toast.success('Message sent! We will get back to you soon.');
    reset();
  };

  const contactInfo = [
    { icon: Mail, color: 'google-blue', label: 'Email Us', value: 'gdg.iar@example.com', hoverBg: 'hover:bg-google-blue/10', glow: 'group-hover:shadow-[0_0_30px_rgba(66,133,244,0.2)]' },
    { icon: MapPin, color: 'google-green', label: 'Visit Us', value: 'IAR Campus, Innovation Hub', hoverBg: 'hover:bg-google-green/10', glow: 'group-hover:shadow-[0_0_30px_rgba(52,168,83,0.2)]' },
    { icon: Phone, color: 'google-red', label: 'Call Us', value: '+91 98765 43210', hoverBg: 'hover:bg-google-red/10', glow: 'group-hover:shadow-[0_0_30px_rgba(234,67,53,0.2)]' },
  ];

  return (
    <div className="relative">
      {/* ===== PAGE HERO ===== */}
      <section ref={heroRef} className="relative pt-40 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-google-green/[0.04] via-transparent to-transparent" />
        <ParallaxLayer speed={-0.2} className="absolute -top-20 -right-40 pointer-events-none">
          <FloatingOrb color="#34A853" size={500} className="opacity-30" />
        </ParallaxLayer>
        <ParallaxLayer speed={0.1} className="absolute bottom-0 -left-32 pointer-events-none">
          <FloatingOrb color="#4285F4" size={350} className="opacity-20" />
        </ParallaxLayer>

        <motion.div style={{ opacity: heroOpacity, y: heroY }} className="max-w-7xl mx-auto text-center relative">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass-strong text-xs font-mono text-google-green tracking-wider uppercase mb-8 border border-google-green/10"
          >
            <MessageCircle size={14} /> Contact Us
          </motion.span>
          <WordReveal as="h1" className="text-5xl md:text-7xl lg:text-8xl font-sans font-extrabold mb-6 leading-[0.92] tracking-[-0.02em]">
            Get in Touch
          </WordReveal>
          <LineReveal className="max-w-xs mx-auto mb-6" color="google-green" />
          <TextReveal className="text-lg text-text-muted font-mono max-w-xl mx-auto" stagger={0.01}>
            Have questions or want to collaborate? We'd love to hear from you.
          </TextReveal>
        </motion.div>
      </section>

      {/* ===== CONTACT INFO CARDS ===== */}
      <section className="px-6 max-w-7xl mx-auto mb-16">
        <StaggerChildren className="grid grid-cols-1 md:grid-cols-3 gap-4" stagger={0.1}>
          {contactInfo.map((item, i) => (
            <StaggerItem key={i}>
              <div className={cn(
                "flex items-center gap-4 group p-5 rounded-2xl glass border border-white/[0.03] hover:border-white/[0.08] transition-all duration-500",
                item.hoverBg, item.glow
              )}>
                <div className={cn(
                  "w-14 h-14 glass-strong rounded-2xl flex items-center justify-center shrink-0 transition-all duration-500",
                  `text-${item.color}`,
                  'group-hover:scale-110'
                )}>
                  <item.icon size={24} />
                </div>
                <div>
                  <div className="text-[10px] font-mono text-text-muted uppercase tracking-[0.2em]">{item.label}</div>
                  <div className="text-base font-bold">{item.value}</div>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </section>

      {/* ===== MAIN CONTENT - FORM + MAP ===== */}
      <section className="px-6 max-w-7xl mx-auto pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start relative">
          {/* Left Side - Form (3 cols) */}
          <div className="lg:col-span-3">
            <RevealSection>
              <GradientCard className="p-8 md:p-10">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-1 h-8 rounded-full bg-google-green" />
                  <h2 className="text-3xl font-sans font-bold">Send a Message</h2>
                </div>
                <p className="text-text-muted text-sm font-mono mb-8 ml-5">We'll get back to you within 24 hours.</p>
                
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-mono text-text-muted mb-2 uppercase tracking-wider">Full Name</label>
                      <input
                        {...register('name', { required: 'Name is required' })}
                        className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl py-3.5 px-4 focus:outline-none focus:border-google-blue focus:shadow-[0_0_20px_rgba(66,133,244,0.15)] transition-all duration-300 placeholder:text-text-muted/40 text-sm"
                        placeholder="John Doe"
                      />
                      {errors.name && <span className="text-google-red text-xs mt-1 block">{String(errors.name.message)}</span>}
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-text-muted mb-2 uppercase tracking-wider">Email Address</label>
                      <input
                        {...register('email', { required: 'Email is required' })}
                        type="email"
                        className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl py-3.5 px-4 focus:outline-none focus:border-google-blue focus:shadow-[0_0_20px_rgba(66,133,244,0.15)] transition-all duration-300 placeholder:text-text-muted/40 text-sm"
                        placeholder="john@example.com"
                      />
                      {errors.email && <span className="text-google-red text-xs mt-1 block">{String(errors.email.message)}</span>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-text-muted mb-2 uppercase tracking-wider">Subject</label>
                    <select
                      {...register('subject', { required: 'Subject is required' })}
                      className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl py-3.5 px-4 focus:outline-none focus:border-google-blue focus:shadow-[0_0_20px_rgba(66,133,244,0.15)] transition-all duration-300 appearance-none text-sm"
                    >
                      <option value="" className="bg-bg-card">Select Subject</option>
                      <option value="General" className="bg-bg-card">General Inquiry</option>
                      <option value="Collaboration" className="bg-bg-card">Collaboration</option>
                      <option value="Sponsorship" className="bg-bg-card">Sponsorship</option>
                      <option value="Join Team" className="bg-bg-card">Join the Team</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-text-muted mb-2 uppercase tracking-wider">Message</label>
                    <textarea
                      {...register('message', { required: 'Message is required' })}
                      rows={6}
                      className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl py-3.5 px-4 focus:outline-none focus:border-google-blue focus:shadow-[0_0_20px_rgba(66,133,244,0.15)] transition-all duration-300 resize-none placeholder:text-text-muted/40 text-sm"
                      placeholder="How can we help you?"
                    />
                    {errors.message && <span className="text-google-red text-xs mt-1 block">{String(errors.message.message)}</span>}
                  </div>

                  <GlowButton type="submit" className="w-full py-4">
                    <Send size={18} /> Send Message
                  </GlowButton>
                </form>
              </GradientCard>
            </RevealSection>
          </div>

          {/* Right Side - Social + Map (2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            <RevealSection direction="right">
              <div className="glass-strong p-6 rounded-2xl border border-white/[0.03]">
                <h4 className="font-sans font-bold text-lg mb-4">Follow Our Socials</h4>
                <div className="flex gap-3">
                  {[
                    { icon: Linkedin, color: 'hover:text-[#0077b5] hover:bg-[#0077b5]/10 hover:shadow-[0_0_20px_rgba(0,119,181,0.25)]', link: '#', label: 'LinkedIn' },
                    { icon: Instagram, color: 'hover:text-[#e1306c] hover:bg-[#e1306c]/10 hover:shadow-[0_0_20px_rgba(225,48,108,0.25)]', link: '#', label: 'Instagram' },
                    { icon: Twitter, color: 'hover:text-[#1da1f2] hover:bg-[#1da1f2]/10 hover:shadow-[0_0_20px_rgba(29,161,242,0.25)]', link: '#', label: 'Twitter' },
                    { icon: Mail, color: 'hover:text-google-red hover:bg-google-red/10 hover:shadow-[0_0_20px_rgba(234,67,53,0.25)]', link: '#', label: 'Email' },
                  ].map((social, i) => (
                    <MagneticElement key={i} strength={0.4}>
                      <a href={social.link} className={cn("p-4 glass rounded-2xl transition-all duration-300 group flex flex-col items-center gap-1", social.color)}>
                        <social.icon size={22} className="transition-transform duration-300 group-hover:scale-110" />
                        <span className="text-[9px] font-mono uppercase tracking-wider text-text-muted/50 group-hover:text-current">{social.label}</span>
                      </a>
                    </MagneticElement>
                  ))}
                </div>
              </div>
            </RevealSection>

            <RevealSection direction="right">
              <div className="glass-strong rounded-2xl overflow-hidden border border-white/[0.03]">
                <div className="p-4 border-b border-white/[0.05]">
                  <div className="flex items-center gap-2">
                    <MapPin size={14} className="text-google-green" />
                    <span className="text-xs font-mono text-text-muted uppercase tracking-wider">Location</span>
                  </div>
                </div>
                <div className="h-72">
                  <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3671.697931105953!2d72.6366663!3d23.0333333!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjPCsDAxJzYwLjAiTiA3MsKwMzgnMTIuMCJF!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin" 
                    width="100%" 
                    height="100%" 
                    style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg)' }} 
                    allowFullScreen={true} 
                    loading="lazy"
                  ></iframe>
                </div>
              </div>
            </RevealSection>

            {/* Quick FAQ */}
            <RevealSection direction="right">
              <div className="glass-strong p-6 rounded-2xl border border-white/[0.03]">
                <h4 className="font-sans font-bold text-lg mb-4">Quick Info</h4>
                <div className="space-y-3">
                  {[
                    { q: 'Response Time', a: 'Within 24 hours' },
                    { q: 'Best for Collabs', a: 'Email or LinkedIn DM' },
                    { q: 'Open to All', a: 'Students, faculty, and industry' },
                  ].map((item) => (
                    <div key={item.q} className="flex items-center justify-between py-2 border-b border-white/[0.04] last:border-0">
                      <span className="text-sm text-text-muted font-mono">{item.q}</span>
                      <span className="text-sm font-bold text-white">{item.a}</span>
                    </div>
                  ))}
                </div>
              </div>
            </RevealSection>
          </div>
        </div>
      </section>
    </div>
  );
};
