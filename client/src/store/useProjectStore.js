import { create } from "zustand";
import { GIT_COMMITS, GIT_WORKING_TREE, GIT_BRANCHES } from "../lib/mockData";

const SEED_PROJECT_FILES = [
  {
    id: "root-src",
    name: "src",
    path: "src",
    type: "folder",
    children: [
      {
        id: "src-components",
        name: "components",
        path: "src/components",
        type: "folder",
        children: [
          {
            id: "src-components-Header.jsx",
            name: "Header.jsx",
            path: "src/components/Header.jsx",
            type: "file",
            language: "javascript",
            content: `import React from 'react'
import { Bell, Search, Sparkles, User } from 'lucide-react'

interface HeaderProps {
  workspaceName?: string
  unreadAlertsCount?: number
}

export const Header: React.FC<HeaderProps> = ({
  workspaceName = 'Engineering Core',
  unreadAlertsCount = 3,
}) => {
  return (
    <header className="h-14 px-4 border-b border-border bg-background-elevated/70 backdrop-blur-md flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-lg bg-accent/20 border border-accent/40 flex items-center justify-center text-accent font-semibold text-xs">
          CI
        </div>
        <span className="text-sm font-medium text-foreground tracking-tight">
          {workspaceName}
        </span>
        <span className="text-[11px] px-2 py-0.5 rounded-full bg-accent/15 text-accent border border-accent/30 font-medium">
          Live Sync Active
        </span>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative w-64">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-foreground-subtle" />
          <input
            type="text"
            placeholder="Search symbols or files..."
            className="w-full bg-background border border-border text-xs rounded-md pl-8 pr-3 py-1.5 text-foreground placeholder:text-foreground-subtle focus:outline-none focus:border-accent"
          />
        </div>

        <button 
          className="relative p-1.5 text-foreground-muted hover:text-foreground rounded-md hover:bg-background-hover transition-colors"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
          {unreadAlertsCount > 0 && (
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-accent animate-pulse" />
          )}
        </button>

        <div className="h-4 w-px bg-border mx-1" />

        <div className="flex items-center gap-2 pl-1 cursor-pointer group">
          <div className="h-7 w-7 rounded-full bg-gradient-to-tr from-accent to-secondary flex items-center justify-center text-white text-xs font-semibold shadow-sm">
            <User className="h-3.5 w-3.5" />
          </div>
          <div className="text-left hidden sm:block">
            <p className="text-xs font-medium text-foreground group-hover:text-accent transition-colors">Manish</p>
            <p className="text-[10px] text-foreground-subtle leading-none">Architect</p>
          </div>
        </div>
      </div>
    </header>
  )
}
`,
          },
          {
            id: "src-components-Sidebar.jsx",
            name: "Sidebar.jsx",
            path: "src/components/Sidebar.jsx",
            type: "file",
            language: "javascript",
            content: `import React, { useState } from 'react'
import { Code2, Files, GitPullRequest, Settings, Terminal } from 'lucide-react'

export const Sidebar: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'files' | 'git' | 'term'>('files')

  return (
    <aside className="w-64 border-r border-border bg-background-elevated flex flex-col h-full select-none">
      <div className="p-3 border-b border-border flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-foreground-muted">Explorer</span>
        <span className="text-[10px] font-mono text-foreground-subtle">v2.4.0</span>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        <div className="text-xs text-foreground-subtle px-2 py-1 font-medium">WORKSPACE</div>
        <div className="px-2 py-1.5 rounded-md bg-accent/15 text-accent text-xs font-medium flex items-center gap-2 cursor-pointer">
          <Code2 className="h-3.5 w-3.5" />
          <span>collab-dashboard</span>
        </div>
      </div>

      <div className="p-2 border-t border-border bg-background/50 flex items-center justify-between text-foreground-subtle">
        <button className="p-1.5 hover:text-foreground rounded">
          <Settings className="h-4 w-4" />
        </button>
        <span className="text-[11px] font-mono">UTF-8 • TSX</span>
      </div>
    </aside>
  )
}
`,
          },
          {
            id: "src-components-Button.jsx",
            name: "Button.jsx",
            path: "src/components/Button.jsx",
            type: "file",
            language: "javascript",
            content: `import React from 'react'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const variantStyles = {
    primary: 'bg-accent hover:bg-accent-hover text-white shadow-lg shadow-accent/25 border border-accent/30',
    secondary: 'bg-secondary/20 hover:bg-secondary/30 text-secondary border border-secondary/30',
    outline: 'border border-border text-foreground hover:bg-background-hover hover:border-border-strong',
    ghost: 'text-foreground-muted hover:text-foreground hover:bg-background-hover',
    danger: 'bg-danger/20 text-danger border border-danger/40 hover:bg-danger/30',
  }

  const sizeStyles = {
    sm: 'h-7 px-2.5 text-xs rounded-md font-medium',
    md: 'h-9 px-4 text-xs rounded-lg font-medium',
    lg: 'h-11 px-5 text-sm rounded-xl font-semibold',
  }

  return (
    <button
      disabled={disabled || isLoading}
      className={\`inline-flex items-center justify-center gap-2 transition-all duration-150 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none \${variantStyles[variant]} \${sizeStyles[size]} \${className}\`}
      {...props}
    >
      {isLoading && (
        <span className="h-3 w-3 rounded-full border-2 border-current border-t-transparent animate-spin" />
      )}
      {children}
    </button>
  )
}
`,
          },
        ],
      },
      {
        id: "src-pages",
        name: "pages",
        path: "src/pages",
        type: "folder",
        children: [
          {
            id: "src-pages-Home.jsx",
            name: "Home.jsx",
            path: "src/pages/Home.jsx",
            type: "file",
            language: "javascript",
            content: `import React from 'react'
import { Sparkles, ArrowRight, Zap, Users, Shield } from 'lucide-react'
import { Button } from '../components/Button'

export const Home: React.FC = () => {
  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/15 border border-accent/30 text-accent text-xs font-semibold">
          <Sparkles className="h-3.5 w-3.5" />
          Next-Gen Cloud IDE
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Real-time collaborative code editor built for velocity
        </h1>
        <p className="text-foreground-muted text-sm max-w-2xl">
          Write code together in real-time with sub-50ms latency, multi-cursor presence, built-in Monaco editor, and instant cloud previews.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-xl bg-background-elevated border border-border space-y-2">
          <Zap className="h-5 w-5 text-accent" />
          <h3 className="text-sm font-semibold text-foreground">Instant Live Sync</h3>
          <p className="text-xs text-foreground-muted">CRDT-powered operational transforms ensure seamless conflict-free editing.</p>
        </div>
        <div className="p-5 rounded-xl bg-background-elevated border border-border space-y-2">
          <Users className="h-5 w-5 text-secondary" />
          <h3 className="text-sm font-semibold text-foreground">Peer Awareness</h3>
          <p className="text-xs text-foreground-muted">Track remote cursors, selections, and live terminal sessions effortlessly.</p>
        </div>
        <div className="p-5 rounded-xl bg-background-elevated border border-border space-y-2">
          <Shield className="h-5 w-5 text-success" />
          <h3 className="text-sm font-semibold text-foreground">Cloud Sandboxes</h3>
          <p className="text-xs text-foreground-muted">Isolated WebContainers provide full Node.js execution directly in browser tabs.</p>
        </div>
      </div>
    </div>
  )
}
`,
          },
          {
            id: "src-pages-About.jsx",
            name: "About.jsx",
            path: "src/pages/About.jsx",
            type: "file",
            language: "javascript",
            content: `import React from 'react'

export const About: React.FC = () => {
  return (
    <div className="p-8 max-w-3xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-foreground">About CollabIDE</h2>
      <p className="text-sm text-foreground-muted leading-relaxed">
        CollabIDE is engineered from the ground up for developer teams who value instantaneous pair programming and zero friction cloud development.
      </p>
    </div>
  )
}
`,
          },
        ],
      },
      {
        id: "src-App.jsx",
        name: "App.jsx",
        path: "src/App.jsx",
        type: "file",
        language: "javascript",
        content: `import React, { useState } from 'react'
import { Header } from './components/Header'
import { Home } from './pages/Home'

export default function App() {
  const [activeTab, setActiveTab] = useState<'overview' | 'settings'>('overview')

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col antialiased">
      <Header workspaceName="CollabIDE Demo" unreadAlertsCount={2} />
      <main className="flex-1">
        <Home />
      </main>
    </div>
  )
}
`,
      },
      {
        id: "src-main.jsx",
        name: "main.jsx",
        path: "src/main.jsx",
        type: "file",
        language: "javascript",
        content: `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
`,
      },
      {
        id: "src-index.css",
        name: "index.css",
        path: "src/index.css",
        type: "file",
        language: "css",
        content: `@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  color-scheme: dark;
}

body {
  margin: 0;
  background-color: #0A0A0B;
  color: #EDEDF0;
  font-family: 'Inter', sans-serif;
}
`,
      },
    ],
  },
  {
    id: "root-public",
    name: "public",
    path: "public",
    type: "folder",
    children: [
      {
        id: "public-logo.svg",
        name: "logo.svg",
        path: "public/logo.svg",
        type: "file",
        language: "html",
        content: `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="32" height="32" rx="8" fill="#7C5CFF" fill-opacity="0.2"/>
  <rect x="0.5" y="0.5" width="31" height="31" rx="7.5" stroke="#7C5CFF" stroke-opacity="0.4"/>
  <path d="M10 16L14 12M14 20L10 16M22 16L18 12M18 20L22 16" stroke="#EDEDF0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,
      },
    ],
  },
  {
    id: "root-package.json",
    name: "package.json",
    path: "package.json",
    type: "file",
    language: "json",
    content: `{
  "name": "collab-dashboard",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "lucide-react": "^1.41.0"
  },
  "devDependencies": {
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@vitejs/plugin-react": "^4.3.0",
    "javascript": "^5.5.0",
    "vite": "^5.4.0"
  }
}
`,
  },
  {
    id: "root-tsconfig.json",
    name: "tsconfig.json",
    path: "tsconfig.json",
    type: "file",
    language: "json",
    content: `{
  "compilerOptions": {
    "target": "ES2022",
    "useDefineForClassFields": true,
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true
  },
  "include": ["src"]
}
`,
  },
  {
    id: "root-vite.config.js",
    name: "vite.config.js",
    path: "vite.config.js",
    type: "file",
    language: "javascript",
    content: `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true,
  },
})
`,
  },
  {
    id: "root-README.md",
    name: "README.md",
    path: "README.md",
    type: "file",
    language: "markdown",
    content: `# CollabIDE Project Template

