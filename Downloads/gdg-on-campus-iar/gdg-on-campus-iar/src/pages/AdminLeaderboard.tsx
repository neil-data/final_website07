import React, { useState } from 'react';
import { Search, Edit, RefreshCw, Trophy, TrendingUp, TrendingDown, Minus, X, Save } from 'lucide-react';
import { useLeaderboardStore } from '../store/leaderboardStore';
import { Avatar, Badge, GlowButton } from '../components/UI';
import { cn } from '../hooks/useUtils';
import toast from 'react-hot-toast';

export const AdminLeaderboard = () => {
  const { overall, editPoints, recalculate } = useLeaderboardStore();
  const [search, setSearch] = useState('');
  const [editModal, setEditModal] = useState<{ id: string; name: string; points: number } | null>(null);
  const [pointsDelta, setPointsDelta] = useState('');

  const handleRecalculate = () => { recalculate(); toast.success('Rankings recalculated'); };

  const openEditPoints = (user: any) => {
    setEditModal({ id: user.id, name: user.name, points: user.points });
    setPointsDelta('');
  };

  const handleApplyPoints = () => {
    if (!editModal || !pointsDelta || isNaN(Number(pointsDelta))) return;
    editPoints(editModal.id, Number(pointsDelta));
    toast.success(`${Number(pointsDelta) > 0 ? '+' : ''}${pointsDelta} points applied to ${editModal.name}`);
    setEditModal(null);
  };

  const filtered = overall.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalPoints = overall.reduce((s, u) => s + u.points, 0);
  const avgPoints = overall.length > 0 ? Math.round(totalPoints / overall.length) : 0;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <h2 className="text-3xl font-sans font-bold">Leaderboard Control</h2>
        <GlowButton onClick={handleRecalculate} className="py-2 px-6 flex items-center gap-2">
          <RefreshCw size={18} /> Recalculate Rankings
        </GlowButton>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass p-4 rounded-2xl border border-white/5">
          <Trophy size={18} className="text-google-yellow mb-2" />
          <div className="text-2xl font-bold">{overall.length}</div>
          <div className="text-[10px] text-text-muted uppercase tracking-widest font-mono">Ranked Users</div>
        </div>
        <div className="glass p-4 rounded-2xl border border-white/5">
          <TrendingUp size={18} className="text-google-green mb-2" />
          <div className="text-2xl font-bold">{overall[0]?.points || 0}</div>
          <div className="text-[10px] text-text-muted uppercase tracking-widest font-mono">Highest Score</div>
        </div>
        <div className="glass p-4 rounded-2xl border border-white/5">
          <Minus size={18} className="text-google-blue mb-2" />
          <div className="text-2xl font-bold">{avgPoints}</div>
          <div className="text-[10px] text-text-muted uppercase tracking-widest font-mono">Average Points</div>
        </div>
        <div className="glass p-4 rounded-2xl border border-white/5">
          <TrendingDown size={18} className="text-google-red mb-2" />
          <div className="text-2xl font-bold">{totalPoints > 1000 ? `${(totalPoints / 1000).toFixed(1)}k` : totalPoints}</div>
          <div className="text-[10px] text-text-muted uppercase tracking-widest font-mono">Total Points</div>
        </div>
      </div>

      {/* Search */}
      <div className="relative md:w-72">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search users..."
          className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 focus:outline-none focus:border-google-blue text-sm" />
      </div>

      {/* Table */}
      <div className="glass rounded-2xl overflow-hidden border border-white/5">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/5 text-text-muted text-[10px] uppercase tracking-widest font-mono">
              <th className="px-6 py-4 w-16">Rank</th>
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Points</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {filtered.map((user, i) => (
              <tr key={user.id} className="border-t border-white/5 hover:bg-white/5 transition-colors group">
                <td className="px-6 py-4">
                  <span className={cn('text-lg font-bold',
                    i === 0 ? 'text-google-yellow' : i === 1 ? 'text-gray-400' : i === 2 ? 'text-amber-700' : 'text-text-muted')}>
                    #{i + 1}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <Avatar src={user.avatar} size="sm" />
                    <div>
                      <div className="font-bold text-white">{user.name}</div>
                      <div className="text-xs text-text-muted">{user.branch}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="font-bold text-xl">{user.points}</span>
                  <span className="text-[10px] text-text-muted ml-1">pts</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => openEditPoints(user)}
                    className="glass px-4 py-2 rounded-xl text-xs font-bold hover:bg-white/10 transition-all flex items-center gap-2 ml-auto opacity-0 group-hover:opacity-100">
                    <Edit size={14} /> Edit Points
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Edit Points Modal ────────────────────────── */}
      {editModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setEditModal(null)} />
          <div className="relative glass border border-white/10 rounded-2xl p-6 w-full max-w-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-sans font-bold">Edit Points</h3>
              <button onClick={() => setEditModal(null)}><X size={20} /></button>
            </div>
            <div className="text-center mb-6">
              <div className="font-bold text-lg">{editModal.name}</div>
              <div className="text-text-muted text-sm">Current: <span className="font-bold text-white">{editModal.points}</span> pts</div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-text-muted font-mono mb-1">Points to Add/Subtract</label>
                <input type="number" value={pointsDelta} onChange={(e) => setPointsDelta(e.target.value)} placeholder="e.g. 50 or -20"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 focus:outline-none focus:border-google-blue text-sm text-center text-xl font-bold" />
              </div>
              {pointsDelta && !isNaN(Number(pointsDelta)) && (
                <div className="text-center text-sm text-text-muted">
                  New total: <span className="font-bold text-white">{editModal.points + Number(pointsDelta)}</span> pts
                </div>
              )}
              <GlowButton onClick={handleApplyPoints} className="w-full py-3 flex items-center justify-center gap-2">
                <Save size={18} /> Apply Changes
              </GlowButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
