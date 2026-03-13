import React, { useState } from 'react';
import { Link, Routes, Route, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Users, Calendar, Trophy, UserCircle,
  Settings, ArrowLeft, Bell, LogOut, Star, MessageSquare,
  Image, Megaphone, TrendingUp, Activity, ChevronRight, Menu, X,
  type LucideIcon,
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useEventsStore } from '../store/eventsStore';
import { useTeamStore } from '../store/teamStore';
import { useMediaStore } from '../store/mediaStore';
import { useLeaderboardStore } from '../store/leaderboardStore';
import { useQueryStore } from '../store/queryStore';
import { Avatar, Badge } from '../components/UI';
import { cn } from '../hooks/useUtils';
import { BrandLogo } from '../components/BrandLogo';
import { mockUsers } from '../mock/users';

import { AdminUsers } from './AdminUsers';
import { AdminEvents } from './AdminEvents';
import { AdminLeaderboard } from './AdminLeaderboard';
import { AdminTeam } from './AdminTeam';
import { AdminSettings } from './AdminSettings';
import { AdminQueries } from './AdminQueries';
import { AdminMedia } from './AdminMedia';
import { AdminAnnouncements } from './AdminAnnouncements';

/* ── Dashboard Home ──────────────────────────────────── */
const AdminHome = () => {
  const { events } = useEventsStore();
  const { members, leads } = useTeamStore();
  const { posts, announcements } = useMediaStore();
  const { overall } = useLeaderboardStore();
  const { queries } = useQueryStore();

  const totalPoints = overall.reduce((s, u) => s + u.points, 0);
  const pendingQueries = queries.filter((q) => q.status === 'Pending').length;
  const upcomingEvents = events.filter((e) => e.status === 'Upcoming').length;

  const stats = [
    { label: 'Total Users', value: mockUsers.length.toString(), icon: Users, color: 'blue' },
    { label: 'Events', value: events.length.toString(), icon: Calendar, color: 'red' },
    { label: 'Team Members', value: (members.length + leads.length).toString(), icon: UserCircle, color: 'green' },
    { label: 'Media Posts', value: posts.length.toString(), icon: Image, color: 'yellow' },
    { label: 'Announcements', value: announcements.length.toString(), icon: Megaphone, color: 'blue' },
    { label: 'Points Distributed', value: totalPoints > 1000 ? `${(totalPoints / 1000).toFixed(1)}k` : totalPoints.toString(), icon: Star, color: 'yellow' },
    { label: 'Pending Queries', value: pendingQueries.toString(), icon: MessageSquare, color: 'red' },
    { label: 'Upcoming Events', value: upcomingEvents.toString(), icon: TrendingUp, color: 'green' },
  ];

  const statusItems = [
    { text: `${events.length} events configured`, color: 'bg-google-blue', label: 'Events' },
    { text: `${pendingQueries} pending queries need attention`, color: 'bg-google-red', label: 'Queries' },
    { text: `${announcements.filter((a) => a.pinned).length} pinned announcements active`, color: 'bg-google-yellow', label: 'Announcements' },
    { text: `${members.filter((m) => m.isLead).length} team leads assigned`, color: 'bg-google-green', label: 'Team' },
  ];

  const quickLinks: { label: string; path: string; icon: LucideIcon; color: string; desc: string }[] = [
    { label: 'Add Event', path: '/admin/events', icon: Calendar, color: 'text-google-blue', desc: 'Create new event' },
    { label: 'Add Member', path: '/admin/team', icon: UserCircle, color: 'text-google-green', desc: 'Manage team roster' },
    { label: 'Add Media', path: '/admin/media', icon: Image, color: 'text-google-yellow', desc: 'Share on socials' },
    { label: 'Announcement', path: '/admin/announcements', icon: Megaphone, color: 'text-google-red', desc: 'Publish update' },
    { label: 'Queries', path: '/admin/queries', icon: MessageSquare, color: 'text-google-yellow', desc: `${pendingQueries} pending` },
    { label: 'Leaderboard', path: '/admin/leaderboard', icon: Trophy, color: 'text-google-blue', desc: 'Edit rankings' },
  ];

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-4xl font-sans font-bold mb-2">Dashboard</h1>
        <p className="text-text-muted text-sm">Welcome back — here&apos;s what&apos;s happening across your site.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="glass p-5 rounded-2xl border border-white/5 hover:border-white/10 transition-all group">
            <div className={cn(
              'w-9 h-9 rounded-xl flex items-center justify-center mb-3 transition-transform group-hover:scale-110',
              stat.color === 'blue' && 'bg-google-blue/20 text-google-blue',
              stat.color === 'red' && 'bg-google-red/20 text-google-red',
              stat.color === 'yellow' && 'bg-google-yellow/20 text-google-yellow',
              stat.color === 'green' && 'bg-google-green/20 text-google-green',
            )}>
              <stat.icon size={18} />
            </div>
            <div className="text-2xl font-bold mb-0.5">{stat.value}</div>
            <div className="text-[10px] text-text-muted uppercase tracking-widest font-mono">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Quick Actions */}
        <div className="lg:col-span-3">
          <h3 className="text-lg font-sans font-bold mb-4 flex items-center gap-2"><Activity size={18} /> Quick Actions</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {quickLinks.map((ql) => (
              <Link key={ql.label} to={ql.path} className="glass p-5 rounded-2xl border border-white/5 hover:border-white/10 hover:bg-white/5 transition-all group">
                <ql.icon size={22} className={cn(ql.color, 'mb-3 transition-transform group-hover:scale-110')} />
                <div className="font-bold text-sm mb-1">{ql.label}</div>
                <div className="text-[10px] text-text-muted">{ql.desc}</div>
              </Link>
            ))}
          </div>
        </div>

        {/* Status Overview */}
        <div className="lg:col-span-2">
          <h3 className="text-lg font-sans font-bold mb-4 flex items-center gap-2"><Bell size={18} /> Status Overview</h3>
          <div className="glass rounded-2xl border border-white/5 p-5 space-y-5">
            {statusItems.map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className={cn('w-2 h-2 rounded-full mt-1.5 shrink-0', item.color)} />
                <div>
                  <p className="text-sm leading-relaxed">{item.text}</p>
                  <p className="text-[10px] text-text-muted uppercase font-mono mt-1">{item.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ── Sidebar config ──────────────────────────────────── */
const sidebarLinks = [
  { name: 'Dashboard', path: '/admin', icon: LayoutDashboard, end: true },
  { name: 'Events', path: '/admin/events', icon: Calendar },
  { name: 'Team', path: '/admin/team', icon: UserCircle },
  { name: 'Media', path: '/admin/media', icon: Image },
  { name: 'Announcements', path: '/admin/announcements', icon: Megaphone },
  { name: 'Users', path: '/admin/users', icon: Users },
  { name: 'Leaderboard', path: '/admin/leaderboard', icon: Trophy },
  { name: 'Queries', path: '/admin/queries', icon: MessageSquare },
  { name: 'Settings', path: '/admin/settings', icon: Settings },
];

/* ── Admin Shell ─────────────────────────────────────── */
export const AdminDashboard = () => {
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (link: (typeof sidebarLinks)[number]) =>
    link.end ? location.pathname === link.path : location.pathname.startsWith(link.path);

  return (
    <div className="min-h-screen bg-bg-base flex">
      {/* ── Desktop Sidebar ─────────────────────────── */}
      <aside className="hidden lg:flex flex-col w-64 glass border-r border-white/5 fixed h-full z-30">
        <div className="p-6 flex-1 flex flex-col">
          <Link to="/" className="flex items-center gap-2 mb-8">
            <BrandLogo size={32} />
            <span className="font-sans font-bold text-lg">GDG IAR</span>
            <Badge color="red" className="ml-auto text-[9px]">ADMIN</Badge>
          </Link>

          <nav className="space-y-1 flex-1">
            {sidebarLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={cn(
                  'flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all',
                  isActive(link)
                    ? 'bg-google-blue text-white shadow-[0_0_20px_rgba(66,133,244,0.15)]'
                    : 'text-text-muted hover:text-white hover:bg-white/5',
                )}
              >
                <link.icon size={18} />
                {link.name}
                {isActive(link) && <ChevronRight size={14} className="ml-auto" />}
              </Link>
            ))}
          </nav>

          <div className="pt-4 border-t border-white/5 space-y-1">
            <Link to="/" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-text-muted hover:text-white transition-all">
              <ArrowLeft size={18} /> Back to Site
            </Link>
            <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-google-red hover:bg-google-red/10 transition-all">
              <LogOut size={18} /> Logout
            </button>
          </div>
        </div>
      </aside>

      {/* ── Mobile sidebar overlay ──────────────────── */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
          <aside className="relative w-72 glass border-r border-white/5 h-full overflow-y-auto p-6 flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <Link to="/" className="flex items-center gap-2">
                <BrandLogo size={28} />
                <span className="font-sans font-bold">GDG IAR</span>
              </Link>
              <button onClick={() => setMobileOpen(false)}><X size={20} /></button>
            </div>
            <nav className="space-y-1 flex-1">
              {sidebarLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all',
                    isActive(link) ? 'bg-google-blue text-white' : 'text-text-muted hover:text-white hover:bg-white/5',
                  )}
                >
                  <link.icon size={18} />
                  {link.name}
                </Link>
              ))}
            </nav>
            <div className="pt-4 border-t border-white/5 space-y-1">
              <Link to="/" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-text-muted hover:text-white transition-all">
                <ArrowLeft size={18} /> Back to Site
              </Link>
              <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-google-red hover:bg-google-red/10 transition-all">
                <LogOut size={18} /> Logout
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* ── Main Content ────────────────────────────── */}
      <main className="flex-grow lg:ml-64 p-4 md:p-8 pt-20 lg:pt-8">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-8">
          <button className="lg:hidden p-2 glass rounded-xl" onClick={() => setMobileOpen(true)}>
            <Menu size={20} />
          </button>
          <div className="hidden lg:block" />
          <div className="flex items-center gap-4">
            <div className="relative">
              <Bell size={20} className="text-text-muted cursor-pointer hover:text-white transition-colors" />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-google-red rounded-full" />
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-bold">{user?.name}</div>
                <div className="text-[10px] text-text-muted font-mono">Administrator</div>
              </div>
              <Avatar src={user?.avatar} size="sm" />
            </div>
          </div>
        </div>

        <Routes>
          <Route path="/" element={<AdminHome />} />
          <Route path="/events" element={<AdminEvents />} />
          <Route path="/team" element={<AdminTeam />} />
          <Route path="/media" element={<AdminMedia />} />
          <Route path="/announcements" element={<AdminAnnouncements />} />
          <Route path="/users" element={<AdminUsers />} />
          <Route path="/leaderboard" element={<AdminLeaderboard />} />
          <Route path="/queries" element={<AdminQueries />} />
          <Route path="/settings" element={<AdminSettings />} />
        </Routes>
      </main>
    </div>
  );
};
