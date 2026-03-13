import { create } from 'zustand';
import { TeamMember, mockTeam, campusLeads } from '../mock/team';

interface TeamState {
  members: TeamMember[];
  leads: TeamMember[];
  addMember: (member: Omit<TeamMember, 'id'>) => void;
  editMember: (id: string, updates: Partial<TeamMember>) => void;
  removeMember: (id: string) => void;
  addLead: (lead: Omit<TeamMember, 'id'>) => void;
  editLead: (id: string, updates: Partial<TeamMember>) => void;
  removeLead: (id: string) => void;
}

export const useTeamStore = create<TeamState>((set) => ({
  members: mockTeam,
  leads: campusLeads,

  addMember: (member) =>
    set((s) => ({
      members: [...s.members, { ...member, id: `m-${Date.now()}` }],
    })),

  editMember: (id, updates) =>
    set((s) => ({
      members: s.members.map((m) => (m.id === id ? { ...m, ...updates } : m)),
    })),

  removeMember: (id) =>
    set((s) => ({ members: s.members.filter((m) => m.id !== id) })),

  addLead: (lead) =>
    set((s) => ({
      leads: [...s.leads, { ...lead, id: `cl-${Date.now()}`, isCampusLead: true }],
    })),

  editLead: (id, updates) =>
    set((s) => ({
      leads: s.leads.map((l) => (l.id === id ? { ...l, ...updates } : l)),
    })),

  removeLead: (id) =>
    set((s) => ({ leads: s.leads.filter((l) => l.id !== id) })),
}));
