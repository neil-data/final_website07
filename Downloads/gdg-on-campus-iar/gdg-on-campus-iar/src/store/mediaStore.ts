import { create } from 'zustand';
import {
  MediaPost,
  Announcement,
  mockMedia,
  mockAnnouncements,
} from '../mock/media';

const POSTS_KEY = 'gdg-media-posts';
const ANN_KEY = 'gdg-announcements';

const loadPosts = (): MediaPost[] => {
  try { const s = localStorage.getItem(POSTS_KEY); if (s) return JSON.parse(s); } catch {}
  return mockMedia;
};
const loadAnnouncements = (): Announcement[] => {
  try { const s = localStorage.getItem(ANN_KEY); if (s) return JSON.parse(s); } catch {}
  return mockAnnouncements;
};
const savePosts = (p: MediaPost[]) => { try { localStorage.setItem(POSTS_KEY, JSON.stringify(p)); } catch {} };
const saveAnn = (a: Announcement[]) => { try { localStorage.setItem(ANN_KEY, JSON.stringify(a)); } catch {} };

interface MediaState {
  posts: MediaPost[];
  announcements: Announcement[];
  addPost: (post: Omit<MediaPost, 'id'>) => void;
  editPost: (id: string, updates: Partial<MediaPost>) => void;
  removePost: (id: string) => void;
  addAnnouncement: (ann: Omit<Announcement, 'id'>) => void;
  editAnnouncement: (id: string, updates: Partial<Announcement>) => void;
  removeAnnouncement: (id: string) => void;
  togglePin: (id: string) => void;
}

export const useMediaStore = create<MediaState>((set) => ({
  posts: loadPosts(),
  announcements: loadAnnouncements(),

  addPost: (post) =>
    set((s) => {
      const posts = [{ ...post, id: `media-${Date.now()}` }, ...s.posts];
      savePosts(posts);
      return { posts };
    }),

  editPost: (id, updates) =>
    set((s) => {
      const posts = s.posts.map((p) => (p.id === id ? { ...p, ...updates } : p));
      savePosts(posts);
      return { posts };
    }),

  removePost: (id) =>
    set((s) => {
      const posts = s.posts.filter((p) => p.id !== id);
      savePosts(posts);
      return { posts };
    }),

  addAnnouncement: (ann) =>
    set((s) => {
      const announcements = [{ ...ann, id: `ann-${Date.now()}` }, ...s.announcements];
      saveAnn(announcements);
      return { announcements };
    }),

  editAnnouncement: (id, updates) =>
    set((s) => {
      const announcements = s.announcements.map((a) => (a.id === id ? { ...a, ...updates } : a));
      saveAnn(announcements);
      return { announcements };
    }),

  removeAnnouncement: (id) =>
    set((s) => {
      const announcements = s.announcements.filter((a) => a.id !== id);
      saveAnn(announcements);
      return { announcements };
    }),

  togglePin: (id) =>
    set((s) => {
      const announcements = s.announcements.map((a) => (a.id === id ? { ...a, pinned: !a.pinned } : a));
      saveAnn(announcements);
      return { announcements };
    }),
}));
