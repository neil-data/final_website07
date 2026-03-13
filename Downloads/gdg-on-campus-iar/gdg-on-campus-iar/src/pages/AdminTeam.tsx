import React, { useState } from 'react';
import { Plus, Edit, Trash2, X, Save, Search, Crown, Shield } from 'lucide-react';
import { useTeamStore } from '../store/teamStore';
import type { TeamMember } from '../mock/team';
import { Avatar, Badge, GlowButton } from '../components/UI';
import { cn } from '../hooks/useUtils';
import toast from 'react-hot-toast';

const SUB_TEAMS = ['Technical', 'Documentation', 'Marketing', 'Outreach', 'Operations'];

const EMPTY: Omit<TeamMember, 'id'> = {
  name: '', role: '', subTeam: 'Technical', avatar: '', bio: '',
  isLead: false, isCampusLead: false,
  socials: { linkedin: '', gmail: '', github: '' },
};

export const AdminTeam = () => {
  const { members, leads, addMember, editMember, removeMember, addLead, editLead, removeLead } = useTeamStore();
  const [modal, setModal] = useState(false);
  const [isLeadMode, setIsLeadMode] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [search, setSearch] = useState('');
  const [filterTeam, setFilterTeam] = useState('All');

  const openAddMember = () => { setForm({ ...EMPTY }); setEditing(null); setIsLeadMode(false); setModal(true); };
  const openAddLead = () => { setForm({ ...EMPTY, subTeam: 'Leadership', role: 'Campus Lead', isCampusLead: true }); setEditing(null); setIsLeadMode(true); setModal(true); };
  const openEditMember = (m: TeamMember) => { setForm({ ...m }); setEditing(m.id); setIsLeadMode(!!m.isCampusLead); setModal(true); };

  const handleSave = () => {
    if (!form.name || !form.role) { toast.error('Name and role are required'); return; }
    if (isLeadMode) {
      if (editing) { editLead(editing, form); toast.success('Lead updated'); }
      else { addLead(form); toast.success('Lead added'); }
    } else {
      if (editing) { editMember(editing, form); toast.success('Member updated'); }
      else { addMember(form); toast.success('Member added'); }
    }
    setModal(false);
  };

  const handleDelete = (id: string, name: string, isLead: boolean) => {
    if (!window.confirm(`Remove ${name} from the team?`)) return;
    if (isLead) { removeLead(id); } else { removeMember(id); }
    toast.success('Removed');
  };

  const filtered = members.filter((m) =>
    (filterTeam === 'All' || m.subTeam === filterTeam) &&
    m.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <h2 className="text-3xl font-sans font-bold">Team Management</h2>
        <div className="flex gap-3">
          <button onClick={openAddLead} className="glass px-4 py-2 rounded-xl text-sm flex items-center gap-2 hover:bg-white/10 transition-all">
            <Crown size={16} /> Add Campus Lead
          </button>
          <GlowButton onClick={openAddMember} className="py-2 px-5 flex items-center gap-2">
            <Plus size={18} /> Add Member
          </GlowButton>
        </div>
      </div>

      {/* Campus Leads section */}
      {leads.length > 0 && (
        <div>
          <h3 className="text-sm font-mono text-text-muted uppercase tracking-widest mb-4 flex items-center gap-2">
            <Crown size={14} className="text-google-yellow" /> Campus Leads
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {leads.map((lead) => (
              <div key={lead.id} className="glass p-5 rounded-2xl border border-google-yellow/20 flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <Avatar src={lead.avatar} size="md" />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-sans font-bold">{lead.name}</h4>
                      <Badge color="yellow">LEAD</Badge>
                    </div>
                    <p className="text-xs text-text-muted">{lead.bio?.slice(0, 60)}...</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => openEditMember(lead)} className="p-2 hover:bg-white/10 rounded-lg text-google-blue"><Edit size={16} /></button>
                  <button onClick={() => handleDelete(lead.id, lead.name, true)} className="p-2 hover:bg-white/10 rounded-lg text-google-red"><Trash2 size={16} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-grow md:w-64 md:flex-grow-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search members..."
            className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 focus:outline-none focus:border-google-blue text-sm" />
        </div>
        {['All', ...SUB_TEAMS].map((t) => (
          <button key={t} onClick={() => setFilterTeam(t)}
            className={cn('px-4 py-1.5 rounded-full text-xs font-bold transition-all border',
              filterTeam === t ? 'border-google-blue bg-google-blue/20 text-google-blue' : 'border-white/10 text-text-muted hover:text-white')}>
            {t}
          </button>
        ))}
      </div>

      {/* Member list */}
      <div className="grid grid-cols-1 gap-3">
        {filtered.length === 0 && <div className="glass p-10 text-center rounded-2xl text-text-muted">No members found.</div>}
        {filtered.map((m) => (
          <div key={m.id} className="glass p-4 rounded-2xl border border-white/5 flex items-center justify-between group hover:bg-white/[.03] transition-all">
            <div className="flex items-center gap-4">
              <Avatar src={m.avatar} size="md" />
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="font-sans font-bold">{m.name}</h4>
                  {m.isLead && <Badge color="blue">LEAD</Badge>}
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-text-muted font-mono">{m.role}</span>
                  <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 bg-white/5 rounded text-text-muted">{m.subTeam}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => openEditMember(m)} className="p-2 hover:bg-white/10 rounded-lg text-google-blue"><Edit size={16} /></button>
              <button onClick={() => handleDelete(m.id, m.name, false)} className="p-2 hover:bg-white/10 rounded-lg text-google-red"><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
      </div>

      {/* ── Modal ────────────────────────────────────── */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setModal(false)} />
          <div className="relative glass border border-white/10 rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-sans font-bold">{editing ? 'Edit' : 'Add'} {isLeadMode ? 'Campus Lead' : 'Team Member'}</h3>
              <button onClick={() => setModal(false)}><X size={20} /></button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs text-text-muted font-mono mb-1">Name *</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 focus:outline-none focus:border-google-blue text-sm" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-text-muted font-mono mb-1">Role *</label>
                  <input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 focus:outline-none focus:border-google-blue text-sm" />
                </div>
                {!isLeadMode && (
                  <div>
                    <label className="block text-xs text-text-muted font-mono mb-1">Sub-Team</label>
                    <select value={form.subTeam} onChange={(e) => setForm({ ...form, subTeam: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 focus:outline-none focus:border-google-blue text-sm appearance-none">
                      {SUB_TEAMS.map((t) => <option key={t} value={t} className="bg-bg-card">{t}</option>)}
                    </select>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs text-text-muted font-mono mb-1">Avatar URL</label>
                <input value={form.avatar} onChange={(e) => setForm({ ...form, avatar: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 focus:outline-none focus:border-google-blue text-sm" />
              </div>

              <div>
                <label className="block text-xs text-text-muted font-mono mb-1">Bio</label>
                <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} rows={2}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 focus:outline-none focus:border-google-blue text-sm resize-none" />
              </div>

              {!isLeadMode && (
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={!!form.isLead} onChange={(e) => setForm({ ...form, isLead: e.target.checked })}
                      className="w-4 h-4 rounded bg-white/10 accent-google-blue" />
                    <span className="text-sm flex items-center gap-1"><Shield size={14} /> Team Lead</span>
                  </label>
                </div>
              )}

              <div className="border-t border-white/5 pt-4">
                <label className="block text-xs text-text-muted font-mono mb-2">Socials</label>
                <div className="space-y-2">
                  <input value={form.socials?.linkedin || ''} onChange={(e) => setForm({ ...form, socials: { ...form.socials, linkedin: e.target.value } })}
                    placeholder="LinkedIn URL" className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-4 focus:outline-none focus:border-google-blue text-sm" />
                  <input value={form.socials?.github || ''} onChange={(e) => setForm({ ...form, socials: { ...form.socials, github: e.target.value } })}
                    placeholder="GitHub URL" className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-4 focus:outline-none focus:border-google-blue text-sm" />
                  <input value={form.socials?.gmail || ''} onChange={(e) => setForm({ ...form, socials: { ...form.socials, gmail: e.target.value } })}
                    placeholder="Email (mailto:...)" className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-4 focus:outline-none focus:border-google-blue text-sm" />
                </div>
              </div>

              <GlowButton onClick={handleSave} className="w-full py-3 flex items-center justify-center gap-2 mt-2">
                <Save size={18} /> {editing ? 'Update' : 'Add'} {isLeadMode ? 'Lead' : 'Member'}
              </GlowButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
