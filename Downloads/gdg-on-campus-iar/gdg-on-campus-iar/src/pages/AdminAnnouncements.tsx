import React, { useState } from 'react';
import { Plus, Edit, Trash2, X, Save, Search, Pin, PinOff, Calendar, Zap, Trophy, Info, Megaphone, type LucideIcon } from 'lucide-react';
import { useMediaStore } from '../store/mediaStore';
import type { Announcement } from '../mock/media';
import { Badge, GlowButton } from '../components/UI';
import { cn } from '../hooks/useUtils';
import toast from 'react-hot-toast';

const TYPES = ['event', 'update', 'achievement', 'general'] as const;
const TYPE_META: Record<string, { icon: LucideIcon; color: string; label: string }> = {
  event: { icon: Calendar, color: 'text-google-blue', label: 'Event' },
  update: { icon: Zap, color: 'text-google-green', label: 'Update' },
  achievement: { icon: Trophy, color: 'text-google-yellow', label: 'Achievement' },
  general: { icon: Info, color: 'text-text-muted', label: 'General' },
};

const EMPTY: Omit<Announcement, 'id'> = {
  title: '', description: '', date: '', type: 'general', link: '', pinned: false,
};

export const AdminAnnouncements = () => {
  const { announcements, addAnnouncement, editAnnouncement, removeAnnouncement, togglePin } = useMediaStore();
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('All');

  const openAdd = () => { setForm({ ...EMPTY, date: new Date().toISOString().split('T')[0] }); setEditing(null); setModal(true); };
  const openEdit = (a: Announcement) => { setForm({ ...a }); setEditing(a.id); setModal(true); };

  const handleSave = () => {
    if (!form.title) { toast.error('Title is required'); return; }
    if (editing) { editAnnouncement(editing, form); toast.success('Announcement updated'); }
    else { addAnnouncement(form); toast.success('Announcement published'); }
    setModal(false);
  };

  const handleDelete = (id: string) => {
    if (!window.confirm('Delete this announcement?')) return;
    removeAnnouncement(id);
    toast.success('Announcement removed');
  };

  const sorted = [...announcements]
    .filter((a) => (filterType === 'All' || a.type === filterType) && a.title.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => (a.pinned === b.pinned ? b.date.localeCompare(a.date) : a.pinned ? -1 : 1));

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <h2 className="text-3xl font-sans font-bold">Announcements</h2>
        <GlowButton onClick={openAdd} className="py-2 px-6 flex items-center gap-2">
          <Plus size={18} /> New Announcement
        </GlowButton>
      </div>

      {/* Type stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {TYPES.map((t) => {
          const meta = TYPE_META[t];
          const count = announcements.filter((a) => a.type === t).length;
          return (
            <button key={t} onClick={() => setFilterType(filterType === t ? 'All' : t)}
              className={cn('glass p-4 rounded-2xl border transition-all text-left',
                filterType === t ? 'border-white/20 bg-white/5' : 'border-white/5 hover:border-white/10')}>
              <meta.icon size={20} className={meta.color} />
              <div className="text-2xl font-bold mt-2">{count}</div>
              <div className="text-[10px] text-text-muted uppercase tracking-widest font-mono">{meta.label}</div>
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div className="relative md:w-72">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search announcements..."
          className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 focus:outline-none focus:border-google-blue text-sm" />
      </div>

      {/* List */}
      <div className="grid grid-cols-1 gap-4">
        {sorted.length === 0 && <div className="glass p-10 text-center rounded-2xl text-text-muted">No announcements found.</div>}
        {sorted.map((ann) => {
          const meta = TYPE_META[ann.type];
          return (
            <div key={ann.id} className={cn('glass p-5 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group hover:bg-white/[.03] transition-all',
              ann.pinned ? 'border-google-yellow/30' : 'border-white/5')}>
              <div className="flex items-start gap-4 min-w-0">
                <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5',
                  ann.type === 'event' ? 'bg-google-blue/20' : ann.type === 'update' ? 'bg-google-green/20' :
                  ann.type === 'achievement' ? 'bg-google-yellow/20' : 'bg-white/10')}>
                  <meta.icon size={18} className={meta.color} />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    {ann.pinned && <Pin size={12} className="text-google-yellow" />}
                    <h4 className="font-sans font-bold">{ann.title}</h4>
                    <Badge color={ann.type === 'event' ? 'blue' : ann.type === 'achievement' ? 'yellow' : ann.type === 'update' ? 'green' : 'blue'}>{meta.label}</Badge>
                  </div>
                  <p className="text-xs text-text-muted line-clamp-1">{ann.description}</p>
                  <div className="text-[10px] text-text-muted font-mono mt-1">{ann.date}{ann.link && <span className="ml-2">→ {ann.link}</span>}</div>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => togglePin(ann.id)} className="p-2 hover:bg-white/10 rounded-lg transition-colors" title={ann.pinned ? 'Unpin' : 'Pin'}>
                  {ann.pinned ? <PinOff size={16} className="text-google-yellow" /> : <Pin size={16} className="text-text-muted" />}
                </button>
                <button onClick={() => openEdit(ann)} className="p-2 hover:bg-white/10 rounded-lg text-google-blue"><Edit size={16} /></button>
                <button onClick={() => handleDelete(ann.id)} className="p-2 hover:bg-white/10 rounded-lg text-google-red"><Trash2 size={16} /></button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Modal ────────────────────────────────────── */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setModal(false)} />
          <div className="relative glass border border-white/10 rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-sans font-bold">{editing ? 'Edit' : 'New'} Announcement</h3>
              <button onClick={() => setModal(false)}><X size={20} /></button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs text-text-muted font-mono mb-1">Title *</label>
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 focus:outline-none focus:border-google-blue text-sm" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-text-muted font-mono mb-1">Type</label>
                  <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as any })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 focus:outline-none focus:border-google-blue text-sm appearance-none">
                    {TYPES.map((t) => <option key={t} value={t} className="bg-bg-card">{TYPE_META[t].label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-text-muted font-mono mb-1">Date</label>
                  <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 focus:outline-none focus:border-google-blue text-sm" />
                </div>
              </div>

              <div>
                <label className="block text-xs text-text-muted font-mono mb-1">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 focus:outline-none focus:border-google-blue text-sm resize-none" />
              </div>

              <div>
                <label className="block text-xs text-text-muted font-mono mb-1">Link (optional)</label>
                <input value={form.link || ''} onChange={(e) => setForm({ ...form, link: e.target.value })} placeholder="/events or https://..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 focus:outline-none focus:border-google-blue text-sm" />
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={!!form.pinned} onChange={(e) => setForm({ ...form, pinned: e.target.checked })}
                  className="w-4 h-4 rounded bg-white/10 accent-google-yellow" />
                <span className="text-sm flex items-center gap-1"><Pin size={14} /> Pin this announcement</span>
              </label>

              <GlowButton onClick={handleSave} className="w-full py-3 flex items-center justify-center gap-2 mt-2">
                <Save size={18} /> {editing ? 'Update' : 'Publish'} Announcement
              </GlowButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
