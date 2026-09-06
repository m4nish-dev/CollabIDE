# CollabIDE

CollabIDE is a browser-based collaborative Integrated Development Environment (IDE) designed for modern web development. Built with React and tailored for an exceptional developer experience, it features a comprehensive design system, a rich file explorer, integrated source control, and a customizable terminal interface.

## 🚀 Tech Stack
- **Frontend Framework**: React 19 + Vite
- **Styling**: TailwindCSS, CSS Variables (Custom Design System)
- **State Management**: Zustand
- **Animations**: Framer Motion
- **Editor**: Monaco Editor (`@monaco-editor/react`)
- **Routing**: React Router DOM v7
- **Icons**: Lucide React
- **Components**: Radix UI Primitives (Accessible components)
- **Form Handling & Validation**: React Hook Form, Zod
- **Linting & Formatting**: ESLint, Prettier

## 📂 Folder Structure
\`\`\`
client/
├── public/                 # Static assets
├── src/
│   ├── components/
│   │   ├── features/       # Complex domain-specific features (e.g. source control)
│   │   ├── ide/            # IDE layout components (File explorer, Terminal, Panels)
│   │   ├── layout/         # App layouts and wrappers (AppShell, SettingsLayout)
│   │   ├── shared/         # Reusable UI building blocks (Skeletons, empty states)
│   │   └── ui/             # Core base components (Buttons, inputs, dropdowns)
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility functions, mock data, and constants
│   ├── pages/              # Route level components
│   └── store/              # Zustand state stores
├── index.css               # Global CSS and Tailwind directives
└── App.jsx                 # Application entry point and routing
\`\`\`

## 🛠️ How to run locally
1. Install dependencies
   \`\`\`bash
   npm install
   \`\`\`
2. Copy environment variables
   \`\`\`bash
   cp .env.example .env
   \`\`\`
3. Start the development server
   \`\`\`bash
   npm run dev
   \`\`\`

## 🎨 Design System Tokens
CollabIDE uses a custom design system with semantic variables:
- **Backgrounds**: `bg-background`, `bg-background-elevated`, `bg-background-hover`
- **Text**: `text-foreground`, `text-foreground-muted`, `text-foreground-subtle`
- **Accents**: `accent`, `accent-hover`, `accent-glow` (default purple theme)
- **Borders**: `border-border`, `border-border-strong`

## 🛣️ Roadmap
- **Phase 1 (Current)**: Frontend architecture, UX design, mock state modeling.
- **Phase 2 (Upcoming)**: Backend integration (Node.js/Express).
- **Phase 3 (Upcoming)**: WebSockets (Real-time collaborative editing using Yjs or similar).
- **Phase 4 (Upcoming)**: Containerized environments (Docker integration for real terminal execution).
