import { create } from 'zustand';
import { Query } from '../types';

const STORAGE_KEY = 'gdg-queries';

const defaultQueries: Query[] = [
  {
    id: '1',
    userId: '3',
    name: 'Mike Ross',
    email: 'mike@example.com',
    subject: 'Collaboration',
    message: 'I would like to collaborate on an AI project.',
    status: 'Pending',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: '2',
    userId: '3',
    name: 'Mike Ross',
    email: 'mike@example.com',
    subject: 'General',
    message: 'When is the next DevFest?',
    status: 'Solved',
    reply: 'DevFest 2024 is scheduled for October. Stay tuned!',
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    repliedAt: new Date(Date.now() - 86400000).toISOString(),
  }
];

const loadQueries = (): Query[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return defaultQueries;
};

const persistQueries = (queries: Query[]) => {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(queries)); } catch {}
};

interface QueryState {
  queries: Query[];
  addQuery: (query: Omit<Query, 'id' | 'status' | 'createdAt'>) => void;
  replyToQuery: (id: string, reply: string) => void;
}

export const useQueryStore = create<QueryState>((set) => ({
  queries: loadQueries(),
  addQuery: (query) => set((state) => {
    const queries = [
      ...state.queries,
      {
        ...query,
        id: Date.now().toString(36),
        status: 'Pending' as const,
        createdAt: new Date().toISOString(),
      }
    ];
    persistQueries(queries);
    return { queries };
  }),
  replyToQuery: (id, reply) => set((state) => {
    const queries = state.queries.map(q =>
      q.id === id ? { ...q, status: 'Solved' as const, reply, repliedAt: new Date().toISOString() } : q
    );
    persistQueries(queries);
    return { queries };
  }),
}));
