import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from '@/components/ui/toast'
import { ThemeProvider } from '@/components/layout/ThemeProvider'
import { AppShell } from '@/components/layout/AppShell'

// ── Placeholder route components ──────────────────────────────
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

// Auth pages (no shell)
const LoginPage     = () => <Placeholder title="Login" />
const SignupPage    = () => <Placeholder title="Sign Up" />
const OnboardingPage = () => <Placeholder title="Onboarding" />
const NotFoundPage  = () => <Placeholder title="404 – Page Not Found" />

// Authenticated pages (inside AppShell via <Outlet>)
const DashboardPage  = () => <Placeholder title="Dashboard" />
const WorkspacePage  = () => <Placeholder title="Workspace" />
const ProjectPage    = () => <Placeholder title="Project" />
const SettingsPage   = () => <Placeholder title="Settings" />

function App() {
  return (
    <ThemeProvider defaultTheme="dark">
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/login"      element={<LoginPage />} />
          <Route path="/signup"     element={<SignupPage />} />
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route path="/404"        element={<NotFoundPage />} />

          {/* Authenticated routes — wrapped in AppShell */}
          <Route element={<AppShell />}>
            <Route path="/dashboard"      element={<DashboardPage />} />
            <Route path="/workspace/:id"  element={<WorkspacePage />} />
            <Route path="/project/:id"    element={<ProjectPage />} />
            <Route path="/settings"       element={<SettingsPage />} />
          </Route>

          {/* Redirects */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </BrowserRouter>

      <Toaster position="bottom-right" />
    </ThemeProvider>
  )
}

export default App
