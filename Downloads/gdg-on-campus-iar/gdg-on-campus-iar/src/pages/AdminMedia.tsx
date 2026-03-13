import React, { useState } from 'react';
import { Plus, Edit, Trash2, X, Save, Search, Image, Linkedin, Youtube, Instagram, Twitter, ExternalLink, type LucideIcon } from 'lucide-react';
import { useMediaStore } from '../store/mediaStore';
import type { MediaPost } from '../mock/media';
import { Badge, GlowButton } from '../components/UI';
import { cn } from '../hooks/useUtils';
import toast from 'react-hot-toast';

const PLATFORMS = ['linkedin', 'instagram', 'twitter', 'youtube'] as const;
const PLATFORM_META: Record<string, { icon: LucideIcon; color: string; label: string }> = {
  linkedin: { icon: Linkedin, color: 'text-[#0077b5]', label: 'LinkedIn' },
  instagram: { icon: Instagram, color: 'text-[#E4405F]', label: 'Instagram' },
  twitter: { icon: Twitter, color: 'text-white', label: 'Twitter / X' },
  youtube: { icon: Youtube, color: 'text-[#FF0000]', label: 'YouTube' },
};

const EMPTY: Omit<MediaPost, 'id'> = {
  platform: 'linkedin', title: '', description: '', thumbnail: '', url: '', date: '', author: '',
};

export const AdminMedia = () => {
  const { posts, addPost, editPost, removePost } = useMediaStore();
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [search, setSearch] = useState('');
  const [filterPlatform, setFilterPlatform] = useState('All');

  const openAdd = () => { setForm({ ...EMPTY, date: new Date().toISOString().split('T')[0] }); setEditing(null); setModal(true); };
  const openEdit = (p: MediaPost) => { setForm({ ...p }); setEditing(p.id); setModal(true); };

  const handleSave = () => {
    if (!form.title || !form.url) { toast.error('Title and URL are required'); return; }
    if (editing) { editPost(editing, form); toast.success('Post updated'); }
    else { addPost(form); toast.success('Post added'); }
    setModal(false);
  };

  const handleDelete = (id: string) => {
    if (!window.confirm('Delete this media post?')) return;
    removePost(id);
    toast.success('Post removed');
  };

  const filtered = posts.filter((p) =>
    (filterPlatform === 'All' || p.platform === filterPlatform) &&
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <h2 className="text-3xl font-sans font-bold">Media Management</h2>
        <GlowButton onClick={openAdd} className="py-2 px-6 flex items-center gap-2">
          <Plus size={18} /> Add Media Post
        </GlowButton>
      </div>

      {/* Platform stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {PLATFORMS.map((p) => {
          const meta = PLATFORM_META[p];
          const count = posts.filter((x) => x.platform === p).length;
          return (
            <button key={p} onClick={() => setFilterPlatform(filterPlatform === p ? 'All' : p)}
              className={cn('glass p-4 rounded-2xl border transition-all text-left',
                filterPlatform === p ? 'border-white/20 bg-white/5' : 'border-white/5 hover:border-white/10')}>
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
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search posts..."
          className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 focus:outline-none focus:border-google-blue text-sm" />
      </div>

      {/* List */}
      <div className="grid grid-cols-1 gap-4">
        {filtered.length === 0 && <div className="glass p-10 text-center rounded-2xl text-text-muted">No media posts found.</div>}
        {filtered.map((post) => {
          const meta = PLATFORM_META[post.platform];
          return (
            <div key={post.id} className="glass p-4 rounded-2xl border border-white/5 flex items-center justify-between group hover:bg-white/[.03] transition-all gap-4">
              <div className="flex items-center gap-4 min-w-0">
                {post.thumbnail && (
                  <img src={post.thumbnail} alt="" className="w-16 h-12 rounded-lg object-cover shrink-0" />
                )}
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <h4 className="font-sans font-bold truncate">{post.title}</h4>
                    <span className={cn('flex items-center gap-1 text-xs', meta.color)}>
                      <meta.icon size={12} /> {meta.label}
                    </span>
                  </div>
                  <div className="text-xs text-text-muted font-mono flex items-center gap-3">
                    <span>{post.date}</span>
                    {post.author && <span>by {post.author}</span>}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <a href={post.url} target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-white/10 rounded-lg text-text-muted"><ExternalLink size={16} /></a>
                <button onClick={() => openEdit(post)} className="p-2 hover:bg-white/10 rounded-lg text-google-blue"><Edit size={16} /></button>
                <button onClick={() => handleDelete(post.id)} className="p-2 hover:bg-white/10 rounded-lg text-google-red"><Trash2 size={16} /></button>
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
              <h3 className="text-xl font-sans font-bold">{editing ? 'Edit' : 'New'} Media Post</h3>
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
                  <label className="block text-xs text-text-muted font-mono mb-1">Platform</label>
                  <select value={form.platform} onChange={(e) => setForm({ ...form, platform: e.target.value as any })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 focus:outline-none focus:border-google-blue text-sm appearance-none">
                    {PLATFORMS.map((p) => <option key={p} value={p} className="bg-bg-card">{PLATFORM_META[p].label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-text-muted font-mono mb-1">Date</label>
                  <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 focus:outline-none focus:border-google-blue text-sm" />
                </div>
              </div>

              <div>
                <label className="block text-xs text-text-muted font-mono mb-1">Post URL *</label>
                <input value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 focus:outline-none focus:border-google-blue text-sm" />
              </div>

              <div>
                <label className="block text-xs text-text-muted font-mono mb-1">Thumbnail URL</label>
                <input value={form.thumbnail} onChange={(e) => setForm({ ...form, thumbnail: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 focus:outline-none focus:border-google-blue text-sm" />
              </div>

              <div>
                <label className="block text-xs text-text-muted font-mono mb-1">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 focus:outline-none focus:border-google-blue text-sm resize-none" />
              </div>

              <div>
                <label className="block text-xs text-text-muted font-mono mb-1">Author</label>
                <input value={form.author || ''} onChange={(e) => setForm({ ...form, author: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 focus:outline-none focus:border-google-blue text-sm" />
              </div>

              <GlowButton onClick={handleSave} className="w-full py-3 flex items-center justify-center gap-2 mt-2">
                <Save size={18} /> {editing ? 'Update' : 'Create'} Post
              </GlowButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
