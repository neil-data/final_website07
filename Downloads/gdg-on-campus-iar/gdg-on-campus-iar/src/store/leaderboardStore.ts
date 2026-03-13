import { create } from 'zustand';
import { mockUsers } from '../mock/users';

// Seeded random for consistent leaderboard data
const seededRandom = (seed: number) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

const generateEventPoints = (eventSeed: number, maxPts: number) =>
  mockUsers.map((u, i) => ({
    ...u,
    points: Math.floor(seededRandom(eventSeed + i) * maxPts),
  }));

interface LeaderboardState {
  overall: any[];
  eventWise: Record<string, any[]>;
  editPoints: (userId: string, points: number, eventId?: string) => void;
  recalculate: () => void;
}

export const useLeaderboardStore = create<LeaderboardState>((set) => ({
  overall: [...mockUsers].sort((a, b) => b.points - a.points),
  eventWise: {
    '1': generateEventPoints(101, 200),
    '2': generateEventPoints(202, 100),
    '3': generateEventPoints(303, 300),
    '4': generateEventPoints(404, 80),
  },
  editPoints: (userId, points, eventId) => set((state) => {
    if (eventId) {
      const newEventWise = { ...state.eventWise };
      newEventWise[eventId] = (newEventWise[eventId] || []).map(u =>
        u.id === userId ? { ...u, points: u.points + points } : u
      );
      return { eventWise: newEventWise };
    } else {
      return {
        overall: state.overall.map(u =>
          u.id === userId ? { ...u, points: u.points + points } : u
        ).sort((a, b) => b.points - a.points)
      };
    }
  }),
  recalculate: () => set((state) => ({
    overall: [...state.overall].sort((a, b) => b.points - a.points)
  })),
}));
