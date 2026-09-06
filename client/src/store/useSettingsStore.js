import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { MOCK_NOTIFICATIONS } from "@/lib/mockData";

export const useSettingsStore = create(
  persist(
    (set, get) => ({
      // --- Global State ---
      isSaving: false,
      notifications: MOCK_NOTIFICATIONS,
      
      // Auto-save wrapper function for settings actions
      _save: (updateFn) => {
        set({ isSaving: true });
        // Simulate network delay for saving
        setTimeout(() => {
          set(updateFn);
          set({ isSaving: false });
        }, 600);
      },

      // --- Notifications Actions ---
      markNotificationAsRead: (id) => set((state) => ({
        notifications: state.notifications.map(n => n.id === id ? { ...n, read: true } : n)
      })),
      markAllNotificationsAsRead: () => set((state) => ({
        notifications: state.notifications.map(n => ({ ...n, read: true }))
      })),

      // --- Profile Settings ---
      profile: {
        displayName: "Manish",
        username: "manish_dev",
        bio: "Frontend Developer & UI Designer",
        location: "San Francisco, CA",
        website: "https://collabide.dev",
        timezone: "America/Los_Angeles",
        avatar: "https://i.pravatar.cc/150?u=manish"
      },
      updateProfile: (updates) => get()._save((state) => ({ 
        profile: { ...state.profile, ...updates } 
      })),

      // --- Account Settings ---
      account: {
        email: "manish@collabide.dev",
      },
      updateAccount: (updates) => get()._save((state) => ({ 
        account: { ...state.account, ...updates } 
      })),

      // --- Appearance Settings ---
      appearance: {
        theme: "dark", // dark, light, system
        accentColor: "violet", // violet, cyan, pink, emerald, amber, blue
        density: "comfortable", // comfortable, compact
        reducedMotion: false,
      },
      updateAppearance: (updates) => get()._save((state) => ({ 
        appearance: { ...state.appearance, ...updates } 
      })),

      // --- Editor Settings ---
      editor: {
        fontFamily: '"JetBrains Mono", monospace',
        fontSize: 13,
        tabSize: 2,
        insertSpaces: true,
        wordWrap: "off",
        minimap: true,
        lineNumbers: true,
        showWhitespace: false,
        bracketPairColorization: true,
        formatOnSave: true,
      },
      updateEditor: (updates) => get()._save((state) => ({ 
        editor: { ...state.editor, ...updates } 
      })),

      // --- Keyboard Settings ---
      keyboard: {
        // Will store custom keybindings eventually
      },
      updateKeyboard: (updates) => get()._save((state) => ({ 
        keyboard: { ...state.keyboard, ...updates } 
      })),

      // --- Notification Settings ---
      notificationPrefs: {
        invites: { inApp: true, email: true },
        mentions: { inApp: true, email: true },
        activity: { inApp: true, email: false },
        system: { inApp: true, email: true },
      },
      updateNotificationPrefs: (category, channel, value) => get()._save((state) => ({
        notificationPrefs: {
          ...state.notificationPrefs,
          [category]: {
            ...state.notificationPrefs[category],
            [channel]: value
          }
        }
      })),

      // --- Security Settings ---
      security: {
        twoFactorEnabled: false,
      },
      updateSecurity: (updates) => get()._save((state) => ({ 
        security: { ...state.security, ...updates } 
      })),

      // --- Workspace General Settings ---
      workspaceGeneral: {
        name: "CollabIDE Team",
        slug: "collabide-team",
        description: "Core development team workspace.",
        defaultVisibility: "private",
        icon: null
      },
      updateWorkspaceGeneral: (updates) => get()._save((state) => ({ 
        workspaceGeneral: { ...state.workspaceGeneral, ...updates } 
      })),

    }),
    {
      name: "collabide-settings-storage", 
      storage: createJSONStorage(() => localStorage), 
      partialize: (state) => ({
        profile: state.profile,
        account: state.account,
        appearance: state.appearance,
        editor: state.editor,
        notificationPrefs: state.notificationPrefs,
        security: state.security,
        workspaceGeneral: state.workspaceGeneral,
        // Notifications are excluded from persistence for now to ensure mock data updates reflect
      }),
    }
  )
);
