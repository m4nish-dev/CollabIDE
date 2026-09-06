export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  DASHBOARD: '/dashboard',
  PROJECTS: '/projects',
  SHARED: '/shared',
  STARRED: '/starred',
  TEMPLATES: '/templates',
  WORKSPACE: (id) => `/workspace/${id}`,
  PROJECT: (id) => `/project/${id}`,
  NOTIFICATIONS: '/notifications',
  ACTIVITY: '/activity',
  SETTINGS_PROFILE: '/settings/profile',
  SETTINGS_ACCOUNT: '/settings/account',
  SETTINGS_APPEARANCE: '/settings/appearance',
  SETTINGS_EDITOR: '/settings/editor',
  SETTINGS_KEYBOARD: '/settings/keyboard',
  SETTINGS_NOTIFICATIONS: '/settings/notifications',
  SETTINGS_SECURITY: '/settings/security',
  SETTINGS_CONNECTIONS: '/settings/connections',
  SETTINGS_SESSIONS: '/settings/sessions',
  WORKSPACE_SETTINGS_GENERAL: '/workspace/settings/general',
  WORKSPACE_SETTINGS_MEMBERS: '/workspace/settings/members',
  WORKSPACE_SETTINGS_DANGER: '/workspace/settings/danger',
  SHOWCASE: '/_showcase', // Dev-only
};

export const KEYBOARD_SHORTCUTS = {
  SAVE: { keys: ['⌘', 'S'], description: 'Save current file', id: 'save' },
  COMMAND_PALETTE: { keys: ['⌘', '⇧', 'P'], description: 'Command Palette', id: 'cmd_palette' },
  QUICK_OPEN: { keys: ['⌘', 'P'], description: 'Quick Open', id: 'quick_open' },
  GLOBAL_SEARCH: { keys: ['⌘', 'K'], description: 'Global Search', id: 'global_search' },
  FIND_IN_FILES: { keys: ['⌘', '⇧', 'F'], description: 'Find in files', id: 'find_in_files' },
  TOGGLE_SIDEBAR: { keys: ['⌘', 'B'], description: 'Toggle Sidebar', id: 'toggle_sidebar' },
  TOGGLE_TERMINAL: { keys: ['⌘', 'J'], description: 'Toggle Bottom Panel', id: 'toggle_terminal' },
  SPLIT_EDITOR: { keys: ['⌘', '\\'], description: 'Split Editor', id: 'split_editor' },
  CLOSE_TAB: { keys: ['⌘', 'W'], description: 'Close Tab', id: 'close_tab' },
};

export const ROLES = {
  OWNER: {
    id: 'owner',
    name: 'Owner',
    description: 'Full access to all project settings and members.',
    permissions: ['read', 'write', 'delete', 'manage_access', 'manage_settings'],
  },
  ADMIN: {
    id: 'admin',
    name: 'Admin',
    description: 'Can edit files, run code, and manage non-owner access.',
    permissions: ['read', 'write', 'manage_access'],
  },
  EDITOR: {
    id: 'editor',
    name: 'Editor',
    description: 'Can edit files and run code. Cannot manage access.',
    permissions: ['read', 'write'],
  },
  VIEWER: {
    id: 'viewer',
    name: 'Viewer',
    description: 'Can only view files and terminal output.',
    permissions: ['read'],
  },
};

export const LANGUAGES = {
  javascript: { name: 'JavaScript', ext: '.js', id: 'javascript', color: 'text-yellow-400' },
  typescript: { name: 'TypeScript', ext: '.ts', id: 'typescript', color: 'text-blue-400' },
  react: { name: 'React', ext: '.jsx', id: 'javascript', color: 'text-cyan-400' },
  python: { name: 'Python', ext: '.py', id: 'python', color: 'text-blue-500' },
  html: { name: 'HTML', ext: '.html', id: 'html', color: 'text-orange-500' },
  css: { name: 'CSS', ext: '.css', id: 'css', color: 'text-blue-300' },
  json: { name: 'JSON', ext: '.json', id: 'json', color: 'text-emerald-400' },
  markdown: { name: 'Markdown', ext: '.md', id: 'markdown', color: 'text-zinc-400' },
  rust: { name: 'Rust', ext: '.rs', id: 'rust', color: 'text-orange-700' },
  go: { name: 'Go', ext: '.go', id: 'go', color: 'text-cyan-500' },
};

export const COLLABORATOR_COLORS = [
  '#FF3B30', // Red
  '#FF9500', // Orange
  '#FFCC00', // Yellow
  '#4CD964', // Green
  '#5AC8FA', // Light Blue
  '#007AFF', // Blue
  '#5856D6', // Purple
  '#FF2D55', // Pink
];

export const STATUS_TYPES = {
  ONLINE: 'online',
  AWAY: 'away',
  OFFLINE: 'offline',
  DO_NOT_DISTURB: 'dnd',
};
