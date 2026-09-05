import { create } from "zustand";

// ── Types ───────────────────────────────────────────────────────

export const useOnboardingStore = create((set) => ({
  // Step 1
  displayName: "Rohit Chugh",
  username: "",
  bio: "",
  avatarDataUrl: null,

  // Step 2
  selectedLanguages: [],
  selectedFrameworks: [],
  experienceLevel: "intermediate",

  // Step 3
  workspaceName: "",
  workspaceSlug: "",
  workspaceType: "personal",
  workspaceIcon: "🚀",

  // Step 4
  invites: [],

  // Actions
  setProfile: (patch) => set(patch),
  setPreferences: (patch) => set(patch),
  toggleLanguage: (lang) =>
    set((s) => ({
      selectedLanguages: s.selectedLanguages.includes(lang)
        ? s.selectedLanguages.filter((l) => l !== lang)
        : [...s.selectedLanguages, lang],
    })),
  toggleFramework: (fw) =>
    set((s) => ({
      selectedFrameworks: s.selectedFrameworks.includes(fw)
        ? s.selectedFrameworks.filter((f) => f !== fw)
        : [...s.selectedFrameworks, fw],
    })),
  setWorkspace: (patch) => set(patch),
  addInvite: (invite) =>
    set((s) => ({
      invites: [...s.invites.filter((i) => i.email !== invite.email), invite],
    })),
  removeInvite: (email) =>
    set((s) => ({ invites: s.invites.filter((i) => i.email !== email) })),
  updateInviteRole: (email, role) =>
    set((s) => ({
      invites: s.invites.map((i) => (i.email === email ? { ...i, role } : i)),
    })),
}));
