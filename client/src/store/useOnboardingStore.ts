import { create } from 'zustand'

// ── Types ───────────────────────────────────────────────────────
export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced'
export type WorkspaceType = 'personal' | 'team'

export interface InviteEntry {
  email: string
  role: 'editor' | 'viewer'
}

interface OnboardingState {
  // Step 1 — Profile
  displayName: string
  username: string
  bio: string
  avatarDataUrl: string | null

  // Step 2 — Preferences
  selectedLanguages: string[]
  selectedFrameworks: string[]
  experienceLevel: ExperienceLevel

  // Step 3 — Workspace
  workspaceName: string
  workspaceSlug: string
  workspaceType: WorkspaceType
  workspaceIcon: string

  // Step 4 — Invites
  invites: InviteEntry[]

  // Actions
  setProfile: (patch: Partial<Pick<OnboardingState, 'displayName' | 'username' | 'bio' | 'avatarDataUrl'>>) => void
  setPreferences: (patch: Partial<Pick<OnboardingState, 'selectedLanguages' | 'selectedFrameworks' | 'experienceLevel'>>) => void
  toggleLanguage: (lang: string) => void
  toggleFramework: (fw: string) => void
  setWorkspace: (patch: Partial<Pick<OnboardingState, 'workspaceName' | 'workspaceSlug' | 'workspaceType' | 'workspaceIcon'>>) => void
  addInvite: (invite: InviteEntry) => void
  removeInvite: (email: string) => void
  updateInviteRole: (email: string, role: 'editor' | 'viewer') => void
}

export const useOnboardingStore = create<OnboardingState>((set) => ({
  // Step 1
  displayName: 'Rohit Chugh',
  username: '',
  bio: '',
  avatarDataUrl: null,

  // Step 2
  selectedLanguages: [],
  selectedFrameworks: [],
  experienceLevel: 'intermediate',

  // Step 3
  workspaceName: '',
  workspaceSlug: '',
  workspaceType: 'personal',
  workspaceIcon: '🚀',

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
    set((s) => ({ invites: [...s.invites.filter((i) => i.email !== invite.email), invite] })),
  removeInvite: (email) =>
    set((s) => ({ invites: s.invites.filter((i) => i.email !== email) })),
  updateInviteRole: (email, role) =>
    set((s) => ({ invites: s.invites.map((i) => (i.email === email ? { ...i, role } : i)) })),
}))
