import { create } from 'zustand';
import { mockUsers } from '../mock/users';

const STORAGE_KEY = 'gdg-auth';

const loadPersistedAuth = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return null;
};

const persistAuth = (user: any) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  } catch {}
};

// In-memory user database (extends mock users with registered users)
const userDB: any[] = [...mockUsers];

interface AuthState {
  user: any | null;
  isAuthenticated: boolean;
  role: 'Member' | 'Core Team' | 'Admin' | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  registerUser: (data: { name: string; email: string; studentId: string; branch: string }) => Promise<void>;
  updateProfile: (updates: Partial<any>) => void;
}

const persisted = loadPersistedAuth();

export const useAuthStore = create<AuthState>((set) => ({
  user: persisted,
  isAuthenticated: !!persisted,
  role: persisted?.role ?? null,
  login: async (email, _password) => {
    const user = userDB.find(u => u.email === email);
    if (user) {
      persistAuth(user);
      set({ user, isAuthenticated: true, role: user.role as any });
    } else {
      throw new Error('Invalid credentials');
    }
  },
  logout: () => {
    localStorage.removeItem(STORAGE_KEY);
    set({ user: null, isAuthenticated: false, role: null });
  },
  registerUser: async (data) => {
    if (userDB.find(u => u.email === data.email)) {
      throw new Error('Email already registered');
    }
    const newUser = {
      id: (userDB.length + 1).toString(),
      name: data.name,
      email: data.email,
      studentId: data.studentId,
      branch: data.branch,
      role: 'Member',
      points: 0,
      rank: userDB.length + 1,
      avatar: `https://picsum.photos/seed/${data.name.replace(/\s/g, '')}/200`,
      bio: 'New GDG on Campus IAR member.',
      joinedDate: new Date().toISOString().split('T')[0],
      eventsAttended: 0,
      badges: ['Welcome Badge'],
      socials: {
        linkedin: '',
        github: '',
        gmail: data.email,
      },
    };
    userDB.push(newUser);
    persistAuth(newUser);
    set({ user: newUser, isAuthenticated: true, role: 'Member' });
  },
  updateProfile: (updates) => set((state) => {
    if (!state.user) return state;
    const updatedUser = { ...state.user, ...updates };
    // Update in userDB too
    const idx = userDB.findIndex(u => u.id === updatedUser.id);
    if (idx >= 0) userDB[idx] = updatedUser;
    persistAuth(updatedUser);
    return { user: updatedUser };
  }),
}));