A production-ready React 19 + JavaScript template running in real-time within the CollabIDE distributed sandbox.

## Features
- ⚡ **Instant HMR**: Blazing fast hot module reloading powered by Vite
- 👥 **Multiplayer**: Live cursor tracking, shared terminal instances, and conflict-free editing
- 🎨 **Tailwind CSS**: Full tokenized design system ready to use
- 🛡️ **JavaScript**: Strict type-checking and automated IntelliSense

## Getting Started
\`\`\`bash
npm install
npm run dev
\`\`\`
`,
  },
];

function findNodeByPath(nodes, pathOrId) {
  for (const node of nodes) {
    if (node.path === pathOrId || node.id === pathOrId) return node;
    if (node.children) {
      const found = findNodeByPath(node.children, pathOrId);
      if (found) return found;
    }
  }
  return null;
}

function updateNodeContent(nodes, pathOrId, content) {
  return nodes.map((node) => {
    if (node.path === pathOrId || node.id === pathOrId) {
      return { ...node, content };
    }
    if (node.children) {
      return {
        ...node,
        children: updateNodeContent(node.children, pathOrId, content),
      };
    }
    return node;
  });
}

function removeNode(nodes, targetPath) {
  return nodes
    .filter((node) => node.path !== targetPath)
    .map((node) => {
      if (node.children) {
        return { ...node, children: removeNode(node.children, targetPath) };
      }
      return node;
    });
}

