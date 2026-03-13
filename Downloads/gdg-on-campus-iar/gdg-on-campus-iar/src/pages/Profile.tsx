import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Trophy, Star, Calendar, Medal, Edit2, Github, Linkedin, Mail, 
  Camera, ChevronRight, CheckCircle2, Clock, Award, MessageSquare, CheckCircle, Save, X 
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useLeaderboardStore } from '../store/leaderboardStore';
import { useEventsStore } from '../store/eventsStore';
import { useQueryStore } from '../store/queryStore';
import { Avatar, Badge, GlowButton, GradientCard } from '../components/UI';
import { cn } from '../hooks/useUtils';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export const Profile = () => {
  const { user, updateProfile } = useAuthStore();
  const { overall } = useLeaderboardStore();
  const { events } = useEventsStore();
  const { queries } = useQueryStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', bio: '', linkedin: '', github: '' });

  if (!user) return null;

  const userQueries = queries.filter(q => q.userId === user.id);

  const userRankIndex = overall.findIndex(u => u.id === user.id);
  const surroundingUsers = overall.slice(Math.max(0, userRankIndex - 1), Math.min(overall.length, userRankIndex + 2));

  const stats = [
    { label: 'Leaderboard Rank', value: `#${user.rank}`, icon: Trophy, color: 'red' },
    { label: 'Total Points', value: user.points, icon: Star, color: 'blue' },
    { label: 'Events Attended', value: user.eventsAttended, icon: Calendar, color: 'yellow' },
    { label: 'Badges Earned', value: user.badges.length, icon: Medal, color: 'green' },
  ];

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
      {/* Profile Header */}
      <section className="mb-12">
        <GradientCard className="p-8 md:p-12 flex flex-col md:flex-row items-center gap-12">
          <div className="relative group">
            <Avatar src={user.avatar} size="lg" className="w-40 h-40" />
            <button className="absolute bottom-2 right-2 p-3 bg-google-blue text-white rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-lg">
              <Camera size={20} />
            </button>
          </div>

          <div className="flex-grow text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
              <h1 className="text-4xl font-sans font-bold">{user.name}</h1>
              <Badge color="blue">{user.role}</Badge>
            </div>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-6 text-text-muted font-mono text-sm mb-6">
              <span className="flex items-center gap-2"><Award size={16} /> {user.branch}</span>
              <span className="flex items-center gap-2"><Clock size={16} /> ID: {user.studentId}</span>
            </div>

            <p className="text-text-muted max-w-xl mb-8 leading-relaxed">
              {user.bio}
            </p>

            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              <a href={user.socials.linkedin} className="flex items-center gap-2 px-4 py-2 glass rounded-xl hover:text-[#0077b5] transition-all">
                <Linkedin size={18} /> LinkedIn
              </a>
              <a href={user.socials.github} className="flex items-center gap-2 px-4 py-2 glass rounded-xl hover:text-white transition-all">
                <Github size={18} /> GitHub
              </a>
              <GlowButton onClick={() => {
                if (!isEditing) {
                  setEditForm({
                    name: user.name,
                    bio: user.bio,
                    linkedin: user.socials?.linkedin || '',
                    github: user.socials?.github || '',
                  });
                }
                setIsEditing(!isEditing);
              }} className="py-2 px-6">
                {isEditing ? <><X size={18} className="inline mr-2" /> Cancel</> : <><Edit2 size={18} className="inline mr-2" /> Edit Profile</>}
              </GlowButton>
            </div>
          </div>
        </GradientCard>
      </section>

      {/* Edit Profile Form */}
      {isEditing && (
        <motion.section
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <GradientCard className="p-8">
            <h2 className="text-2xl font-sans font-bold mb-6 flex items-center gap-2">
              <Edit2 className="text-google-blue" size={22} /> Edit Profile
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-mono text-text-muted mb-2 uppercase tracking-wider">Full Name</label>
                <input
                  value={editForm.name}
                  onChange={(e) => setEditForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl py-3 px-4 focus:outline-none focus:border-google-blue transition-all duration-300"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-text-muted mb-2 uppercase tracking-wider">Bio</label>
                <input
                  value={editForm.bio}
                  onChange={(e) => setEditForm(f => ({ ...f, bio: e.target.value }))}
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl py-3 px-4 focus:outline-none focus:border-google-blue transition-all duration-300"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-text-muted mb-2 uppercase tracking-wider">LinkedIn URL</label>
                <input
                  value={editForm.linkedin}
                  onChange={(e) => setEditForm(f => ({ ...f, linkedin: e.target.value }))}
                  placeholder="https://linkedin.com/in/..."
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl py-3 px-4 focus:outline-none focus:border-google-blue transition-all duration-300 placeholder:text-text-muted/50"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-text-muted mb-2 uppercase tracking-wider">GitHub URL</label>
                <input
                  value={editForm.github}
                  onChange={(e) => setEditForm(f => ({ ...f, github: e.target.value }))}
                  placeholder="https://github.com/..."
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl py-3 px-4 focus:outline-none focus:border-google-blue transition-all duration-300 placeholder:text-text-muted/50"
                />
              </div>
            </div>
            <div className="flex gap-4 mt-6">
              <GlowButton
                onClick={() => {
                  updateProfile({
                    name: editForm.name,
                    bio: editForm.bio,
                    socials: { ...user.socials, linkedin: editForm.linkedin, github: editForm.github },
                  });
                  setIsEditing(false);
                  toast.success('Profile updated!');
                }}
                className="py-2 px-8"
              >
                <Save size={18} className="inline mr-2" /> Save Changes
              </GlowButton>
              <button
                onClick={() => setIsEditing(false)}
                className="py-2 px-6 glass rounded-xl hover:bg-white/[0.05] transition-all text-text-muted"
              >
                Cancel
              </button>
            </div>
          </GradientCard>
        </motion.section>
      )}

      {/* Stats Row */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <GradientCard className="text-center p-6">
              <div className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4",
                stat.color === 'red' && "bg-google-red/20 text-google-red",
                stat.color === 'blue' && "bg-google-blue/20 text-google-blue",
                stat.color === 'yellow' && "bg-google-yellow/20 text-google-yellow",
                stat.color === 'green' && "bg-google-green/20 text-google-green",
              )}>
                <stat.icon size={24} />
              </div>
              <div className="text-3xl font-bold mb-1">{stat.value}</div>
              <div className="text-xs text-text-muted uppercase tracking-widest font-mono">{stat.label}</div>
            </GradientCard>
          </motion.div>
        ))}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-12">
          {/* My Events */}
          <section>
            <h2 className="text-2xl font-sans font-bold mb-8 flex items-center gap-3">
              <Calendar className="text-google-blue" /> My Events
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {events.slice(0, 2).map((event) => (
                <GradientCard key={event.id} className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <Badge color="green">✓ Completed</Badge>
                    <span className="text-google-green font-bold">+120 PTS</span>
                  </div>
                  <h3 className="text-xl font-sans font-bold mb-2">{event.name}</h3>
                  <p className="text-xs text-text-muted font-mono mb-6">{event.date}</p>
                  <div className="flex items-center gap-2 text-xs text-google-yellow">
                    <Medal size={14} /> Performance: Participant
                  </div>
                </GradientCard>
              ))}
            </div>
            <Link to="/events" className="inline-flex items-center gap-2 text-google-blue mt-8 hover:gap-4 transition-all">
              Explore more events <ChevronRight size={18} />
            </Link>
          </section>

          {/* My Queries */}
          <section>
            <h2 className="text-2xl font-sans font-bold mb-8 flex items-center gap-3">
              <MessageSquare className="text-google-red" /> My Queries
            </h2>
            <div className="space-y-6">
              {userQueries.length === 0 && (
                <div className="glass p-8 text-center rounded-2xl border border-white/5">
                  <p className="text-text-muted text-sm">You haven't submitted any queries yet.</p>
                  <Link to="/contact" className="text-google-blue hover:underline mt-2 inline-block text-sm">Contact us here</Link>
                </div>
              )}
              {userQueries.sort((a, b) => b.createdAt.localeCompare(a.createdAt)).map((query) => (
                <GradientCard key={query.id} className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <h4 className="font-bold">{query.subject}</h4>
                      <Badge color={query.status === 'Solved' ? 'green' : 'yellow'}>
                        {query.status}
                      </Badge>
                    </div>
                    <span className="text-[10px] text-text-muted font-mono uppercase">{new Date(query.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-sm text-text-muted mb-4 italic">"{query.message}"</p>
                  
                  {query.status === 'Solved' && (
                    <div className="bg-google-green/5 border border-google-green/20 p-4 rounded-xl">
                      <div className="flex items-center gap-2 text-google-green mb-2">
                        <CheckCircle size={14} />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Admin Reply</span>
                      </div>
                      <p className="text-sm text-white">{query.reply}</p>
                    </div>
                  )}
                </GradientCard>
              ))}
            </div>
          </section>

          {/* Badges Collection */}
          <section>
            <h2 className="text-2xl font-sans font-bold mb-8 flex items-center gap-3">
              <Medal className="text-google-yellow" /> Badges Collection
            </h2>
            <div className="flex overflow-x-auto gap-6 pb-4 no-scrollbar">
              {user.badges.map((badge: string) => (
                <div key={badge} className="flex-shrink-0 w-32 text-center group">
                  <div className="w-24 h-24 mx-auto glass rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform relative">
                    <div className="absolute inset-0 google-gradient-border rounded-full opacity-50" />
                    <Award size={40} className="text-google-yellow" />
                  </div>
                  <div className="text-sm font-bold mb-1">{badge}</div>
                  <div className="text-[10px] text-text-muted uppercase">Earned</div>
                </div>
              ))}
              {/* Locked Badges */}
              {[1, 2].map((i) => (
                <div key={i} className="flex-shrink-0 w-32 text-center opacity-40 grayscale">
                  <div className="w-24 h-24 mx-auto glass rounded-full flex items-center justify-center mb-4">
                    <Award size={40} className="text-text-muted" />
                  </div>
                  <div className="text-sm font-bold mb-1">Locked Badge</div>
                  <div className="text-[10px] text-text-muted uppercase">Locked</div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column */}
        <div className="space-y-12">
          {/* Leaderboard Standing */}
          <section>
            <h2 className="text-2xl font-sans font-bold mb-8">Leaderboard Standing</h2>
            <div className="glass rounded-2xl overflow-hidden">
              {surroundingUsers.map((u) => (
                <div 
                  key={u.id} 
                  className={cn(
                    "p-4 flex items-center justify-between border-b border-white/5",
                    u.id === user.id ? "bg-google-blue/10 border-l-4 border-l-google-blue" : ""
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-text-muted w-6 text-sm">#{u.rank}</span>
                    <Avatar src={u.avatar} size="sm" />
                    <span className={cn("text-sm font-bold", u.id === user.id ? "text-google-blue" : "text-white")}>{u.name}</span>
                  </div>
                  <span className="font-bold">{u.points}</span>
                </div>
              ))}
            </div>
            <Link to="/leaderboard" className="block text-center text-google-blue mt-6 text-sm hover:underline">
              View Full Leaderboard →
            </Link>
          </section>

          {/* Points History */}
          <section>
            <h2 className="text-2xl font-sans font-bold mb-8">Points History</h2>
            <div className="space-y-6 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[1px] before:bg-white/10">
              {[
                { event: 'DevFest 2024', pts: '+200', date: 'Nov 15, 2024', color: 'bg-google-blue' },
                { event: 'AI Workshop', pts: '+100', date: 'Jan 20, 2025', color: 'bg-google-red' },
                { event: 'Profile Setup', pts: '+50', date: 'Sep 15, 2023', color: 'bg-google-green' },
              ].map((item, i) => (
                <div key={i} className="pl-8 relative">
                  <div className={cn("absolute left-0 top-1.5 w-4 h-4 rounded-full border-4 border-bg-base", item.color)} />
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-bold text-sm">{item.event}</h4>
                    <span className="text-google-green font-bold text-sm">{item.pts}</span>
                  </div>
                  <p className="text-[10px] text-text-muted uppercase font-mono">{item.date}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
