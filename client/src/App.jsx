import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toast";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { AppShell } from "@/components/layout/AppShell";
import { ProtectedRoute } from "@/components/shared/ProtectedRoute";

// ── Auth pages ────────────────────────────────────────────────
import Login from "@/pages/auth/Login";
import Signup from "@/pages/auth/Signup";
import ForgotPassword from "@/pages/auth/ForgotPassword";
import ResetPassword from "@/pages/auth/ResetPassword";
import VerifyEmail from "@/pages/auth/VerifyEmail";
import Onboarding from "@/pages/onboarding/Onboarding";
import Dashboard from "@/pages/Dashboard";
import Templates from "@/pages/Templates";
import InviteAcceptPage from "@/pages/InviteAcceptPage";

import IDEWorkspace from "@/pages/IDEWorkspace";
import { NotificationsPage } from "@/pages/NotificationsPage";
import { ActivityPage } from "@/pages/ActivityPage";
import { ProfileSettings } from "@/pages/settings/ProfileSettings";
import { AccountSettings } from "@/pages/settings/AccountSettings";
import { AppearanceSettings } from "@/pages/settings/AppearanceSettings";
import { EditorSettings } from "@/pages/settings/EditorSettings";
import { KeyboardSettings } from "@/pages/settings/KeyboardSettings";
import { NotificationSettings } from "@/pages/settings/NotificationSettings";
import { SecuritySettings } from "@/pages/settings/SecuritySettings";
import { ConnectedAccountsSettings } from "@/pages/settings/ConnectedAccountsSettings";
import { SessionsSettings } from "@/pages/settings/SessionsSettings";
import { WorkspaceGeneralSettings } from "@/pages/workspace/settings/WorkspaceGeneralSettings";
import { WorkspaceMembersSettings } from "@/pages/workspace/settings/WorkspaceMembersSettings";
import { WorkspaceDangerSettings } from "@/pages/workspace/settings/WorkspaceDangerSettings";
import Showcase from "@/pages/_Showcase";
// ── Placeholder authenticated pages ──────────────────────────
const Placeholder = ({ title }) => (
  <div className="flex items-center justify-center min-h-full">
    <div className="text-center">
      <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-background-elevated border border-border mb-4">
        <div className="h-2 w-2 rounded-full bg-accent" />
      </div>
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      <p className="text-sm text-foreground-muted mt-1">
        This page is coming soon.
      </p>
    </div>
  </div>
);

const WorkspacePage = () => <Placeholder title="Workspace" />;

import NotFound from "@/pages/errors/NotFound";
import Forbidden from "@/pages/errors/Forbidden";
import ServerError from "@/pages/errors/ServerError";
import ProjectNotFound from "@/pages/errors/ProjectNotFound";
import { TopProgressBar } from "@/components/shared/TopProgressBar";
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";
import { useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useSettingsStore } from "@/store/useSettingsStore";
import { useAuthStore } from "@/store/useAuthStore";
import { api } from "@/lib/api";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";

const PageTransition = ({ children }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.15 }}
    className="h-full w-full"
  >
    {children}
  </motion.div>
);

