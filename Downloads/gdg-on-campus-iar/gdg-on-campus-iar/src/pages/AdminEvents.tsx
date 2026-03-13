import React, { useState } from 'react';
import { Plus, Edit, Trash2, Calendar, MapPin, Users, X, Save, Search } from 'lucide-react';
import { useEventsStore } from '../store/eventsStore';
import { Badge, GlowButton } from '../components/UI';
import { cn } from '../hooks/useUtils';
import toast from 'react-hot-toast';

const EMPTY_EVENT = {
  name: '', type: 'Workshop', date: '', time: '', location: '',
  description: '', status: 'Upcoming', registeredCount: 0, points: 0,
  tags: [] as string[], roadmapPosition: 0,
};

export const AdminEvents = () => {
  const { events, addEvent, editEvent, removeEvent } = useEventsStore();
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_EVENT);
  const [tagInput, setTagInput] = useState('');
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  const openAdd = () => { setForm(EMPTY_EVENT); setEditing(null); setTagInput(''); setModal(true); };
  const openEdit = (evt: any) => {
    setForm({ ...evt });
    setEditing(evt.id);
    setTagInput('');
    setModal(true);
  };

  const handleSave = () => {
    if (!form.name || !form.date) { toast.error('Name and date are required'); return; }
    if (editing) {
      editEvent(editing, form);
      toast.success('Event updated');
    } else {
      addEvent({ ...form, roadmapPosition: events.length + 1 });
      toast.success('Event created');
    }
    setModal(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this event?')) {
      removeEvent(id);
      toast.success('Event removed');
    }
  };

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !form.tags.includes(t)) setForm({ ...form, tags: [...form.tags, t] });
    setTagInput('');
  };

  const filtered = events.filter((e) =>
    (filterStatus === 'All' || e.status === filterStatus) &&
    e.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <h2 className="text-3xl font-sans font-bold">Event Management</h2>
        <GlowButton onClick={openAdd} className="py-2 px-6 flex items-center gap-2">
          <Plus size={18} /> Add Event
        </GlowButton>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-grow md:w-64 md:flex-grow-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search events..."
            className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 focus:outline-none focus:border-google-blue text-sm" />
        </div>
        {['All', 'Upcoming', 'Completed'].map((s) => (
          <button key={s} onClick={() => setFilterStatus(s)}
            className={cn('px-4 py-1.5 rounded-full text-xs font-bold transition-all border',
              filterStatus === s ? 'border-google-blue bg-google-blue/20 text-google-blue' : 'border-white/10 text-text-muted hover:text-white')}>
            {s}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="grid grid-cols-1 gap-4">
        {filtered.length === 0 && <div className="glass p-10 text-center rounded-2xl text-text-muted">No events found.</div>}
        {filtered.map((event) => (
          <div key={event.id} className="glass p-5 rounded-2xl border border-white/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 group hover:bg-white/[.03] transition-all">
            <div className="flex items-center gap-5 w-full md:w-auto">
              <div className={cn('w-11 h-11 rounded-xl flex items-center justify-center shrink-0',
                event.type === 'DevFest' ? 'bg-google-blue/20 text-google-blue' :
                event.type === 'Hackathon' ? 'bg-google-red/20 text-google-red' :
                event.type === 'Study Jam' ? 'bg-google-green/20 text-google-green' :
                'bg-google-yellow/20 text-google-yellow')}>
                <Calendar size={22} />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1 flex-wrap">
                  <h3 className="text-lg font-sans font-bold">{event.name}</h3>
                  <Badge color={event.status === 'Completed' ? 'green' : 'blue'}>{event.status}</Badge>
                  <Badge color="yellow">{event.points} pts</Badge>
                </div>
                <div className="flex items-center gap-4 text-xs text-text-muted font-mono flex-wrap">
                  <span className="flex items-center gap-1"><Calendar size={12} /> {event.date}</span>
                  <span className="flex items-center gap-1"><MapPin size={12} /> {event.location}</span>
                  <span className="flex items-center gap-1"><Users size={12} /> {event.registeredCount} Reg.</span>
                </div>
                {event.tags?.length > 0 && (
                  <div className="flex gap-1.5 mt-2 flex-wrap">
                    {event.tags.map((t: string) => (
                      <span key={t} className="text-[10px] bg-white/5 px-2 py-0.5 rounded-full text-text-muted">{t}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button onClick={() => openEdit(event)} className="p-2.5 glass rounded-xl hover:text-google-blue transition-colors" title="Edit"><Edit size={16} /></button>
              <button onClick={() => handleDelete(event.id)} className="p-2.5 glass rounded-xl hover:text-google-red transition-colors" title="Delete"><Trash2 size={16} /></button>
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
              <h3 className="text-xl font-sans font-bold">{editing ? 'Edit Event' : 'New Event'}</h3>
              <button onClick={() => setModal(false)}><X size={20} /></button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs text-text-muted font-mono mb-1">Event Name *</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 focus:outline-none focus:border-google-blue text-sm" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-text-muted font-mono mb-1">Type</label>
                  <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 focus:outline-none focus:border-google-blue text-sm appearance-none">
                    {['Workshop', 'DevFest', 'Hackathon', 'Study Jam', 'Meetup', 'Tech Talk'].map((t) => (
                      <option key={t} value={t} className="bg-bg-card">{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-text-muted font-mono mb-1">Status</label>
                  <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 focus:outline-none focus:border-google-blue text-sm appearance-none">
                    {['Upcoming', 'Completed'].map((s) => (
                      <option key={s} value={s} className="bg-bg-card">{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-text-muted font-mono mb-1">Date *</label>
                  <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 focus:outline-none focus:border-google-blue text-sm" />
                </div>
                <div>
                  <label className="block text-xs text-text-muted font-mono mb-1">Time</label>
                  <input value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} placeholder="e.g. 10:00 AM"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 focus:outline-none focus:border-google-blue text-sm" />
                </div>
              </div>

              <div>
                <label className="block text-xs text-text-muted font-mono mb-1">Location</label>
                <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 focus:outline-none focus:border-google-blue text-sm" />
              </div>

              <div>
                <label className="block text-xs text-text-muted font-mono mb-1">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 focus:outline-none focus:border-google-blue text-sm resize-none" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-text-muted font-mono mb-1">Points</label>
                  <input type="number" value={form.points} onChange={(e) => setForm({ ...form, points: Number(e.target.value) })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 focus:outline-none focus:border-google-blue text-sm" />
                </div>
                <div>
                  <label className="block text-xs text-text-muted font-mono mb-1">Registered</label>
                  <input type="number" value={form.registeredCount} onChange={(e) => setForm({ ...form, registeredCount: Number(e.target.value) })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 focus:outline-none focus:border-google-blue text-sm" />
                </div>
              </div>

              <div>
                <label className="block text-xs text-text-muted font-mono mb-1">Tags</label>
                <div className="flex gap-2">
                  <input value={tagInput} onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    placeholder="Type & press Enter"
                    className="flex-grow bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 focus:outline-none focus:border-google-blue text-sm" />
                  <button onClick={addTag} type="button" className="px-4 glass rounded-xl text-sm hover:bg-white/10">Add</button>
                </div>
                {form.tags.length > 0 && (
                  <div className="flex gap-1.5 mt-2 flex-wrap">
                    {form.tags.map((t) => (
                      <span key={t} className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                        {t} <button onClick={() => setForm({ ...form, tags: form.tags.filter((x) => x !== t) })} className="hover:text-google-red">&times;</button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <GlowButton onClick={handleSave} className="w-full py-3 flex items-center justify-center gap-2 mt-2">
                <Save size={18} /> {editing ? 'Update Event' : 'Create Event'}
              </GlowButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
