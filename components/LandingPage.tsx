"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "motion/react";
import { Activity, Shield, Brain, HeartPulse, Stethoscope, User, Sparkles, Check } from "lucide-react";
import { auth, googleProvider } from "../lib/firebase";
import { signInWithPopup } from "firebase/auth";
import ContactForm from "./ContactForm";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function LandingPage({ onLogin }: { onLogin: () => void }) {
  const [loading, setLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const aboutSectionRef = useRef<HTMLDivElement>(null);
  const problemSectionRef = useRef<HTMLDivElement>(null);
  const shieldRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2500);

    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;
        const x = (clientX / innerWidth - 0.5) * 20;
        const y = (clientY / innerHeight - 0.5) * 20;
        setMousePosition({ x, y });
      }
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // GSAP Scroll Animations for About Section
  useEffect(() => {
    if (!aboutSectionRef.current) return;

    const cards = aboutSectionRef.current.querySelectorAll('.about-card');
    cards.forEach((card, index) => {
      gsap.fromTo(
        card,
        {
          opacity: 0,
          y: 100,
          rotationY: 45,
        },
        {
          opacity: 1,
          y: 0,
          rotationY: 0,
          duration: 1.2,
          scrollTrigger: {
            trigger: card,
            start: "top 80%",
            end: "top 20%",
            scrub: 0.5,
            markers: false,
          },
          delay: index * 0.2,
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  // GSAP Scroll Animations for Problem Section
  useEffect(() => {
    if (!problemSectionRef.current) return;

    const problemCards = problemSectionRef.current.querySelectorAll('.problem-solution-card');
    gsap.to(problemCards, {
      scrollTrigger: {
        trigger: problemSectionRef.current,
        start: "top center",
        end: "bottom center",
        scrub: 1,
      },
      y: (i) => i % 2 === 0 ? -50 : 50,
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      onLogin();
    } catch (error) {
      console.error("Error signing in with Google:", error);

      const code = (error as { code?: string })?.code || "";

      if (code === "auth/configuration-not-found") {
        window.alert(
          "Google Sign-In is not configured for this Firebase project.\n\n" +
            "Fix:\n" +
            "1. Firebase Console -> Authentication -> Sign-in method -> enable Google.\n" +
            "2. Authentication -> Settings -> Authorized domains -> add localhost.\n" +
            "3. Confirm NEXT_PUBLIC_FIREBASE_* values point to the same Firebase project."
        );
        return;
      }

      if (code === "auth/unauthorized-domain") {
        window.alert(
          "This domain is not authorized for Firebase Auth.\n\n" +
            "Add your domain (for local dev: localhost) in Firebase Console -> Authentication -> Settings -> Authorized domains."
        );
      }
    }
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-[#F5F7FA] text-slate-800 font-sans overflow-x-hidden selection:bg-[#1A36A8]/20">
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#F5F7FA] overflow-hidden"
          >
            {/* Background pulsing rings */}
            <motion.div
              animate={{
                scale: [1, 2, 3],
                opacity: [0.5, 0.2, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeOut",
              }}
              className="absolute w-64 h-64 border-2 border-[#1A36A8] rounded-full"
            />
            <motion.div
              animate={{
                scale: [1, 2, 3],
                opacity: [0.5, 0.2, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeOut",
                delay: 0.5,
              }}
              className="absolute w-64 h-64 border-2 border-blue-400 rounded-full"
            />

            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 180, 360]
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity,
                ease: "linear" 
              }}
              className="w-32 h-32 bg-gradient-to-tr from-[#1A36A8] to-blue-400 rounded-full flex items-center justify-center mb-8 shadow-[0_0_80px_rgba(26,54,168,0.4)] relative z-10"
            >
              <div className="w-28 h-28 bg-[#F5F7FA] rounded-full flex items-center justify-center">
                <Activity className="w-12 h-12 text-[#1A36A8]" />
              </div>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl font-black tracking-widest uppercase text-[#0B173E] font-headline relative z-10"
            >
              Medyrax
            </motion.h1>
            
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "200px" }}
              transition={{ delay: 0.8, duration: 1.5 }}
              className="h-1 bg-gradient-to-r from-[#1A36A8] to-blue-400 mt-6 rounded-full relative z-10"
            />
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="text-[#1A36A8]/60 text-sm mt-4 tracking-widest uppercase font-body relative z-10 font-bold"
            >
              Initializing AI Engine...
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${scrolled ? 'bg-white/80 backdrop-blur-md border-b border-slate-200 py-4 shadow-sm' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#1A36A8] rounded-lg flex items-center justify-center">
              <Activity className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold tracking-wide text-[#0B173E] font-headline">Medyrax</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-500 font-body">
            <a href="#home" onClick={(e) => handleNavClick(e, '#home')} className="hover:text-[#1A36A8] transition-colors cursor-pointer">Home</a>
            <a href="#about" onClick={(e) => handleNavClick(e, '#about')} className="hover:text-[#1A36A8] transition-colors cursor-pointer">About Us</a>
            <a href="#problem" onClick={(e) => handleNavClick(e, '#problem')} className="hover:text-[#1A36A8] transition-colors cursor-pointer">Problem</a>
            <a href="#solution" onClick={(e) => handleNavClick(e, '#solution')} className="hover:text-[#1A36A8] transition-colors cursor-pointer">Solution</a>
            <a href="#contact" onClick={(e) => handleNavClick(e, '#contact')} className="hover:text-[#1A36A8] transition-colors cursor-pointer">Contact</a>
          </div>

          <button 
            onClick={handleGoogleLogin}
            className="bg-[#1A36A8] hover:bg-[#12267a] text-white px-5 py-2 rounded-full text-sm font-bold flex items-center gap-2 transition-all shadow-md font-body"
          >
            <User className="w-4 h-4" /> Sign In
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex flex-col items-center justify-center pt-20 px-6 overflow-hidden perspective-1000">
        {/* Background Effects */}
        <motion.div 
          style={{ y, opacity }}
          className="absolute inset-0 pointer-events-none"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#1A36A8]/10 rounded-full blur-[120px]"></div>
          <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-blue-400/10 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-1/4 left-1/4 w-[600px] h-[600px] bg-indigo-400/10 rounded-full blur-[150px]"></div>
        </motion.div>

        <motion.div 
          className="relative z-10 text-center max-w-5xl mx-auto"
          animate={{
            rotateX: -mousePosition.y,
            rotateY: mousePosition.x,
          }}
          transition={{ type: "spring", stiffness: 50, damping: 20 }}
          style={{ transformStyle: "preserve-3d" }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 2.5, duration: 1.2, type: "spring", bounce: 0.4 }}
            className="inline-block mb-6 px-6 py-2 rounded-full bg-white/50 backdrop-blur-md border border-white/20 shadow-xl"
            style={{ transform: "translateZ(50px)" }}
          >
            <span className="text-sm font-bold text-[#1A36A8] tracking-widest uppercase font-body flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> The Future of Health
            </span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.7, duration: 1, ease: "easeOut" }}
            className="text-7xl md:text-9xl lg:text-[12rem] font-black tracking-tighter mb-6 leading-[0.9] text-[#0B173E] font-headline drop-shadow-2xl"
            style={{ transform: "translateZ(100px)" }}
          >
            Medyrax
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 3.0, duration: 0.8 }}
            className="text-2xl md:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-[#1A36A8] via-blue-500 to-indigo-600 font-bold tracking-tight font-headline max-w-2xl mx-auto"
            style={{ transform: "translateZ(75px)" }}
          >
            Your Digital Clinician
          </motion.p>
        </motion.div>

        {/* Floating 3D Elements */}
        <motion.div
          animate={{
            y: [0, -20, 0],
            rotate: [0, 10, 0],
          }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          ref={shieldRef}
          className="absolute top-1/3 left-1/4 w-24 h-24 bg-white/40 backdrop-blur-xl border border-white/50 rounded-2xl shadow-2xl flex items-center justify-center hidden md:flex z-20"
          style={{ transform: `translateZ(150px) translateX(${mousePosition.x * 2}px) translateY(${mousePosition.y * 2}px)` }}
        >
          <Activity className="w-10 h-10 text-[#1A36A8]" />
        </motion.div>

        <motion.div
          animate={{
            y: [0, 20, 0],
            rotate: [0, -10, 0],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-1/3 right-1/4 w-32 h-32 bg-gradient-to-br from-blue-400/50 to-indigo-500/50 backdrop-blur-xl border border-blue-300/50 rounded-full shadow-2xl flex items-center justify-center hidden md:flex z-30 relative"
          style={{ transform: `translateZ(200px) translateX(${-mousePosition.x * 2}px) translateY(${-mousePosition.y * 2}px)` }}
        >
          <Shield className="w-12 h-12 text-white drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 4, duration: 1 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 text-slate-500 cursor-pointer hover:text-[#1A36A8] transition-colors z-20"
          onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
        >
          <span className="text-xs font-bold tracking-widest uppercase font-body">Scroll to continue</span>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-8 h-12 border-2 border-current rounded-full flex justify-center p-1"
          >
            <motion.div 
              animate={{ y: [0, 16, 0], opacity: [1, 0, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="w-1.5 h-3 bg-current rounded-full"
            />
          </motion.div>
        </motion.div>
      </section>

      <section id="about" ref={aboutSectionRef} className="py-32 px-6 relative bg-gradient-to-b from-[#F5F7FA] via-white to-[#F5F7FA]">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-6 text-[#0B173E] font-headline">
              Democratizing<br/>Healthcare Data
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto font-body">
              We believe everyone deserves to understand their own body. Medyrax was built by technologists and medical professionals.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="about-card bg-white border border-slate-200 p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mb-4">
                  <Check className="w-6 h-6 text-[#1A36A8]" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-[#0B173E] font-headline">99% Accuracy</h3>
                <p className="text-slate-600 font-body">Precision in medical term translation and analysis</p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="about-card bg-white border border-slate-200 p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all"
              >
                <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center mb-4">
                  <HeartPulse className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-[#0B173E] font-headline">24/7 Availability</h3>
                <p className="text-slate-600 font-body">Always available for your health queries and concerns</p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
                className="about-card bg-white border border-slate-200 p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all"
              >
                <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-[#0B173E] font-headline">Secure & Private</h3>
                <p className="text-slate-600 font-body">Your health data is encrypted and protected at all times</p>
              </motion.div>
            </div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.8, rotateY: 45 }}
              whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05, rotateY: 10 }}
              className="relative h-[500px] rounded-3xl overflow-hidden border border-slate-200 bg-gradient-to-br from-white to-blue-50 flex items-center justify-center shadow-2xl"
              style={{ perspective: 1000 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#1A36A8]/10 via-transparent to-blue-400/10"></div>
              <motion.div
                animate={{ rotateZ: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute w-64 h-64 border-2 border-[#1A36A8]/30 rounded-full border-dashed"
              />
              <motion.div
                animate={{ rotateZ: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute w-48 h-48 border-2 border-blue-400/30 rounded-full border-dashed"
              />
              <Brain className="w-40 h-40 text-[#1A36A8] relative z-10 drop-shadow-[0_0_20px_rgba(26,54,168,0.3)]" />
            </motion.div>
          </div>
        </div>
      </section>
      {/* Problem & Solution Bento Box */}
      <section id="problem" className="py-32 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-[#0B173E] font-headline">The Problem & Our Solution</h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto font-body">
              Navigating the healthcare system shouldn&apos;t require a medical degree.
            </p>
          </div>
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="solution">
            {/* Problem Card */}
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="problem-solution-card md:col-span-1 bg-gradient-to-br from-red-50 to-red-100/50 border border-red-200 p-8 rounded-3xl transition-all hover:shadow-[0_20px_40px_rgba(220,38,38,0.15)]"
            >
              <div className="w-14 h-14 bg-red-200 rounded-2xl flex items-center justify-center mb-6">
                <Stethoscope className="w-7 h-7 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-[#0B173E] font-headline">The Problem</h3>
              <p className="text-slate-700 leading-relaxed font-body text-lg">
                Medical reports filled with complex jargon leave patients confused and unable to make informed decisions.
              </p>
            </motion.div>

            {/* Solution Card */}
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="problem-solution-card md:col-span-2 bg-gradient-to-br from-blue-50 to-indigo-100/50 border border-blue-200 p-8 rounded-3xl relative overflow-hidden transition-all hover:shadow-[0_20px_40px_rgba(26,54,168,0.15)]"
            >
              <div className="absolute right-0 top-0 w-64 h-64 bg-blue-300/20 rounded-full blur-[80px]"></div>
              <div className="relative z-10">
                <div className="w-14 h-14 bg-blue-200 rounded-2xl flex items-center justify-center mb-6">
                  <Shield className="w-7 h-7 text-[#1A36A8]" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-[#0B173E] font-headline">The Medyrax Solution</h3>
                <p className="text-slate-700 leading-relaxed mb-6 max-w-xl font-body text-lg">
                  Upload your documents. Our AI instantly translates clinical terminology into plain language and generates actionable insights.
                </p>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 text-sm font-bold text-[#1A36A8] font-body bg-white/50 px-4 py-2 rounded-full">
                    <Check className="w-4 h-4" /> Instant Analysis
                  </div>
                  <div className="flex items-center gap-2 text-sm font-bold text-[#1A36A8] font-body bg-white/50 px-4 py-2 rounded-full">
                    <Check className="w-4 h-4" /> Secure & Private
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Form Component */}
      <ContactForm />

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-50 pt-20 pb-10 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-[#1A36A8] rounded-lg flex items-center justify-center">
                <Activity className="w-4 h-4 text-white" />
              </div>
              <span className="text-2xl font-bold tracking-wide text-[#0B173E] font-headline">Medyrax</span>
            </div>
            <p className="text-slate-600 max-w-sm font-body">
              Your digital clinician. Making healthcare data accessible and understandable for everyone.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-[#0B173E] font-headline">Product</h4>
            <ul className="space-y-4 text-slate-600 text-sm font-body">
              <li><a href="#" className="hover:text-[#1A36A8] transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-[#1A36A8] transition-colors">Security</a></li>
              <li><a href="#" className="hover:text-[#1A36A8] transition-colors">Enterprise</a></li>
              <li><a href="#" className="hover:text-[#1A36A8] transition-colors">Pricing</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-[#0B173E] font-headline">Company</h4>
            <ul className="space-y-4 text-slate-600 text-sm font-body">
              <li><a href="#" className="hover:text-[#1A36A8] transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-[#1A36A8] transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-[#1A36A8] transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-[#1A36A8] transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto border-t border-slate-200 pt-8 flex flex-col md:flex-row items-center justify-between text-slate-500 text-sm font-body">
          <p>© 2026 Medyrax Inc. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-[#1A36A8] transition-colors">Twitter</a>
            <a href="#" className="hover:text-[#1A36A8] transition-colors">LinkedIn</a>
            <a href="#" className="hover:text-[#1A36A8] transition-colors">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

