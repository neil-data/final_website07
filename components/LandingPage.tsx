"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from "motion/react";
import { Activity, Shield, Zap, ChevronDown, ArrowRight, Brain, HeartPulse, Stethoscope, Mail, User, Sparkles } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { auth, googleProvider } from "../lib/firebase";
import { signInWithPopup } from "firebase/auth";

export default function LandingPage({ onLogin }: { onLogin: () => void }) {
  const [loading, setLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const homeSectionRef = useRef<HTMLElement>(null);
  const aboutSectionRef = useRef<HTMLElement>(null);
  const problemSectionRef = useRef<HTMLElement>(null);
  const solutionSectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

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

  useEffect(() => {
    if (loading) return;

    const ctx = gsap.context(() => {
      if (homeSectionRef.current) {
        gsap.fromTo(
          homeSectionRef.current.querySelectorAll("[data-gsap-home]"),
          { y: 56, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            stagger: 0.14,
            ease: "power3.out",
            clearProps: "transform,opacity"
          }
        );
      }

      if (aboutSectionRef.current) {
        gsap.fromTo(
          aboutSectionRef.current.querySelectorAll("[data-gsap-about]"),
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.85,
            stagger: 0.16,
            ease: "power3.out",
            clearProps: "transform,opacity",
            scrollTrigger: {
              trigger: aboutSectionRef.current,
              start: "top 78%",
              once: true
            }
          }
        );
      }

      if (problemSectionRef.current) {
        gsap.fromTo(
          problemSectionRef.current.querySelectorAll("[data-gsap-problem]"),
          { y: 54, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.14,
            ease: "power3.out",
            clearProps: "transform,opacity",
            scrollTrigger: {
              trigger: problemSectionRef.current,
              start: "top 78%",
              once: true
            }
          }
        );
      }

      if (solutionSectionRef.current) {
        gsap.fromTo(
          solutionSectionRef.current.querySelectorAll("[data-gsap-solution]"),
          { y: 52, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.82,
            stagger: 0.18,
            ease: "power3.out",
            clearProps: "transform,opacity",
            scrollTrigger: {
              trigger: solutionSectionRef.current,
              start: "top 82%",
              once: true
            }
          }
        );
      }
    }, containerRef);

    return () => {
      ctx.revert();
    };
  }, [loading]);

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
            <a href="#home" className="hover:text-[#1A36A8] transition-colors">Home</a>
            <a href="#about" className="hover:text-[#1A36A8] transition-colors">About Us</a>
            <a href="#problem" className="hover:text-[#1A36A8] transition-colors">Problem</a>
            <a href="#solution" className="hover:text-[#1A36A8] transition-colors">Solution</a>
            <a href="#contact" className="hover:text-[#1A36A8] transition-colors">Contact</a>
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
      <section id="home" ref={homeSectionRef} className="relative min-h-screen flex flex-col items-center justify-center pt-20 px-6 overflow-hidden perspective-1000">
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
            data-gsap-home
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
            data-gsap-home
            style={{ transform: "translateZ(100px)" }}
          >
            Medyrax
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 3.0, duration: 0.8 }}
            className="text-2xl md:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-[#1A36A8] via-blue-500 to-indigo-600 font-bold tracking-tight font-headline max-w-2xl mx-auto"
            data-gsap-home
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
          className="absolute top-1/3 left-1/4 w-24 h-24 bg-white/40 backdrop-blur-xl border border-white/50 rounded-2xl shadow-2xl flex items-center justify-center hidden md:flex"
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
          className="absolute bottom-1/3 right-1/4 w-32 h-32 bg-white/40 backdrop-blur-xl border border-white/50 rounded-full shadow-2xl flex items-center justify-center hidden md:flex"
          style={{ transform: `translateZ(200px) translateX(${-mousePosition.x * 2}px) translateY(${-mousePosition.y * 2}px)` }}
        >
          <Shield className="w-12 h-12 text-blue-500" />
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

      {/* About Us */}
      <section id="about" ref={aboutSectionRef} className="py-32 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div data-gsap-about>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-[#0B173E] font-headline">Democratizing<br/>Healthcare Data.</h2>
              <p className="text-slate-600 text-lg leading-relaxed mb-8 font-body">
                We believe everyone deserves to understand their own body. Medyrax was built by a team of technologists and medical professionals who saw a massive gap between clinical data and patient comprehension.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm">
                  <h3 className="text-3xl font-bold text-[#1A36A8] mb-2 font-headline">99%</h3>
                  <p className="text-sm text-slate-500 font-body">Accuracy in medical term translation</p>
                </div>
                <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm">
                  <h3 className="text-3xl font-bold text-blue-500 mb-2 font-headline">24/7</h3>
                  <p className="text-sm text-slate-500 font-body">Availability for your health queries</p>
                </div>
              </div>
            </div>
            <motion.div 
              whileHover={{ scale: 1.02, rotateY: 5, rotateX: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="relative h-[500px] rounded-3xl overflow-hidden border border-slate-200 bg-white flex items-center justify-center shadow-xl"
              data-gsap-about
              style={{ perspective: 1000 }}
            >
              <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/medtech/800/800')] opacity-5 mix-blend-overlay bg-cover bg-center"></div>
              <motion.div
                animate={{ rotateZ: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute w-64 h-64 border border-[#1A36A8]/20 rounded-full border-dashed"
              />
              <motion.div
                animate={{ rotateZ: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute w-48 h-48 border border-blue-400/20 rounded-full border-dashed"
              />
              <Brain className="w-32 h-32 text-[#1A36A8] relative z-10 drop-shadow-[0_0_15px_rgba(26,54,168,0.2)]" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Problem & Solution Bento Box */}
      <section id="problem" ref={problemSectionRef} className="py-32 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20" data-gsap-problem>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-[#0B173E] font-headline">The Problem & Our Solution</h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto font-body">
              Navigating the healthcare system shouldn&apos;t require a medical degree.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="solution" ref={solutionSectionRef}>
            {/* Problem Card */}
            <motion.div 
              whileHover={{ y: -10, scale: 1.02 }}
              className="md:col-span-1 bg-red-50 border border-red-100 p-8 rounded-3xl transition-all hover:shadow-[0_20px_40px_rgba(220,38,38,0.15)]"
              data-gsap-problem
              data-gsap-solution
            >
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-6">
                <Stethoscope className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-[#0B173E] font-headline">The Problem</h3>
              <p className="text-slate-600 leading-relaxed font-body">
                Medical reports are filled with complex jargon, leaving patients confused, anxious, and unable to make informed decisions about their own health.
              </p>
            </motion.div>

            {/* Solution Card */}
            <motion.div 
              whileHover={{ y: -10, scale: 1.02 }}
              className="md:col-span-2 bg-blue-50 border border-blue-100 p-8 rounded-3xl relative overflow-hidden transition-all hover:shadow-[0_20px_40px_rgba(26,54,168,0.15)]"
              data-gsap-problem
              data-gsap-solution
            >
              <div className="absolute right-0 top-0 w-64 h-64 bg-blue-200/50 rounded-full blur-[80px]"></div>
              <div className="relative z-10">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                  <Shield className="w-6 h-6 text-[#1A36A8]" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-[#0B173E] font-headline">The Medyrax Solution</h3>
                <p className="text-slate-600 leading-relaxed mb-8 max-w-xl font-body">
                  Simply upload your lab results or prescriptions. Our AI instantly translates clinical terminology into plain English, highlights critical interactions, and generates a personalized action plan.
                </p>
                <div className="flex gap-4">
                  <div className="flex items-center gap-2 text-sm font-bold text-[#1A36A8] font-body">
                    <CheckCircle className="w-4 h-4" /> Instant Analysis
                  </div>
                  <div className="flex items-center gap-2 text-sm font-bold text-[#1A36A8] font-body">
                    <CheckCircle className="w-4 h-4" /> Secure & Private
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section id="contact" className="py-32 px-6 relative">
        <div className="max-w-3xl mx-auto bg-white border border-slate-200 p-10 md:p-16 rounded-[40px] shadow-xl">
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Mail className="w-8 h-8 text-[#1A36A8]" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#0B173E] font-headline">Get in Touch</h2>
            <p className="text-slate-600 font-body">Have questions about our enterprise API or clinical partnerships?</p>
          </div>

          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 font-body">First Name</label>
                <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:border-[#1A36A8] focus:bg-white transition-colors font-body" placeholder="John" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 font-body">Last Name</label>
                <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:border-[#1A36A8] focus:bg-white transition-colors font-body" placeholder="Doe" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 font-body">Email Address</label>
              <input type="email" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:border-[#1A36A8] focus:bg-white transition-colors font-body" placeholder="john@example.com" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 font-body">Message</label>
              <textarea rows={4} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:border-[#1A36A8] focus:bg-white transition-colors font-body" placeholder="How can we help you?"></textarea>
            </div>
            <button className="w-full py-4 bg-[#1A36A8] hover:bg-[#12267a] text-white rounded-xl font-bold transition-colors font-body">
              Send Message
            </button>
          </form>
        </div>
      </section>

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
              Your digital clinician. Making healthcare data accessible, understandable, and actionable for everyone.
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

function CheckCircle({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
  );
}
