import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from '@/components/ui/toast'
import { ThemeProvider } from '@/components/layout/ThemeProvider'
import { AppShell } from '@/components/layout/AppShell'

// ── Auth pages ────────────────────────────────────────────────
import Login from '@/pages/auth/Login'
import Signup from '@/pages/auth/Signup'
import ForgotPassword from '@/pages/auth/ForgotPassword'
import ResetPassword from '@/pages/auth/ResetPassword'
import VerifyEmail from '@/pages/auth/VerifyEmail'
import Onboarding from '@/pages/onboarding/Onboarding'

// ── Placeholder authenticated pages ──────────────────────────
const Placeholder = ({ title }: { title: string }) => (
  <div className="flex items-center justify-center min-h-full">
    <div className="text-center">
      <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-background-elevated border border-border mb-4">
        <div className="h-2 w-2 rounded-full bg-accent" />
      </div>
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      <p className="text-sm text-foreground-muted mt-1">This page is coming soon.</p>
    </div>
  </div>
)

const DashboardPage  = () => <Placeholder title="Dashboard" />
const WorkspacePage  = () => <Placeholder title="Workspace" />
const ProjectPage    = () => <Placeholder title="Project" />
const SettingsPage   = () => <Placeholder title="Settings" />
const NotFoundPage   = () => <Placeholder title="404 – Page Not Found" />

function App() {
  return (
    <ThemeProvider defaultTheme="dark">
      <BrowserRouter>
        <Routes>
          {/* Public / auth routes */}
          <Route path="/login"           element={<Login />} />
          <Route path="/signup"          element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password"  element={<ResetPassword />} />
          <Route path="/verify-email"    element={<VerifyEmail />} />
          <Route path="/onboarding"      element={<Onboarding />} />
          <Route path="/404"             element={<NotFoundPage />} />

          {/* Authenticated routes — wrapped in AppShell */}
          <Route element={<AppShell />}>
            <Route path="/dashboard"      element={<DashboardPage />} />
            <Route path="/workspace/:id"  element={<WorkspacePage />} />
            <Route path="/project/:id"    element={<ProjectPage />} />
            <Route path="/settings"       element={<SettingsPage />} />
          </Route>

          {/* Redirects */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </BrowserRouter>

      <Toaster position="bottom-right" />
    </ThemeProvider>
  )
}

export default App