const AppRoutes = () => {
  const location = useLocation();
  const reducedMotion = useSettingsStore(state => state.appearance?.reducedMotion);

  useEffect(() => {
    if (reducedMotion) {
      const style = document.createElement("style");
      style.id = "reduced-motion-override";
      style.textContent = `
        * {
          animation-duration: 0.001ms !important;
          transition-duration: 0.001ms !important;
        }
      `;
      document.head.appendChild(style);
    } else {
      const el = document.getElementById("reduced-motion-override");
      if (el) el.remove();
    }
    return () => {
      const el = document.getElementById("reduced-motion-override");
      if (el) el.remove();
    };
  }, [reducedMotion]);

  return (
    <>
      <TopProgressBar />
      <AnimatePresence mode="wait">
        <Routes location={location}>
          {/* Public / auth routes */}
          <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
          <Route path="/signup" element={<PageTransition><Signup /></PageTransition>} />
          <Route path="/forgot-password" element={<PageTransition><ForgotPassword /></PageTransition>} />
          <Route path="/reset-password" element={<PageTransition><ResetPassword /></PageTransition>} />
          <Route path="/verify-email" element={<PageTransition><VerifyEmail /></PageTransition>} />
          <Route path="/onboarding" element={<PageTransition><ProtectedRoute><Onboarding /></ProtectedRoute></PageTransition>} />
          <Route path="/invite/:token" element={<PageTransition><InviteAcceptPage /></PageTransition>} />
          <Route path="/404" element={<PageTransition><NotFound /></PageTransition>} />
          <Route path="/403" element={<PageTransition><Forbidden /></PageTransition>} />
          <Route path="/500" element={<PageTransition><ServerError /></PageTransition>} />
          <Route path="/project-not-found" element={<PageTransition><ProjectNotFound /></PageTransition>} />

          {/* Full-viewport Core IDE workspace */}
          <Route path="/project/:id" element={<PageTransition><ProtectedRoute><IDEWorkspace /></ProtectedRoute></PageTransition>} />

          {/* Direct top-level pages (wrapped in AppShell via Outlet) */}
          <Route element={<ProtectedRoute><AppShell /></ProtectedRoute>}>
            <Route path="/dashboard" element={<PageTransition><Dashboard defaultTab="all" /></PageTransition>} />
            <Route path="/projects" element={<PageTransition><Dashboard defaultTab="all" /></PageTransition>} />
            <Route path="/shared" element={<PageTransition><Dashboard defaultTab="shared" /></PageTransition>} />
            <Route path="/starred" element={<PageTransition><Dashboard defaultTab="starred" /></PageTransition>} />
            <Route path="/templates" element={<PageTransition><Templates /></PageTransition>} />
            <Route path="/workspace/:id" element={<PageTransition><WorkspacePage /></PageTransition>} />

            <Route path="/notifications" element={<PageTransition><NotificationsPage /></PageTransition>} />
            <Route path="/activity" element={<PageTransition><ActivityPage /></PageTransition>} />

            {/* User Settings */}
            <Route path="/settings" element={<Navigate to="/settings/profile" replace />} />
            <Route path="/settings/profile" element={<PageTransition><ProfileSettings /></PageTransition>} />
            <Route path="/settings/account" element={<PageTransition><AccountSettings /></PageTransition>} />
            <Route path="/settings/appearance" element={<PageTransition><AppearanceSettings /></PageTransition>} />
            <Route path="/settings/editor" element={<PageTransition><EditorSettings /></PageTransition>} />
            <Route path="/settings/keyboard" element={<PageTransition><KeyboardSettings /></PageTransition>} />
            <Route path="/settings/notifications" element={<PageTransition><NotificationSettings /></PageTransition>} />
            <Route path="/settings/security" element={<PageTransition><SecuritySettings /></PageTransition>} />
            <Route path="/settings/connections" element={<PageTransition><ConnectedAccountsSettings /></PageTransition>} />
            <Route path="/settings/sessions" element={<PageTransition><SessionsSettings /></PageTransition>} />

            {/* Workspace Settings */}
            <Route path="/workspace/settings" element={<Navigate to="/workspace/settings/general" replace />} />
            <Route path="/workspace/settings/general" element={<PageTransition><WorkspaceGeneralSettings /></PageTransition>} />
            <Route path="/workspace/settings/members" element={<PageTransition><WorkspaceMembersSettings /></PageTransition>} />
            <Route path="/workspace/settings/danger" element={<PageTransition><WorkspaceDangerSettings /></PageTransition>} />
          </Route>

          {/* Dev-only Component Showcase */}
          {import.meta.env.DEV && (
            <Route path="/_showcase" element={<PageTransition><Showcase /></PageTransition>} />
          )}

          {/* Redirects */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </AnimatePresence>
    </>
  );
};

import { SkipToContent } from "@/components/shared/SkipToContent";

const SessionProvider = ({ children }) => {
  const { token, user, updateUser, logout } = useAuthStore();
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const initSession = async () => {
      if (!token) {
        setIsInitializing(false);
        return;
      }
      try {
        const currentUser = await api.auth.me();
        if (currentUser) {
          updateUser(currentUser);
        }
      } catch (error) {
        console.warn("Session invalid, logging out:", error);
        logout();
      } finally {
        setIsInitializing(false);
      }
    };

    initSession();
  }, []); // Only run once on boot

  if (isInitializing) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return children;
};

function App() {
  return (
    <ErrorBoundary>
      <SkipToContent />
      <ThemeProvider>
        <BrowserRouter>
          <SessionProvider>
            <AppRoutes />
          </SessionProvider>
        </BrowserRouter>
        <Toaster position="bottom-right" />
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
