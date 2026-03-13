import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Save, Globe, Shield, Bell, Mail, Palette, Code, Database, RotateCcw, CheckCircle } from 'lucide-react';
import { GlowButton, GradientCard, Badge } from '../components/UI';
import { cn } from '../hooks/useUtils';
import toast from 'react-hot-toast';

export const AdminSettings = () => {
  const { register, handleSubmit } = useForm({
    defaultValues: {
      siteTitle: 'GDG on Campus IAR',
      tagline: 'Build. Learn. Innovate.',
      contactEmail: 'gdg.iar@example.com',
      maintenanceMode: false,
      registrationOpen: true,
      showLeaderboard: true,
      showMedia: true,
      showAnnouncements: true,
    },
  });

  const [socials, setSocials] = useState({
    linkedin: 'https://linkedin.com/company/gdgoc-iar',
    instagram: 'https://instagram.com/gdgoc_iar',
    twitter: 'https://twitter.com/gdgoc_iar',
    github: 'https://github.com/gdgoc-iar',
    youtube: '',
  });

  const [activeTab, setActiveTab] = useState('general');

  const onSubmit = () => { toast.success('Settings saved successfully'); };
  const saveSocials = () => { toast.success('Social links updated'); };

  const tabs = [
    { id: 'general', label: 'General', icon: Globe },
    { id: 'features', label: 'Features', icon: Code },
    { id: 'social', label: 'Social', icon: Globe },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'danger', label: 'Danger Zone', icon: Shield },
  ];

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-sans font-bold">Site Settings</h2>

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={cn('flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all',
              activeTab === tab.id ? 'bg-google-blue text-white' : 'glass text-text-muted hover:text-white hover:bg-white/5')}>
            <tab.icon size={16} /> {tab.label}
          </button>
        ))}
      </div>

      {/* General */}
      {activeTab === 'general' && (
        <GradientCard className="p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <h3 className="text-xl font-sans font-bold flex items-center gap-2"><Globe size={20} /> General Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-mono text-text-muted mb-1">Site Title</label>
                <input {...register('siteTitle')} className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 focus:outline-none focus:border-google-blue text-sm" />
              </div>
              <div>
                <label className="block text-xs font-mono text-text-muted mb-1">Contact Email</label>
                <input {...register('contactEmail')} className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 focus:outline-none focus:border-google-blue text-sm" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-mono text-text-muted mb-1">Site Tagline</label>
              <input {...register('tagline')} className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 focus:outline-none focus:border-google-blue text-sm" />
            </div>
            <GlowButton type="submit" className="py-3 px-8 flex items-center gap-2">
              <Save size={18} /> Save General Settings
            </GlowButton>
          </form>
        </GradientCard>
      )}

      {/* Features */}
      {activeTab === 'features' && (
        <GradientCard className="p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <h3 className="text-xl font-sans font-bold flex items-center gap-2"><Code size={20} /> Feature Toggles</h3>
            <p className="text-sm text-text-muted">Control which sections are visible on the public site.</p>
            <div className="space-y-4">
              {[
                { key: 'registrationOpen', label: 'User Registration', desc: 'Allow new users to register' },
                { key: 'showLeaderboard', label: 'Leaderboard', desc: 'Show public leaderboard page' },
                { key: 'showMedia', label: 'Media Hub', desc: 'Show media/social posts page' },
                { key: 'showAnnouncements', label: 'Announcements', desc: 'Show announcements page & section' },
              ].map((toggle) => (
                <div key={toggle.key} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                  <div>
                    <div className="font-bold text-sm">{toggle.label}</div>
                    <div className="text-xs text-text-muted">{toggle.desc}</div>
                  </div>
                  <input type="checkbox" {...register(toggle.key as any)}
                    className="w-10 h-5 rounded-full bg-white/10 appearance-none checked:bg-google-green relative transition-all cursor-pointer before:absolute before:w-3.5 before:h-3.5 before:bg-white before:rounded-full before:top-[3px] before:left-[3px] checked:before:left-[21px] before:transition-all" />
                </div>
              ))}
            </div>
            <GlowButton type="submit" className="py-3 px-8 flex items-center gap-2">
              <Save size={18} /> Save Feature Settings
            </GlowButton>
          </form>
        </GradientCard>
      )}

      {/* Social */}
      {activeTab === 'social' && (
        <GradientCard className="p-8">
          <h3 className="text-xl font-sans font-bold mb-6 flex items-center gap-2"><Globe size={20} /> Social Links</h3>
          <div className="space-y-4">
            {Object.entries(socials).map(([key, val]) => (
              <div key={key}>
                <label className="block text-xs font-mono text-text-muted mb-1 uppercase">{key}</label>
                <input value={val} onChange={(e) => setSocials({ ...socials, [key]: e.target.value })}
                  placeholder={`https://${key}.com/...`}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 focus:outline-none focus:border-google-blue text-sm" />
              </div>
            ))}
          </div>
          <GlowButton onClick={saveSocials} className="py-3 px-8 flex items-center gap-2 mt-6">
            <Save size={18} /> Save Social Links
          </GlowButton>
        </GradientCard>
      )}

      {/* Appearance */}
      {activeTab === 'appearance' && (
        <GradientCard className="p-8">
          <h3 className="text-xl font-sans font-bold mb-6 flex items-center gap-2"><Palette size={20} /> Appearance</h3>
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-mono text-text-muted mb-2">Theme Colors (Google colors are defaults)</label>
              <div className="grid grid-cols-4 gap-4">
                {[
                  { label: 'Blue', color: '#4285F4' },
                  { label: 'Red', color: '#EA4335' },
                  { label: 'Yellow', color: '#FBBC04' },
                  { label: 'Green', color: '#34A853' },
                ].map((c) => (
                  <div key={c.label} className="glass p-4 rounded-xl text-center">
                    <div className="w-8 h-8 rounded-full mx-auto mb-2" style={{ backgroundColor: c.color }} />
                    <div className="text-xs font-bold">{c.label}</div>
                    <div className="text-[10px] text-text-muted font-mono">{c.color}</div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-mono text-text-muted mb-2">Homepage Hero Text</label>
              <input defaultValue="Build Together. Grow Together." className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 focus:outline-none focus:border-google-blue text-sm" />
            </div>
            <GlowButton onClick={() => toast.success('Appearance saved')} className="py-3 px-8 flex items-center gap-2">
              <Save size={18} /> Save Appearance
            </GlowButton>
          </div>
        </GradientCard>
      )}

      {/* Danger Zone */}
      {activeTab === 'danger' && (
        <div className="space-y-6">
          <GradientCard className="p-8 border-google-red/30">
            <h3 className="text-xl font-sans font-bold mb-6 flex items-center gap-2 text-google-red"><Shield size={20} /> Danger Zone</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-4 border-b border-white/5">
                <div>
                  <div className="font-bold text-sm">Maintenance Mode</div>
                  <div className="text-xs text-text-muted">Disable public access — only admins can view the site</div>
                </div>
                <input type="checkbox" {...register('maintenanceMode')}
                  className="w-10 h-5 rounded-full bg-white/10 appearance-none checked:bg-google-red relative transition-all cursor-pointer before:absolute before:w-3.5 before:h-3.5 before:bg-white before:rounded-full before:top-[3px] before:left-[3px] checked:before:left-[21px] before:transition-all" />
              </div>
              <div className="flex items-center justify-between py-4 border-b border-white/5">
                <div>
                  <div className="font-bold text-sm">Reset All Points</div>
                  <div className="text-xs text-text-muted">Set all user points to zero</div>
                </div>
                <button onClick={() => { if (window.confirm('This will reset ALL user points to 0. Continue?')) toast.success('Points reset'); }}
                  className="px-4 py-2 rounded-xl text-sm font-bold border border-google-red/50 text-google-red hover:bg-google-red/10 transition-all">
                  Reset Points
                </button>
              </div>
              <div className="flex items-center justify-between py-4">
                <div>
                  <div className="font-bold text-sm">Clear All Data</div>
                  <div className="text-xs text-text-muted">Remove all events, media, and announcements</div>
                </div>
                <button onClick={() => { if (window.confirm('This will delete ALL content. This action is irreversible. Continue?')) toast.success('Data cleared'); }}
                  className="px-4 py-2 rounded-xl text-sm font-bold border border-google-red/50 text-google-red hover:bg-google-red/10 transition-all">
                  Clear Data
                </button>
              </div>
            </div>
          </GradientCard>
        </div>
      )}
    </div>
  );
};
