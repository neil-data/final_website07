import React, { useState } from 'react';
import { Search, Eye, Edit, Trash2, Award, Ban, X, Save, UserPlus } from 'lucide-react';
import { mockUsers } from '../mock/users';
import { Avatar, Badge, GradientCard, GlowButton } from '../components/UI';
import { cn } from '../hooks/useUtils';
import toast from 'react-hot-toast';

export const AdminUsers = () => {
  const [users, setUsers] = useState(mockUsers);
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('All');
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [modal, setModal] = useState(false);
  const [viewUser, setViewUser] = useState<any | null>(null);

  const filteredUsers = users.filter(u =>
    (filterRole === 'All' || u.role === filterRole) &&
    (u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()))
  );

  const openEdit = (user: any) => { setEditingUser({ ...user }); setModal(true); };
  const openView = (user: any) => { setViewUser(user); };

  const handleSaveUser = () => {
    if (!editingUser) return;
    setUsers(prev => prev.map(u => u.id === editingUser.id ? editingUser : u));
    toast.success('User updated');
    setModal(false); setEditingUser(null);
  };

  const handleDelete = (id: string) => {
    if (!window.confirm('Remove this user?')) return;
    setUsers(prev => prev.filter(u => u.id !== id));
    toast.success('User removed');
  };

  const handleAddPoints = (id: string) => {
    const pts = prompt('Enter points to add/subtract (e.g. 50 or -20):');
    if (pts && !isNaN(Number(pts))) {
      setUsers(prev => prev.map(u => u.id === id ? { ...u, points: u.points + Number(pts) } : u));
      toast.success('Points updated');
    }
  };

  const handleBan = (id: string) => {
    if (!window.confirm('Suspend this user?')) return;
    setUsers(prev => prev.filter(u => u.id !== id));
    toast.success('User suspended');
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <h2 className="text-3xl font-sans font-bold">User Management</h2>
        <div className="text-sm text-text-muted font-mono">{users.length} total users</div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-grow md:w-64 md:flex-grow-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
          <input type="text" placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 focus:outline-none focus:border-google-blue text-sm" />
        </div>
        {['All', 'Admin', 'Core Team', 'Member'].map((r) => (
          <button key={r} onClick={() => setFilterRole(r)}
            className={cn('px-4 py-1.5 rounded-full text-xs font-bold transition-all border',
              filterRole === r ? 'border-google-blue bg-google-blue/20 text-google-blue' : 'border-white/10 text-text-muted hover:text-white')}>
            {r} {r !== 'All' && <span className="ml-1 opacity-60">({users.filter(u => u.role === r).length})</span>}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="glass rounded-2xl overflow-hidden border border-white/5">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 text-text-muted text-[10px] uppercase tracking-widest font-mono">
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Branch</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Points</th>
                <th className="px-6 py-4">Joined</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-t border-white/5 hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar src={user.avatar} size="sm" />
                      <div>
                        <div className="font-bold text-white">{user.name}</div>
                        <div className="text-xs text-text-muted">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-text-muted">{user.branch}</td>
                  <td className="px-6 py-4">
                    <Badge color={user.role === 'Admin' ? 'red' : user.role === 'Core Team' ? 'blue' : 'green'}>{user.role}</Badge>
                  </td>
                  <td className="px-6 py-4 font-bold">{user.points}</td>
                  <td className="px-6 py-4 text-text-muted font-mono text-xs">{user.joinedDate}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openView(user)} className="p-2 hover:bg-white/10 rounded-lg text-text-muted" title="View"><Eye size={16} /></button>
                      <button onClick={() => openEdit(user)} className="p-2 hover:bg-white/10 rounded-lg text-google-blue" title="Edit"><Edit size={16} /></button>
                      <button onClick={() => handleAddPoints(user.id)} className="p-2 hover:bg-white/10 rounded-lg text-google-yellow" title="Edit Points"><Award size={16} /></button>
                      <button onClick={() => handleBan(user.id)} className="p-2 hover:bg-white/10 rounded-lg text-google-red" title="Suspend"><Ban size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── View User Panel ──────────────────────────── */}
      {viewUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setViewUser(null)} />
          <div className="relative glass border border-white/10 rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-sans font-bold">User Profile</h3>
              <button onClick={() => setViewUser(null)}><X size={20} /></button>
            </div>
            <div className="flex items-center gap-4 mb-6">
              <Avatar src={viewUser.avatar} size="lg" />
              <div>
                <div className="text-lg font-bold">{viewUser.name}</div>
                <div className="text-xs text-text-muted">{viewUser.email}</div>
                <Badge color={viewUser.role === 'Admin' ? 'red' : viewUser.role === 'Core Team' ? 'blue' : 'green'} className="mt-1">{viewUser.role}</Badge>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="glass p-3 rounded-xl"><div className="text-[10px] text-text-muted font-mono uppercase">Branch</div><div className="font-bold">{viewUser.branch}</div></div>
              <div className="glass p-3 rounded-xl"><div className="text-[10px] text-text-muted font-mono uppercase">Points</div><div className="font-bold">{viewUser.points}</div></div>
              <div className="glass p-3 rounded-xl"><div className="text-[10px] text-text-muted font-mono uppercase">Events</div><div className="font-bold">{viewUser.eventsAttended}</div></div>
              <div className="glass p-3 rounded-xl"><div className="text-[10px] text-text-muted font-mono uppercase">Joined</div><div className="font-bold">{viewUser.joinedDate}</div></div>
            </div>
            {viewUser.badges?.length > 0 && (
              <div className="mt-4">
                <div className="text-[10px] text-text-muted font-mono uppercase mb-2">Badges</div>
                <div className="flex flex-wrap gap-1.5">
                  {viewUser.badges.map((b: string) => <Badge key={b} color="blue">{b}</Badge>)}
                </div>
              </div>
            )}
            <p className="text-sm text-text-muted mt-4">{viewUser.bio}</p>
          </div>
        </div>
      )}

      {/* ── Edit User Modal ──────────────────────────── */}
      {modal && editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => { setModal(false); setEditingUser(null); }} />
          <div className="relative glass border border-white/10 rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-sans font-bold">Edit User</h3>
              <button onClick={() => { setModal(false); setEditingUser(null); }}><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-text-muted font-mono mb-1">Name</label>
                  <input value={editingUser.name} onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 focus:outline-none focus:border-google-blue text-sm" />
                </div>
                <div>
                  <label className="block text-xs text-text-muted font-mono mb-1">Email</label>
                  <input value={editingUser.email} onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 focus:outline-none focus:border-google-blue text-sm" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-text-muted font-mono mb-1">Role</label>
                  <select value={editingUser.role} onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 focus:outline-none focus:border-google-blue text-sm appearance-none">
                    {['Admin', 'Core Team', 'Member'].map((r) => <option key={r} value={r} className="bg-bg-card">{r}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-text-muted font-mono mb-1">Branch</label>
                  <input value={editingUser.branch} onChange={(e) => setEditingUser({ ...editingUser, branch: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 focus:outline-none focus:border-google-blue text-sm" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-text-muted font-mono mb-1">Points</label>
                  <input type="number" value={editingUser.points} onChange={(e) => setEditingUser({ ...editingUser, points: Number(e.target.value) })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 focus:outline-none focus:border-google-blue text-sm" />
                </div>
                <div>
                  <label className="block text-xs text-text-muted font-mono mb-1">Student ID</label>
                  <input value={editingUser.studentId} onChange={(e) => setEditingUser({ ...editingUser, studentId: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 focus:outline-none focus:border-google-blue text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-xs text-text-muted font-mono mb-1">Bio</label>
                <textarea value={editingUser.bio} onChange={(e) => setEditingUser({ ...editingUser, bio: e.target.value })} rows={2}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 focus:outline-none focus:border-google-blue text-sm resize-none" />
              </div>
              <GlowButton onClick={handleSaveUser} className="w-full py-3 flex items-center justify-center gap-2 mt-2">
                <Save size={18} /> Save Changes
              </GlowButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
