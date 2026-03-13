import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Mail, Lock, LogIn, Shield, User } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { GlowButton, GradientCard } from '../components/UI';
import { BrandLogo } from '../components/BrandLogo';
import toast from 'react-hot-toast';

export const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const onSubmit = async (data: any) => {
    try {
      await login(data.email, data.password);
      toast.success('Welcome back!');
      navigate('/profile');
    } catch (error) {
      toast.error('Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 pt-20 relative">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(66,133,244,0.08) 0%, transparent 70%)' }} />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(234,67,53,0.05) 0%, transparent 70%)' }} />
      
      <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative">
        {/* Left Side - Info */}
        <div className="hidden md:block">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <BrandLogo size={76} />
            <h1 className="text-5xl font-sans font-bold text-white leading-tight">
              Welcome Back to <br />
              <span className="text-gradient">GDG IAR</span>
            </h1>
            <p className="text-text-muted text-lg font-mono">
              Sign in to access your profile, track your points, and register for upcoming events.
            </p>
          </motion.div>
        </div>

        {/* Right Side - Form */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <GradientCard className="p-8 md:p-10">
            <h2 className="text-3xl font-sans font-bold mb-8 text-center">Login</h2>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="block text-sm font-mono text-text-muted mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                  <input
                    {...register('email', { required: 'Email is required' })}
                    type="email"
                    className={cn(
                      "w-full bg-white/[0.04] border border-white/[0.08] rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-google-blue focus:shadow-[0_0_15px_rgba(66,133,244,0.1)] transition-all duration-300 placeholder:text-text-muted/50",
                      errors.email && "border-google-red/50 focus:border-google-red focus:shadow-[0_0_15px_rgba(234,67,53,0.1)]"
                    )}
                    placeholder="name@example.com"
                  />
                </div>
                {errors.email && <p className="text-google-red text-xs mt-1">{errors.email.message as string}</p>}
              </div>

              <div>
                <label className="block text-sm font-mono text-text-muted mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                  <input
                    {...register('password', { required: 'Password is required' })}
                    type="password"
                    className={cn(
                      "w-full bg-white/[0.04] border border-white/[0.08] rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-google-blue focus:shadow-[0_0_15px_rgba(66,133,244,0.1)] transition-all duration-300 placeholder:text-text-muted/50",
                      errors.password && "border-google-red/50 focus:border-google-red focus:shadow-[0_0_15px_rgba(234,67,53,0.1)]"
                    )}
                    placeholder="••••••••"
                  />
                </div>
                {errors.password && <p className="text-google-red text-xs mt-1">{errors.password.message as string}</p>}
              </div>

              <div className="flex items-center justify-between text-sm font-mono">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded border-white/10 bg-white/5 text-google-blue focus:ring-google-blue" />
                  <span className="text-text-muted">Remember me</span>
                </label>
                <a href="#" className="text-google-blue hover:underline">Forgot password?</a>
              </div>

              <GlowButton type="submit" className="w-full py-4 flex items-center justify-center gap-2">
                <LogIn size={20} /> Sign In
              </GlowButton>

              <button 
                type="button" 
                onClick={async () => {
                  try {
                    await login('john@example.com', 'admin');
                    toast.success('Admin access granted!');
                    navigate('/admin');
                  } catch (error) {
                    toast.error('Admin login failed');
                  }
                }}
                className="w-full py-3 rounded-xl border border-google-blue/30 text-google-blue hover:bg-google-blue/10 transition-all font-mono text-sm flex items-center justify-center gap-2"
              >
                <Shield size={18} /> Admin Login (Demo)
              </button>

              <button 
                type="button" 
                onClick={async () => {
                  try {
                    await login('mike@example.com', 'student');
                    toast.success('Welcome, Student!');
                    navigate('/profile');
                  } catch (error) {
                    toast.error('Student login failed');
                  }
                }}
                className="w-full py-3 rounded-xl border border-google-green/30 text-google-green hover:bg-google-green/10 transition-all font-mono text-sm flex items-center justify-center gap-2"
              >
                <User size={18} /> Student Login (Demo)
              </button>

              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
                <div className="relative flex justify-center text-xs uppercase"><span className="bg-bg-card px-2 text-text-muted">Or continue with</span></div>
              </div>

              <button type="button" className="w-full glass-strong py-3 rounded-xl flex items-center justify-center gap-3 hover:bg-white/10 transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,255,255,0.05)]">
                <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" />
                Sign in with Google
              </button>
            </form>

            <p className="text-center mt-8 text-text-muted font-mono text-sm">
              Don't have an account? <Link to="/register" className="text-google-blue hover:underline">Register →</Link>
            </p>
          </GradientCard>
        </motion.div>
      </div>
    </div>
  );
};

import { cn } from '../hooks/useUtils';
