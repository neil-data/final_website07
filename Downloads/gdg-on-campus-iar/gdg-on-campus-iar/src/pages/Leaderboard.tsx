import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Trophy, Medal, ArrowUp, ArrowDown, Info, Crown } from 'lucide-react';
import { useLeaderboardStore } from '../store/leaderboardStore';
import { Avatar, Badge, GradientCard, FloatingOrb } from '../components/UI';
import { cn } from '../hooks/useUtils';

export const Leaderboard = () => {
  const { overall, eventWise } = useLeaderboardStore();
  const [search, setSearch] = useState('');
  const [activeEventTab, setActiveEventTab] = useState('1');
  const [showAll, setShowAll] = useState(false);

  const filteredOverall = overall.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase())
  );

  const displayUsers = showAll ? filteredOverall.slice(3) : filteredOverall.slice(3, 10);

  const eventTabs = [
    { id: '1', name: 'DevFest 2024' },
    { id: '2', name: 'AI Workshop' },
    { id: '3', name: 'Hackathon 2025' },
    { id: '4', name: 'Cloud Jam' },
  ];

  const currentEventLeaderboard = eventWise[activeEventTab] || [];

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto relative">
      <FloatingOrb color="#FBBC05" size={500} className="-top-20 -right-40 opacity-30" />
      <FloatingOrb color="#4285F4" size={400} className="top-1/2 -left-40 opacity-20" />

      {/* Overall Leaderboard Section */}
      <section className="mb-36">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-16">
          <div>
            <h1 className="text-5xl font-sans font-bold mb-2">Overall Leaderboard</h1>
            <p className="text-text-muted font-mono">Top contributors of the GDG IAR community</p>
          </div>
          
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
            <input
              type="text"
              placeholder="Search members..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-full py-3 pl-12 pr-4 focus:outline-none focus:border-google-blue focus:shadow-[0_0_15px_rgba(66,133,244,0.1)] font-mono transition-all duration-300 placeholder:text-text-muted/50"
            />
          </div>
        </div>

        {/* Podium */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end mb-16">
          {/* 2nd Place */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="order-2 md:order-1"
          >
            <GradientCard className="text-center py-8 px-6 border-t-4 border-t-slate-400">
              <div className="flex flex-col items-center">
                <div className="relative mb-4">
                  <Avatar src={overall[1]?.avatar} size="lg" className="border-slate-400" />
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-slate-400 text-bg-base font-bold rounded-full w-8 h-8 flex items-center justify-center text-sm shadow-lg">2</div>
                </div>
                <h3 className="text-xl font-sans font-bold mb-1 truncate max-w-full">{overall[1]?.name}</h3>
                <p className="text-text-muted text-sm mb-4 truncate max-w-full">{overall[1]?.branch}</p>
                <div className="text-3xl font-bold text-white">{overall[1]?.points} <span className="text-sm font-mono text-text-muted">PTS</span></div>
              </div>
            </GradientCard>
          </motion.div>

          {/* 1st Place */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="order-1 md:order-2"
          >
            <GradientCard className="text-center py-10 px-6 border-t-4 border-t-google-yellow shadow-[0_0_60px_rgba(251,188,5,0.15)]">
              <div className="flex flex-col items-center">
                <div className="flex justify-center mb-3"><Crown className="text-google-yellow" size={28} /></div>
                <div className="relative mb-4">
                  <Avatar src={overall[0]?.avatar} size="lg" className="w-28 h-28 border-google-yellow" />
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-google-yellow text-bg-base font-bold rounded-full w-9 h-9 flex items-center justify-center text-base shadow-lg">1</div>
                </div>
                <h3 className="text-2xl font-sans font-bold mb-1 truncate max-w-full">{overall[0]?.name}</h3>
                <p className="text-text-muted text-sm mb-4 truncate max-w-full">{overall[0]?.branch}</p>
                <div className="text-4xl font-bold text-white">{overall[0]?.points} <span className="text-sm font-mono text-text-muted">PTS</span></div>
              </div>
            </GradientCard>
          </motion.div>

          {/* 3rd Place */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="order-3"
          >
            <GradientCard className="text-center py-8 px-6 border-t-4 border-t-amber-700">
              <div className="flex flex-col items-center">
                <div className="relative mb-4">
                  <Avatar src={overall[2]?.avatar} size="lg" className="border-amber-700" />
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-amber-700 text-bg-base font-bold rounded-full w-8 h-8 flex items-center justify-center text-sm shadow-lg">3</div>
                </div>
                <h3 className="text-xl font-sans font-bold mb-1 truncate max-w-full">{overall[2]?.name}</h3>
                <p className="text-text-muted text-sm mb-4 truncate max-w-full">{overall[2]?.branch}</p>
                <div className="text-3xl font-bold text-white">{overall[2]?.points} <span className="text-sm font-mono text-text-muted">PTS</span></div>
              </div>
            </GradientCard>
          </motion.div>
        </div>

        {/* Full Table */}
        <div className="glass-strong rounded-2xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 text-text-muted text-xs uppercase tracking-widest font-mono">
                <th className="px-6 py-4">Rank</th>
                <th className="px-6 py-4">Member</th>
                <th className="px-6 py-4">Points</th>
                <th className="px-6 py-4 hidden sm:table-cell">Events</th>
                <th className="px-6 py-4 hidden md:table-cell">Badges</th>
              </tr>
            </thead>
            <tbody>
              {displayUsers.map((user, i) => (
                <tr key={user.id} className="border-t border-white/5 hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-lg">#{i + 4}</span>
                      {user.rank && user.rank > i + 4 ? <ArrowUp size={14} className="text-google-green" /> : <ArrowDown size={14} className="text-google-red" />}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar src={user.avatar} size="sm" />
                      <div>
                        <div className="font-bold text-white">{user.name}</div>
                        <div className="text-xs text-text-muted font-mono">{user.branch}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xl font-bold text-white">{user.points}</div>
                  </td>
                  <td className="px-6 py-4 hidden sm:table-cell">
                    <div className="text-sm text-text-muted">{user.eventsAttended} events</div>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    <div className="flex gap-1">
                      {user.badges.slice(0, 2).map((badge: string) => (
                        <div key={badge} className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center" title={badge}>
                          <Medal size={12} />
                        </div>
                      ))}
                      {user.badges.length > 2 && <span className="text-[10px] text-text-muted">+{user.badges.length - 2}</span>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {!showAll && filteredOverall.length > 10 && (
            <div className="p-6 text-center bg-white/5 border-t border-white/5">
              <button 
                onClick={() => setShowAll(true)}
                className="text-google-blue font-sans font-bold hover:underline"
              >
                Show All Members ({filteredOverall.length})
              </button>
            </div>
          )}
          
          {showAll && filteredOverall.length > 10 && (
            <div className="p-6 text-center bg-white/5 border-t border-white/5">
              <button 
                onClick={() => setShowAll(false)}
                className="text-google-blue font-sans font-bold hover:underline"
              >
                Show Top 10 Only
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Event-wise Leaderboard Section */}
      <section>
        <div className="flex items-center gap-4 mb-12">
          <h2 className="text-3xl font-sans font-bold">Event Leaderboard</h2>
          <div className="flex-grow h-[1px] bg-gradient-to-r from-google-blue via-google-red to-google-green animate-gradient-move bg-[length:400%_100%]" />
        </div>

        {/* Tabs */}
        <div className="flex overflow-x-auto gap-4 mb-12 pb-2 no-scrollbar">
          {eventTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveEventTab(tab.id)}
              className={cn(
                "relative px-6 py-3 rounded-xl font-sans font-bold transition-all whitespace-nowrap",
                activeEventTab === tab.id ? "bg-google-blue text-white" : "glass text-text-muted hover:text-white"
              )}
            >
              {tab.name}
              {activeEventTab === tab.id && (
                <motion.div layoutId="activeTab" className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-google-blue rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* Event Leaderboard List */}
        <div className="space-y-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeEventTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              {currentEventLeaderboard.sort((a, b) => b.points - a.points).map((user, i) => (
                <div key={user.id} className="glass-strong p-4 rounded-2xl flex items-center justify-between group hover:bg-white/[0.06] transition-all duration-300 hover:shadow-[0_5px_30px_rgba(0,0,0,0.2)]">
                  <div className="flex items-center gap-6">
                    <div className="w-10 text-center font-bold text-2xl text-text-muted">
                      {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}
                    </div>
                    <div className="flex items-center gap-4">
                      <Avatar src={user.avatar} size="sm" />
                      <div>
                        <div className="font-bold text-white">{user.name}</div>
                        <div className="text-xs text-text-muted font-mono">{user.branch}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-8">
                    <div className="text-right">
                      <div className="text-2xl font-bold text-white">+{user.points}</div>
                      <div className="text-[10px] text-text-muted uppercase tracking-widest">Points Earned</div>
                    </div>
                    <div className="relative group/tooltip">
                      <Info size={18} className="text-text-muted cursor-help" />
                      <div className="absolute bottom-full right-0 mb-2 w-48 glass p-3 rounded-xl opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all z-20 text-xs">
                        <div className="flex justify-between mb-1"><span>Participation</span> <span className="text-google-green">+50</span></div>
                        <div className="flex justify-between mb-1"><span>Submission</span> <span className="text-google-green">+30</span></div>
                        <div className="flex justify-between"><span>Bonus</span> <span className="text-google-green">+20</span></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
};
