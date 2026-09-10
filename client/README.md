# CollabIDE — Frontend Client

CollabIDE is a browser-based collaborative Integrated Development Environment (IDE) designed for modern web development. Built with React 19 and Vite, it features a rich design system, file explorer, Monaco editor, integrated source control, terminal interface, real-time collaboration UI, and a full authentication & settings system.

> **Backend not yet integrated** — All data is served from `src/lib/api.js` using mock delays and in-memory data. The API layer is fully structured and ready for a real backend swap.

---

## 🚀 Quick Start

```bash
npm install
npm run dev
```

The app is available at `http://localhost:5173`.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + Vite |
| Styling | TailwindCSS + CSS Design Tokens |
| State Management | Zustand |
| Animations | Framer Motion |
| Code Editor | Monaco Editor (`@monaco-editor/react`) |
| Routing | React Router DOM v7 |
| Icons | Lucide React |
| UI Primitives | Radix UI (accessible, composable) |
| Form Validation | React Hook Form + Zod |
| Linting / Formatting | ESLint + Prettier |

---

## 🗂️ Folder Structure

```
client/
├── public/
│   └── favicon.svg              # CollabIDE branded SVG favicon
├── src/
│   ├── components/
│   │   ├── auth/                # Auth forms and visual panels
│   │   ├── dashboard/           # Dashboard cards, stats, sidebars
│   │   ├── features/            # Domain features (sharing, source control, notifications)
│   │   ├── ide/                 # IDE panels (editor, file explorer, terminal, bars)
│   │   ├── layout/              # App wrappers (AppShell, SettingsLayout)
│   │   ├── shared/              # Reusable components (Skeletons, EmptyState, ErrorBoundary)
│   │   └── ui/                  # Base UI components (Button, Input, Dialog, Dropdown, etc.)
│   ├── hooks/                   # Custom React hooks
│   ├── lib/
│   │   ├── api.js               # Centralized API client (mock, backend-ready)
│   │   ├── mockData.js          # All mock data (projects, templates, users, etc.)
│   │   ├── queryError.js        # Normalized error shape { status, message, code }
│   │   ├── toast.js             # Sonner toast wrapper
│   │   └── utils.js             # cn() and other utilities
│   ├── pages/
│   │   ├── auth/                # Login, Signup, ForgotPassword, ResetPassword, VerifyEmail
│   │   ├── errors/              # 404, 403, 500, ProjectNotFound pages
│   │   ├── onboarding/          # 4-step onboarding wizard
│   │   ├── settings/            # User settings pages (profile, security, sessions, etc.)
│   │   ├── workspace/           # Workspace settings pages
│   │   ├── ActivityPage.jsx
│   │   ├── Dashboard.jsx
│   │   ├── IDEWorkspace.jsx
│   │   ├── InviteAcceptPage.jsx
│   │   ├── NotificationsPage.jsx
│   │   └── Templates.jsx
│   ├── store/                   # Zustand stores (auth, project, settings, collaboration, etc.)
│   ├── index.css                # Global CSS, design tokens, and Tailwind directives
│   └── App.jsx                  # Root router and app shell setup
└── index.html                   # HTML entry with SEO meta tags and font preconnects
```

---

## ✅ Features Implemented

### Authentication
- Login, Signup, Forgot Password, Reset Password, Email Verification
- OAuth button placeholders (GitHub, Google)
- Protected routes with redirect-to-intended-URL support
- JWT token storage in Zustand (persisted via localStorage via Zustand persist)
- Confirmation dialog on Logout

### Onboarding
- 4-step wizard: Profile → Workspace → Invite team → Preferences

### Dashboard
- Project listing with grid / list view toggle
- Filter by tab (All, Shared, Starred, Archived) and by language
- Sort options (Last updated, Created, Name)
- Search
- Loading skeletons + error retry cards
- Create Project modal (blank / template / import, workspace, visibility options)
- Quick Actions strip, Stats strip, Activity sidebar

### IDE Workspace
- Monaco Editor with full syntax highlighting
- Resizable panels (file explorer, editor, bottom panel, right panel)
- Multi-tab file editing with close/save/reorder
- Split editor mode
- File Explorer with tree view, context menu, rename/delete/add
- Terminal with mock command processing and ANSI color output
- Source Control panel: stage/unstage, commit with history, branch selector, diff viewer
- Merge Conflict Resolver mock UI
- Command Palette (⌘K), Quick Open (⌘P), Global Search (⌘⇧F), Find In Files
- Right panel: Preview, Collaboration, and AI panels
- Activity Bar with tooltips
- Status Bar
- Mobile notice overlay for screens < 768px
- Persistent `?file=` URL sync when opening files

### Templates
- Gallery of project templates with categories, tags, preview modal

### Notifications
- Notification page with filter tabs, real-time-style loading, mark as read

### Activity Feed
- Paginated activity log grouped by date with infinite scroll observer

### Settings (User)
- Profile (display name, avatar via emoji, bio, location, website)
- Account (email, timezone, language, delete account)
- Appearance (theme, accent color, density, reduced motion toggle)
- Editor (font size, tab size, word wrap, minimap, etc.)
- Keyboard Shortcuts (view and reset shortcuts)
- Notifications (per-category toggle controls)
- Security (2FA setup, recovery codes, login history)
- Connected Accounts (GitHub, Google, Slack)
- Sessions (active session list, revoke individual or all others)

### Workspace Settings
- General (name, description, icon, visibility)
- Members (list, invite, role change, remove)
- Danger Zone (transfer ownership, delete workspace)

### Global
- Dynamic breadcrumbs in AppShell TopBar
- Mobile hamburger drawer navigation below md breakpoint
- Responsive layouts across all pages
- Reduced-motion global override (reads from settings store)
- Top progress bar on route transitions
- Skeleton loading states on all data-fetching pages
- Inline error retry cards on all data-fetching pages
- EmptyState component used across all list views
- Accessible buttons (aria-label on all icon-only buttons)
- Focus-visible ring on all interactive elements
- Error Boundary for top-level crash recovery
- Skip-to-content link for keyboard users

---

## 🌐 Environment Variables

Copy `.env.example` to `.env` to configure the app:

```bash
cp .env.example .env
```

| Variable | Required for dev | Description |
|---|---|---|
| `VITE_API_URL` | ❌ Not yet | Base URL of the backend REST API (e.g. `https://api.collabide.io`). When set, `api.js` should be updated to use `fetch(VITE_API_URL + path, ...)` instead of mock responses. |

**No environment variables are required to run locally.** The app runs fully in mock mode out of the box.

---

## 🔌 Mock API Layer

All data fetching goes through `src/lib/api.js`. Each method:
- Simulates a network delay (typically 800ms)
- Returns realistic mock data from `src/lib/mockData.js`
- Rejects with a normalized `{ status, message, code }` error shape

This means the UI is fully backend-ready — every page has the correct loading → success/error lifecycle. Replacing mock calls with real `fetch` calls requires only changes to `api.js`.

---

## 📦 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server (HMR at localhost:5173) |
| `npm run build` | Build for production (output: `dist/`) |
| `npm run lint` | Run ESLint on all source files |
| `npm run preview` | Preview the production build |

---

## 🛣️ Roadmap

- **Phase 1 (Complete)**: Frontend architecture, full UX design, mock state modeling, API layer
- **Phase 2**: Backend integration (Node.js / Express / PostgreSQL)
- **Phase 3**: Real-time collaboration (WebSockets + Yjs CRDT)
- **Phase 4**: CI/CD pipeline integration, deployment, billing