function renameNodeInTree(nodes, targetPath, newName) {
  return nodes.map((node) => {
    if (node.path === targetPath) {
      const parentDir = targetPath.includes("/")
        ? targetPath.substring(0, targetPath.lastIndexOf("/"))
        : "";
      const newPath = parentDir ? `${parentDir}/${newName}` : newName;
      return { ...node, name: newName, path: newPath };
    }
    if (node.children) {
      return {
        ...node,
        children: renameNodeInTree(node.children, targetPath, newName),
      };
    }
    return node;
  });
}

function insertNode(nodes, parentPath, newNode) {
  if (!parentPath || parentPath === "root") {
    return [...nodes, newNode];
  }
  return nodes.map((node) => {
    if (node.path === parentPath && node.type === "folder") {
      return { ...node, children: [...(node.children || []), newNode] };
    }
    if (node.children) {
      return {
        ...node,
        children: insertNode(node.children, parentPath, newNode),
      };
    }
    return node;
  });
}

export const useProjectStore = create((set, get) => ({
  projectName: "collab-dashboard",
  currentBranch: "main",
  branches: GIT_BRANCHES,
  gitCommits: GIT_COMMITS,
  gitWorkingTree: GIT_WORKING_TREE,
  files: SEED_PROJECT_FILES,
  activeFileId: "src/App.jsx",
  openTabIds: [
    "src/App.jsx",
    "src/components/Header.jsx",
    "src/components/Button.jsx",
  ],
  unsavedFileIds: new Set(["src/components/Header.jsx"]),
  cursorPosition: { lineNumber: 12, column: 4 },
  splitEditor: false,
  isRunning: true,
  isShareModalOpen: false,
  isCommandPaletteOpen: false,
  isQuickOpenOpen: false,
  isGlobalSearchOpen: false,
  isCommitHistoryOpen: false,

  setIsCommandPaletteOpen: (isOpen) => set({ isCommandPaletteOpen: isOpen }),
  setIsQuickOpenOpen: (isOpen) => set({ isQuickOpenOpen: isOpen }),
  setIsGlobalSearchOpen: (isOpen) => set({ isGlobalSearchOpen: isOpen }),
  setIsCommitHistoryOpen: (isOpen) => set({ isCommitHistoryOpen: isOpen }),

  activeActivity: "explorer",
  isSidebarOpen: true,
  isBottomPanelOpen: true,
  isRightPanelOpen: false,
  activeBottomTab: "terminal",
  activeRightTab: "preview",

  terminals: [
    {
      id: "term-1",
      title: "bash (dev)",
      logs: [
        {
          id: "1",
          type: "system",
          text: "CollabIDE Cloud Sandbox v2.4.0 (node v20.12.2, linux-x64)",
        },
        { id: "2", type: "input", text: "npm run dev" },
        { id: "3", type: "output", text: "  VITE v5.4.2  ready in 248 ms" },
        {
          id: "4",
          type: "output",
          text: "  ➜  Local:   http://localhost:3000/",
        },
        { id: "5", type: "output", text: "  ➜  Network: use --host to expose" },
        { id: "6", type: "output", text: "  ➜  press h + enter to show help" },
      ],
    },
    {
      id: "term-2",
      title: "bash (git)",
      logs: [
        { id: "1", type: "input", text: "git status" },
        {
          id: "2",
          type: "output",
          text: "On branch main\nYour branch is up to date with 'origin/main'.",
        },
        {
          id: "3",
          type: "output",
          text: "Changes not staged for commit:\n  modified:   src/components/Header.jsx",
        },
      ],
    },
  ],

  activeTerminalId: "term-1",

  collaborators: [
    {
      id: "user-1",
      name: "Rohit Sharma",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80",
      color: "#22D3EE", // Cyan
      activeFile: "src/App.jsx",
      cursor: { lineNumber: 8, column: 22 },
      selection: {
        startLineNumber: 8,
        startColumn: 10,
        endLineNumber: 8,
        endColumn: 28,
      },
      role: "Editor",
      status: "online",
    },
    {
      id: "user-2",
      name: "Priya Patel",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&auto=format&fit=crop&q=80",
      color: "#F43F5E", // Rose
      activeFile: "src/components/Header.jsx",
      cursor: { lineNumber: 24, column: 15 },
      selection: {
        startLineNumber: 24,
        startColumn: 8,
        endLineNumber: 24,
        endColumn: 36,
      },
      role: "Editor",
      status: "online",
    },
    {
      id: "user-3",
      name: "Manish (You)",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=80",
      color: "#7C5CFF", // Electric Violet
      activeFile: "src/App.jsx",
      cursor: { lineNumber: 12, column: 4 },
      role: "Owner",
      status: "online",
    },
    {
      id: "user-4",
      name: "Alex Chen",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&auto=format&fit=crop&q=80",
      color: "#10B981", // Emerald
      activeFile: "src/components/Button.jsx",
      cursor: { lineNumber: 19, column: 30 },
      role: "Editor",
      status: "online",
    },
    {
      id: "user-5",
      name: "Elena Rostova",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&auto=format&fit=crop&q=80",
      color: "#F59E0B", // Amber
      activeFile: "vite.config.js",
      cursor: { lineNumber: 7, column: 14 },
      role: "Viewer",
      status: "idle",
    },
  ],

  problems: [
    {
      id: "p-1",
      file: "src/components/Header.jsx",
      line: 24,
      column: 15,
      message:
        "Unused variable 'unreadAlertsCount' is implicitly typed as number.",
      severity: "warning",
      source: "eslint (no-unused-vars)",
    },
    {
      id: "p-2",
      file: "src/components/Button.jsx",
      line: 42,
      column: 7,
      message:
        "Prop 'isLoading' might cause layout jitter if height is unconstrained.",
      severity: "info",
      source: "react-hints",
    },
    {
      id: "p-3",
      file: "src/App.jsx",
      line: 9,
      column: 26,
      message:
        "Type 'string' is not assignable to type 'TabKey'. Did you mean 'overview'?",
      severity: "error",
      source: "tsc (TS2322)",
    },
  ],

  activities: [
    {
      id: "act-1",
      user: "Priya Patel",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&auto=format&fit=crop&q=80",
      color: "#F43F5E",
      action: "modified",
      target: "src/components/Header.jsx",
      timestamp: "2 mins ago",
    },
    {
      id: "act-2",
      user: "Rohit Sharma",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80",
      color: "#22D3EE",
      action: "switched to branch",
      target: "main",
      timestamp: "5 mins ago",
    },
    {
      id: "act-3",
      user: "Manish",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=80",
      color: "#7C5CFF",
      action: "started dev server",
      target: "npm run dev",
      timestamp: "12 mins ago",
    },
    {
      id: "act-4",
      user: "Alex Chen",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&auto=format&fit=crop&q=80",
      color: "#10B981",
      action: "commented on",
      target: "src/components/Button.jsx",
      timestamp: "18 mins ago",
    },
  ],

  commentThreads: [
    {
      id: "comm-1",
      file: "src/components/Button.jsx",
      lineNumber: 19,
      author: "Alex Chen",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&auto=format&fit=crop&q=80",
      color: "#10B981",
      timestamp: "Yesterday at 4:32 PM",
      content:
        "Should we add an optional iconSlot prop here so callers don't have to nest manually?",
      replies: [
        {
          id: "reply-1",
          author: "Priya Patel",
          avatar:
            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&auto=format&fit=crop&q=80",
          color: "#F43F5E",
          timestamp: "Today at 10:15 AM",
          content:
            "Agreed! Left/right icon slots would make Header button implementations much cleaner.",
        },
      ],
    },
    {
      id: "comm-2",
      file: "src/App.jsx",
      lineNumber: 11,
      author: "Rohit Sharma",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80",
      color: "#22D3EE",
      timestamp: "2 hours ago",
      content:
        "Make sure to wrap this with the LiveSyncProvider once the WebContainer handshake finishes.",
      replies: [],
    },
  ],

  setProjectName: (name) => set({ projectName: name }),
  setCurrentBranch: (branch) => set({ currentBranch: typeof branch === 'string' ? branch : branch.name }),
  setBranches: (branches) => set({ branches }),
  setGitCommits: (commits) => set({ gitCommits: commits }),
  setGitWorkingTree: (tree) => set({ gitWorkingTree: tree }),
  
  stageFile: (fileId) =>
    set((state) => ({
      gitWorkingTree: state.gitWorkingTree.map((f) =>
        f.id === fileId ? { ...f, staged: true } : f
      ),
    })),
    
  unstageFile: (fileId) =>
    set((state) => ({
      gitWorkingTree: state.gitWorkingTree.map((f) =>
        f.id === fileId ? { ...f, staged: false } : f
      ),
    })),
    
  commitChanges: (message) =>
    set((state) => {
      const newCommit = {
        id: `commit_new_${Date.now()}`,
        hash: Math.random().toString(16).substr(2, 7),
        author: state.collaborators[0],
        message,
        timestamp: new Date().toISOString(),
        stats: { files: 1, insertions: 10, deletions: 2 },
        branches: [state.currentBranch],
      };
      return {
        gitCommits: [newCommit, ...state.gitCommits],
        gitWorkingTree: state.gitWorkingTree.filter((f) => !f.staged),
      };
    }),
    
  createBranch: (name, switchTo = true) =>
    set((state) => {
      const newBranch = { id: `b_${Date.now()}`, name, type: "local" };
      return {
        branches: [...state.branches, newBranch],
        currentBranch: switchTo ? name : state.currentBranch,
      };
    }),

  setActiveFile: (idOrPath) => {
    const node = findNodeByPath(get().files, idOrPath);
    if (!node || node.type === "folder") return;
    const path = node.path;
    set((state) => ({
      activeFileId: path,
      openTabIds: state.openTabIds.includes(path)
        ? state.openTabIds
        : [...state.openTabIds, path],
    }));
  },

  openTab: (idOrPath) => {
    const node = findNodeByPath(get().files, idOrPath);
    if (!node || node.type === "folder") return;
    const path = node.path;
    set((state) => ({
      activeFileId: path,
      openTabIds: state.openTabIds.includes(path)
        ? state.openTabIds
        : [...state.openTabIds, path],
    }));
  },

  closeTab: (idOrPath) => {
    const node = findNodeByPath(get().files, idOrPath);
    const path = node ? node.path : idOrPath;
    set((state) => {
      const nextTabs = state.openTabIds.filter((t) => t !== path);
      let nextActive = state.activeFileId;
      if (state.activeFileId === path) {
        nextActive = nextTabs[nextTabs.length - 1] || "";
      }
      return {
        openTabIds: nextTabs,
        activeFileId: nextActive,
      };
    });
  },

  saveCurrentFile: () => {
    const { activeFileId, unsavedFileIds } = get();
    if (!activeFileId) return;
    const nextUnsaved = new Set(unsavedFileIds);
    nextUnsaved.delete(activeFileId);
    set({ unsavedFileIds: nextUnsaved });
  },

  markFileSaved: (idOrPath) => {
    const node = findNodeByPath(get().files, idOrPath);
    const path = node ? node.path : idOrPath;
    set((state) => {
      const nextUnsaved = new Set(state.unsavedFileIds);
      nextUnsaved.delete(path);
      return { unsavedFileIds: nextUnsaved };
    });
  },

  updateFileContent: (idOrPath, content) => {
    const node = findNodeByPath(get().files, idOrPath);
    const path = node ? node.path : idOrPath;
    set((state) => {
      const nextFiles = updateNodeContent(state.files, path, content);
      const nextUnsaved = new Set(state.unsavedFileIds);
      nextUnsaved.add(path);
      return {
        files: nextFiles,
        unsavedFileIds: nextUnsaved,
      };
    });
  },

  setCursorPosition: (pos) => set({ cursorPosition: pos }),
  toggleSplitEditor: () =>
    set((state) => ({ splitEditor: !state.splitEditor })),
  toggleRun: () => set((state) => ({ isRunning: !state.isRunning })),
  setIsShareModalOpen: (open) => set({ isShareModalOpen: open }),

  setActiveActivity: (activity) => {
    set((state) => {
      if (state.activeActivity === activity && state.isSidebarOpen) {
        return { isSidebarOpen: false };
      }
      return { activeActivity: activity, isSidebarOpen: true };
    });
  },

  toggleSidebar: () =>
    set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  toggleBottomPanel: () =>
    set((state) => ({ isBottomPanelOpen: !state.isBottomPanelOpen })),
  toggleRightPanel: () =>
    set((state) => ({ isRightPanelOpen: !state.isRightPanelOpen })),
  setActiveBottomTab: (tab) =>
    set({ activeBottomTab: tab, isBottomPanelOpen: true }),
  setActiveRightTab: (tab) =>
    set({ activeRightTab: tab, isRightPanelOpen: true }),

  addTerminal: () => {
    set((state) => {
      const nextNum = state.terminals.length + 1;
      const newTerm = {
        id: `term-${Date.now()}`,
        title: `bash (${nextNum})`,
        logs: [
          {
            id: "1",
            type: "system",
            text: `CollabIDE Cloud Sandbox terminal session #${nextNum} ready.`,
          },
        ],
      };
      return {
        terminals: [...state.terminals, newTerm],
        activeTerminalId: newTerm.id,
        isBottomPanelOpen: true,
        activeBottomTab: "terminal",
      };
    });
  },

  closeTerminal: (id) => {
    set((state) => {
      if (state.terminals.length <= 1) return state;
      const next = state.terminals.filter((t) => t.id !== id);
      return {
        terminals: next,
        activeTerminalId:
          state.activeTerminalId === id ? next[0].id : state.activeTerminalId,
      };
    });
  },

  setActiveTerminal: (id) => set({ activeTerminalId: id }),

  runTerminalCommand: (id, command) => {
    const trimmed = command.trim();
    if (!trimmed) return;

    set((state) => {
      const term = state.terminals.find((t) => t.id === id);
      if (!term) return state;

      const newLogs = [
        ...term.logs,
        { id: `${Date.now()}-in`, type: "input", text: trimmed },
      ];

      const cmd = trimmed.toLowerCase();
      if (cmd === "clear") {
        return {
          terminals: state.terminals.map((t) =>
            t.id === id ? { ...t, logs: [] } : t,
          ),
        };
      } else if (cmd === "ls" || cmd === "ls -la" || cmd === "dir") {
        newLogs.push({
          id: `${Date.now()}-out`,
          type: "output",
          text: "public/  src/  package.json  README.md  tsconfig.json  vite.config.js",
        });
      } else if (cmd === "pwd") {
        newLogs.push({
          id: `${Date.now()}-out`,
          type: "output",
          text: "/home/collabide/collab-dashboard",
        });
      } else if (cmd === "git status") {
        newLogs.push({
          id: `${Date.now()}-out`,
          type: "output",
          text: `On branch ${state.currentBranch}\nYour branch is up to date with 'origin/${state.currentBranch}'.\nChanges not staged for commit:\n  (use "git add <file>..." to update what will be committed)\n\n\tmodified:   src/components/Header.jsx`,
        });
      } else if (cmd === "git log" || cmd === "git log -n 3") {
        newLogs.push({
          id: `${Date.now()}-out`,
          type: "output",
          text: `commit c2d8a41 (HEAD -> main, origin/main)\nAuthor: Rohit Sharma <rohit@collabide.dev>\nDate:   Fri Sep 5 14:10:00 2026 +0530\n\n    feat: integrate live cursor presence engine\n\ncommit 9b43ef0\nAuthor: Manish <manish@collabide.dev>\nDate:   Fri Sep 5 13:45:00 2026 +0530\n\n    style: apply tokenized dark electric violet theme`,
        });
      } else if (cmd === "npm run dev" || cmd === "vite") {
        newLogs.push(
          {
            id: `${Date.now()}-1`,
            type: "output",
            text: "  VITE v5.4.2  ready in 190 ms",
          },
          {
            id: `${Date.now()}-2`,
            type: "output",
            text: "  ➜  Local:   http://localhost:3000/",
          },
          {
            id: `${Date.now()}-3`,
            type: "output",
            text: "  ➜  Network: use --host to expose",
          },
        );
      } else if (cmd === "npm test" || cmd === "npm run test") {
        newLogs.push(
          {
            id: `${Date.now()}-1`,
            type: "output",
            text: "PASS src/components/Button.test.jsx (3 tests)",
          },
          {
            id: `${Date.now()}-2`,
            type: "output",
            text: "PASS src/components/Header.test.jsx (4 tests)",
          },
          {
            id: `${Date.now()}-3`,
            type: "output",
            text: "Test Suites: 2 passed, 2 total\nTests: 7 passed, 7 total",
          },
        );
      } else {
        newLogs.push({
          id: `${Date.now()}-out`,
          type: "output",
          text: `bash: command executed: ${trimmed} (exit code 0)`,
        });
      }

      return {
        terminals: state.terminals.map((t) =>
          t.id === id ? { ...t, logs: newLogs } : t,
        ),
      };
    });
  },

  clearTerminal: (id) => {
    set((state) => ({
      terminals: state.terminals.map((t) =>
        t.id === id ? { ...t, logs: [] } : t,
      ),
    }));
  },

  createFile: (parentPath, name) => {
    const ext = name.includes(".") ? name.split(".").pop() || "" : "";
    const langMap = {
      ts: "javascript",
      tsx: "javascript",
      js: "javascript",
      jsx: "javascript",
      json: "json",
      css: "css",
      html: "html",
      svg: "html",
      md: "markdown",
    };
    const cleanPath = parentPath ? `${parentPath}/${name}` : name;
    const newNode = {
      id: `file-${Date.now()}`,
      name,
      path: cleanPath,
      type: "file",
      language: langMap[ext] || "plaintext",
      content: `// ${name}\n\nexport const ${name.replace(/[^a-zA-Z0-9]/g, "")} = () => {\n  return null;\n};\n`,
    };

    set((state) => {
      const nextFiles = insertNode(state.files, parentPath, newNode);
      return {
        files: nextFiles,
        openTabIds: [...state.openTabIds, cleanPath],
        activeFileId: cleanPath,
      };
    });
  },

  createFolder: (parentPath, name) => {
    const cleanPath = parentPath ? `${parentPath}/${name}` : name;
    const newNode = {
      id: `folder-${Date.now()}`,
      name,
      path: cleanPath,
      type: "folder",
      children: [],
    };

    set((state) => ({
      files: insertNode(state.files, parentPath, newNode),
    }));
  },

  deleteNode: (path) => {
    set((state) => {
      const nextFiles = removeNode(state.files, path);
      const nextTabs = state.openTabIds.filter((t) => !t.startsWith(path));
      let nextActive = state.activeFileId;
      if (nextActive.startsWith(path)) {
        nextActive = nextTabs[nextTabs.length - 1] || "";
      }
      return {
        files: nextFiles,
        openTabIds: nextTabs,
        activeFileId: nextActive,
      };
    });
  },

  renameNode: (path, newName) => {
    set((state) => {
      const nextFiles = renameNodeInTree(state.files, path, newName);
      const parentDir = path.includes("/")
        ? path.substring(0, path.lastIndexOf("/"))
        : "";
      const newPath = parentDir ? `${parentDir}/${newName}` : newName;
      const nextTabs = state.openTabIds.map((t) => (t === path ? newPath : t));
      const nextActive =
        state.activeFileId === path ? newPath : state.activeFileId;
      return {
        files: nextFiles,
        openTabIds: nextTabs,
        activeFileId: nextActive,
      };
    });
  },

  moveNode: (sourcePath, targetFolderPath) => {
    set((state) => {
      const sourceNode = findNodeByPath(state.files, sourcePath);
      if (!sourceNode) return state;

      const withoutSource = removeNode(state.files, sourcePath);
      const newPath = `${targetFolderPath}/${sourceNode.name}`;
      const movedNode = {
        ...sourceNode,
        path: newPath,
      };
      const nextFiles = insertNode(withoutSource, targetFolderPath, movedNode);
      return { files: nextFiles };
    });
  },

  updateRemoteCursors: () => {
    set((state) => {
      // Simulate remote users moving their cursors every few seconds
      const simulated = state.collaborators.map((c) => {
        if (c.role === "Owner") return c; // current user
        if (c.status !== "online") return c;

        // Random slight jitter in line/column
        const currentLine = c.cursor?.lineNumber || 10;
        const delta = Math.floor(Math.random() * 3) - 1; // -1, 0, 1
        const nextLine = Math.max(2, Math.min(35, currentLine + delta));
        const nextCol = Math.floor(Math.random() * 30) + 4;

        return {
          ...c,
          cursor: { lineNumber: nextLine, column: nextCol },
          selection:
            Math.random() > 0.6
              ? {
                  startLineNumber: nextLine,
                  startColumn: Math.max(1, nextCol - 8),
                  endLineNumber: nextLine,
                  endColumn: nextCol + 10,
                }
              : undefined,
        };
      });
      return { collaborators: simulated };
    });
  },
}));
