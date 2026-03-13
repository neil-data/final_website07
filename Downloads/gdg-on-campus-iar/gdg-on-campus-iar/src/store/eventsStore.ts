import { create } from 'zustand';
import { mockEvents } from '../mock/events';

const STORAGE_KEY = 'gdg-events';

const loadEvents = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return mockEvents;
};

const persistEvents = (events: any[]) => {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(events)); } catch {}
};

interface EventsState {
  events: any[];
  registerForEvent: (eventId: string) => void;
  addEvent: (event: any) => void;
  editEvent: (id: string, updates: any) => void;
  removeEvent: (id: string) => void;
}

export const useEventsStore = create<EventsState>((set) => ({
  events: loadEvents(),
  registerForEvent: (eventId) => set((state) => {
    const events = state.events.map(e =>
      e.id === eventId ? { ...e, registeredCount: e.registeredCount + 1 } : e
    );
    persistEvents(events);
    return { events };
  }),
  addEvent: (event) => set((state) => {
    const events = [...state.events, { ...event, id: Date.now().toString() }];
    persistEvents(events);
    return { events };
  }),
  editEvent: (id, updates) => set((state) => {
    const events = state.events.map(e => e.id === id ? { ...e, ...updates } : e);
    persistEvents(events);
    return { events };
  }),
  removeEvent: (id) => set((state) => {
    const events = state.events.filter(e => e.id !== id);
    persistEvents(events);
    return { events };
  }),
}));
