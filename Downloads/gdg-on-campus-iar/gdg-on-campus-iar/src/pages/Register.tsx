import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { User, Mail, Lock, GraduationCap, Building2, UserPlus } from 'lucide-react';
import { GlowButton, GradientCard } from '../components/UI';
import { BrandLogo } from '../components/BrandLogo';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

export const Register = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const { registerUser } = useAuthStore();

  const onSubmit = async (data: any) => {
    if (data.password !== data.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    try {
      await registerUser({
        name: data.name,
        email: data.email,
        studentId: data.studentId,
        branch: data.branch,
      });
      toast.success('Registration successful! Welcome to GDG IAR!');
      navigate('/profile');
    } catch (err: any) {
      toast.error(err.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 pt-28 pb-12 relative">
      <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(52,168,83,0.08) 0%, transparent 70%)' }} />
      <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(66,133,244,0.05) 0%, transparent 70%)' }} />
      
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
              Join the <br />
              <span className="text-gradient">Community</span>
            </h1>
            <p className="text-text-muted text-lg font-mono">
              Create an account to participate in events, earn points, and climb the leaderboard.
            </p>
            <div className="space-y-4 pt-4">
              {[
                'Access to exclusive workshops',
                'Earn badges and certificates',
                'Connect with industry mentors',
                'Showcase your projects'
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-text-muted font-mono">
                  <div className="w-2 h-2 rounded-full bg-google-green" />
                  {item}
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right Side - Form */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <GradientCard className="p-8 md:p-10">
            <h2 className="text-3xl font-sans font-bold mb-8 text-center">Register</h2>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-text-muted mb-1 uppercase">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
                    <input
                      {...register('name', { required: 'Name is required' })}
                      className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl py-2.5 pl-10 pr-4 focus:outline-none focus:border-google-green focus:shadow-[0_0_15px_rgba(52,168,83,0.1)] text-sm transition-all duration-300 placeholder:text-text-muted/50"
                      placeholder="John Doe"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-mono text-text-muted mb-1 uppercase">Student ID</label>
                  <div className="relative">
                    <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
                    <input
                      {...register('studentId', { required: 'ID is required' })}
                      className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl py-2.5 pl-10 pr-4 focus:outline-none focus:border-google-green focus:shadow-[0_0_15px_rgba(52,168,83,0.1)] text-sm transition-all duration-300 placeholder:text-text-muted/50"
                      placeholder="IAR2021001"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-text-muted mb-1 uppercase">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
                  <input
                    {...register('email', { required: 'Email is required' })}
                    type="email"
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl py-2.5 pl-10 pr-4 focus:outline-none focus:border-google-green focus:shadow-[0_0_15px_rgba(52,168,83,0.1)] text-sm transition-all duration-300 placeholder:text-text-muted/50"
                    placeholder="name@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-text-muted mb-1 uppercase">Branch / Department</label>
                <div className="relative">
                  <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
                  <select
                    {...register('branch', { required: 'Branch is required' })}
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl py-2.5 pl-10 pr-4 focus:outline-none focus:border-google-green focus:shadow-[0_0_15px_rgba(52,168,83,0.1)] text-sm appearance-none transition-all duration-300"
                  >
                    <option value="" className="bg-bg-card">Select Branch</option>
                    <option value="CS" className="bg-bg-card">Computer Science</option>
                    <option value="IT" className="bg-bg-card">Information Technology</option>
                    <option value="EC" className="bg-bg-card">Electronics</option>
                    <option value="ME" className="bg-bg-card">Mechanical</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-text-muted mb-1 uppercase">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
                    <input
                      {...register('password', { required: 'Password is required' })}
                      type="password"
                      className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl py-2.5 pl-10 pr-4 focus:outline-none focus:border-google-green focus:shadow-[0_0_15px_rgba(52,168,83,0.1)] text-sm transition-all duration-300 placeholder:text-text-muted/50"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-mono text-text-muted mb-1 uppercase">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
                    <input
                      {...register('confirmPassword', { required: 'Confirm password' })}
                      type="password"
                      className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl py-2.5 pl-10 pr-4 focus:outline-none focus:border-google-green focus:shadow-[0_0_15px_rgba(52,168,83,0.1)] text-sm transition-all duration-300 placeholder:text-text-muted/50"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <GlowButton type="submit" className="w-full py-3 bg-gradient-to-r from-google-green to-emerald-500 shadow-[0_0_25px_rgba(52,168,83,0.4)] hover:shadow-[0_0_40px_rgba(52,168,83,0.5)]">
                  <UserPlus size={20} /> Create Account
                </GlowButton>
              </div>
            </form>

            <p className="text-center mt-6 text-text-muted font-mono text-sm">
              Already have an account? <Link to="/login" className="text-google-blue hover:underline">Login →</Link>
            </p>
          </GradientCard>
        </motion.div>
      </div>
    </div>
  );
};
