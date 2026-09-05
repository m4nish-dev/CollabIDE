import { create } from "zustand";

const MOCK_COLLABORATORS = [
  {
    id: "collab-1",
    name: "Priya",
    avatar: "https://i.pravatar.cc/150?u=priya",
    color: "#22D3EE", // Cyan
    status: "online",
    role: "Owner",
    currentFile: "src/App.jsx",
    cursorPosition: { line: 12, col: 4 },
    selection: null,
  },
  {
    id: "collab-2",
    name: "Manish",
    avatar: "https://i.pravatar.cc/150?u=manish",
    color: "#7C5CFF", // Violet
    status: "idle",
    role: "Editor",
    currentFile: "src/components/Header.jsx",
    cursorPosition: { line: 24, col: 15 },
    selection: { startLine: 24, startCol: 8, endLine: 24, endCol: 36 },
  },
  {
    id: "collab-3",
    name: "Rahul",
    avatar: "https://i.pravatar.cc/150?u=rahul",
    color: "#F59E0B", // Amber
    status: "online",
    role: "Editor",
    currentFile: "src/App.jsx",
    cursorPosition: { line: 5, col: 1 },
    selection: null,
  },
];

export const useCollaborationStore = create((set) => ({
  collaborators: MOCK_COLLABORATORS,
  connectionStatus: "Connected", // 'Connected' | 'Syncing...' | 'Reconnecting...' | 'Offline'
  recentJoins: [], // { id, name, avatar, timestamp }

  updateCollaboratorCursor: (id, cursorPosition) =>
    set((state) => ({
      collaborators: state.collaborators.map((c) =>
        c.id === id ? { ...c, cursorPosition } : c
      ),
    })),

  updateCollaboratorSelection: (id, selection) =>
    set((state) => ({
      collaborators: state.collaborators.map((c) =>
        c.id === id ? { ...c, selection } : c
      ),
    })),

  updateCollaboratorFile: (id, currentFile) =>
    set((state) => ({
      collaborators: state.collaborators.map((c) =>
        c.id === id ? { ...c, currentFile, selection: null } : c
      ),
    })),

  updateCollaboratorStatus: (id, status) =>
    set((state) => ({
      collaborators: state.collaborators.map((c) =>
        c.id === id ? { ...c, status } : c
      ),
    })),

  addCollaborator: (collaborator) =>
    set((state) => ({
      collaborators: [...state.collaborators, collaborator],
    })),

  removeCollaborator: (id) =>
    set((state) => ({
      collaborators: state.collaborators.filter((c) => c.id !== id),
    })),

  setConnectionStatus: (status) => set({ connectionStatus: status }),

  addJoinNotification: (message, avatar) => {
    const id = Date.now().toString();
    set((state) => ({
      recentJoins: [...state.recentJoins, { id, message, avatar, timestamp: Date.now() }],
    }));
  },

  removeJoinNotification: (id) =>
    set((state) => ({
      recentJoins: state.recentJoins.filter((n) => n.id !== id),
    })),
}));
