// src/lib/mockData.js

export const currentUser = {
  id: 'usr_1',
  name: 'Alex Developer',
  email: 'alex@example.com',
  avatar: 'https://i.pravatar.cc/150?u=alex',
  bio: 'Full-stack developer passionate about DX and tooling.',
  status: 'online',
  stats: {
    projects: 14,
    collaborators: 8,
    commits: 342,
  },
};

export const mockCollaborators = [
  { id: 'collab_1', name: 'Sarah Chen', email: 'sarah@example.com', avatar: 'https://i.pravatar.cc/150?u=sarah', role: 'admin', status: 'online', color: '#FF3B30' },
  { id: 'collab_2', name: 'David Kim', email: 'david@example.com', avatar: 'https://i.pravatar.cc/150?u=david', role: 'editor', status: 'offline', color: '#FF9500' },
  { id: 'collab_3', name: 'Elena Rodriguez', email: 'elena@example.com', avatar: 'https://i.pravatar.cc/150?u=elena', role: 'editor', status: 'away', color: '#FFCC00' },
  { id: 'collab_4', name: 'James Wilson', email: 'james@example.com', avatar: 'https://i.pravatar.cc/150?u=james', role: 'viewer', status: 'online', color: '#4CD964' },
  { id: 'collab_5', name: 'Maria Garcia', email: 'maria@example.com', avatar: 'https://i.pravatar.cc/150?u=maria', role: 'admin', status: 'dnd', color: '#5AC8FA' },
  { id: 'collab_6', name: 'Wei Zhang', email: 'wei@example.com', avatar: 'https://i.pravatar.cc/150?u=wei', role: 'editor', status: 'online', color: '#007AFF' },
  { id: 'collab_7', name: 'Sophie Martin', email: 'sophie@example.com', avatar: 'https://i.pravatar.cc/150?u=sophie', role: 'editor', status: 'offline', color: '#5856D6' },
  { id: 'collab_8', name: 'Thomas Mueller', email: 'thomas@example.com', avatar: 'https://i.pravatar.cc/150?u=thomas', role: 'viewer', status: 'online', color: '#FF2D55' },
];

export const mockProjects = [
  { id: 'proj_1', name: 'Nexus Dashboard', description: 'Next.js admin dashboard with real-time analytics', language: 'React', framework: 'Next.js', updatedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), collaborators: [mockCollaborators[0], mockCollaborators[1]] },
  { id: 'proj_2', name: 'Go Microservice API', description: 'High-performance user auth microservice', language: 'Go', framework: 'Gin', updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), collaborators: [mockCollaborators[2]] },
  { id: 'proj_3', name: 'Data Pipeline Worker', description: 'Python script for ETL processing', language: 'Python', framework: 'Pandas', updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), collaborators: [] },
  { id: 'proj_4', name: 'Mobile App Backend', description: 'Express.js backend for the iOS app', language: 'Node.js', framework: 'Express', updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), collaborators: [mockCollaborators[3], mockCollaborators[4], mockCollaborators[5]] },
  { id: 'proj_5', name: 'Rust CLI Tool', description: 'Blazing fast search utility', language: 'Rust', framework: 'Cargo', updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), collaborators: [mockCollaborators[0]] },
  { id: 'proj_6', name: 'Marketing Website', description: 'Static site using Astro', language: 'HTML', framework: 'Astro', updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(), collaborators: [mockCollaborators[6]] },
  { id: 'proj_7', name: 'ML Training Scripts', description: 'PyTorch models for image recognition', language: 'Python', framework: 'PyTorch', updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 120).toISOString(), collaborators: [mockCollaborators[2], mockCollaborators[7]] },
  { id: 'proj_8', name: 'Design System', description: 'React component library using Storybook', language: 'React', framework: 'Vite', updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 144).toISOString(), collaborators: [mockCollaborators[0], mockCollaborators[1], mockCollaborators[4]] },
  { id: 'proj_9', name: 'Payment Gateway Integration', description: 'Stripe webhook handlers', language: 'Node.js', framework: 'Express', updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 168).toISOString(), collaborators: [mockCollaborators[5]] },
  { id: 'proj_10', name: 'Customer Portal', description: 'Vue 3 single page application', language: 'Vue', framework: 'Vue 3', updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 192).toISOString(), collaborators: [] },
  { id: 'proj_11', name: 'Legacy API', description: 'Old PHP monolith', language: 'PHP', framework: 'Laravel', updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 240).toISOString(), collaborators: [mockCollaborators[1]] },
  { id: 'proj_12', name: 'WebSocket Server', description: 'Real-time chat server', language: 'Node.js', framework: 'Socket.io', updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 288).toISOString(), collaborators: [mockCollaborators[0], mockCollaborators[2]] },
];

export const mockActivities = [
  { id: 'act_1', user: mockCollaborators[0], action: 'pushed to', target: 'main', project: mockProjects[0], time: '2 mins ago', timestamp: new Date(Date.now() - 1000 * 60 * 2).toISOString(), type: 'commit' },
  { id: 'act_2', user: mockCollaborators[1], action: 'commented on', target: 'App.jsx', project: mockProjects[0], time: '1 hour ago', timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(), type: 'comment' },
  { id: 'act_3', user: currentUser, action: 'created project', target: '', project: mockProjects[1], time: '2 hours ago', timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(), type: 'project_created' },
  { id: 'act_4', user: mockCollaborators[2], action: 'resolved conflict in', target: 'utils.py', project: mockProjects[2], time: '5 hours ago', timestamp: new Date(Date.now() - 1000 * 60 * 300).toISOString(), type: 'file_changed' },
  { id: 'act_5', user: mockCollaborators[3], action: 'invited', target: 'Maria Garcia', project: mockProjects[3], time: '1 day ago', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), type: 'member_added' },
  { id: 'act_6', user: mockCollaborators[4], action: 'joined project', target: '', project: mockProjects[3], time: '1 day ago', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), type: 'member_added' },
  { id: 'act_7', user: currentUser, action: 'deleted branch', target: 'feature/auth', project: mockProjects[0], time: '2 days ago', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), type: 'branch_deleted' },
  { id: 'act_8', user: mockCollaborators[5], action: 'pushed 3 commits to', target: 'fix/payment', project: mockProjects[8], time: '3 days ago', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), type: 'commit' },
  { id: 'act_9', user: mockCollaborators[6], action: 'deployed', target: 'v1.0.4', project: mockProjects[5], time: '4 days ago', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(), type: 'deploy' },
  { id: 'act_10', user: mockCollaborators[7], action: 'starred project', target: '', project: mockProjects[6], time: '5 days ago', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 120).toISOString(), type: 'star' },
  { id: 'act_11', user: mockCollaborators[0], action: 'closed issue', target: '#42', project: mockProjects[7], time: '1 week ago', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 168).toISOString(), type: 'issue_closed' },
  { id: 'act_12', user: currentUser, action: 'opened issue', target: '#43', project: mockProjects[7], time: '1 week ago', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 168).toISOString(), type: 'issue_opened' },
  { id: 'act_13', user: mockCollaborators[1], action: 'renamed project to', target: 'Legacy API', project: mockProjects[10], time: '1 week ago', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 168).toISOString(), type: 'settings_updated' },
  { id: 'act_14', user: mockCollaborators[2], action: 'pushed to', target: 'dev', project: mockProjects[11], time: '2 weeks ago', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 336).toISOString(), type: 'commit' },
  { id: 'act_15', user: currentUser, action: 'created project', target: '', project: mockProjects[11], time: '2 weeks ago', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 336).toISOString(), type: 'project_created' },
];

export const mockTemplates = [
  { id: 'tpl_1', name: 'React + Vite', description: 'Modern React starter with fast HMR', icon: 'react', language: 'JavaScript' },
  { id: 'tpl_2', name: 'Next.js App', description: 'Full-stack React framework', icon: 'nextjs', language: 'JavaScript' },
  { id: 'tpl_3', name: 'Node.js Express', description: 'Basic REST API setup', icon: 'nodejs', language: 'JavaScript' },
  { id: 'tpl_4', name: 'Express + MongoDB', description: 'MERN stack backend', icon: 'nodejs', language: 'JavaScript' },
  { id: 'tpl_5', name: 'Python Flask', description: 'Lightweight web server', icon: 'python', language: 'Python' },
  { id: 'tpl_6', name: 'Django REST', description: 'Robust Python backend', icon: 'python', language: 'Python' },
  { id: 'tpl_7', name: 'Vanilla Web', description: 'HTML, CSS, and JS', icon: 'html', language: 'HTML' },
  { id: 'tpl_8', name: 'Vue 3', description: 'Progressive JavaScript framework', icon: 'vue', language: 'JavaScript' },
  { id: 'tpl_9', name: 'Svelte Kit', description: 'Cybernetically enhanced web apps', icon: 'svelte', language: 'JavaScript' },
  { id: 'tpl_10', name: 'Static Site', description: 'Basic static files', icon: 'html', language: 'HTML' },
  { id: 'tpl_11', name: 'Rust CLI', description: 'Command line tool in Rust', icon: 'rust', language: 'Rust' },
  { id: 'tpl_12', name: 'Go Web Server', description: 'Standard net/http server', icon: 'go', language: 'Go' },
];

export const mockNotifications = [
  { id: 'notif_1', type: 'mention', content: 'Sarah Chen mentioned you in App.jsx', time: '2m ago', read: false },
  { id: 'notif_2', type: 'invite', content: 'David Kim invited you to Design System', time: '1h ago', read: false },
  { id: 'notif_3', type: 'system', content: 'Your workspace limits have been updated', time: '3h ago', read: true },
  { id: 'notif_4', type: 'comment', content: 'Elena replied to your comment', time: '5h ago', read: true },
  { id: 'notif_5', type: 'mention', content: 'James Wilson mentioned you in PR #42', time: '1d ago', read: true },
  { id: 'notif_6', type: 'alert', content: 'Deployment failed for Marketing Website', time: '1d ago', read: true },
  { id: 'notif_7', type: 'invite', content: 'Wei Zhang invited you to Mobile App Backend', time: '2d ago', read: true },
  { id: 'notif_8', type: 'comment', content: 'New comment on your commit', time: '3d ago', read: true },
  { id: 'notif_9', type: 'system', content: 'Scheduled maintenance this weekend', time: '1w ago', read: true },
  { id: 'notif_10', type: 'mention', content: 'Maria Garcia mentioned you in utils.py', time: '1w ago', read: true },
  { id: 'notif_11', type: 'alert', content: 'Build success for Go Microservice API', time: '1w ago', read: true },
  { id: 'notif_12', type: 'comment', content: 'Thomas Mueller approved your PR', time: '2w ago', read: true },
  { id: 'notif_13', type: 'invite', content: 'Sophie Martin invited you to Legacy API', time: '2w ago', read: true },
  { id: 'notif_14', type: 'system', content: 'Welcome to CollabIDE!', time: '1mo ago', read: true },
  { id: 'notif_15', type: 'mention', content: 'Sarah Chen mentioned you in README.md', time: '1mo ago', read: true },
];

export const mockGitCommits = [
  { id: 'g_1', hash: 'a1b2c3d', message: 'feat: add authentication middleware', author: 'Sarah Chen', date: '2 hours ago' },
  { id: 'g_2', hash: 'e4f5g6h', message: 'fix: resolve race condition in state', author: 'Alex Developer', date: '5 hours ago' },
  { id: 'g_3', hash: 'i7j8k9l', message: 'docs: update readme instructions', author: 'David Kim', date: '1 day ago' },
  { id: 'g_4', hash: 'm0n1o2p', message: 'refactor: extract user hook', author: 'Alex Developer', date: '1 day ago' },
  { id: 'g_5', hash: 'q3r4s5t', message: 'chore: update dependencies', author: 'Wei Zhang', date: '2 days ago' },
  { id: 'g_6', hash: 'u6v7w8x', message: 'feat: implement dark mode toggle', author: 'Elena Rodriguez', date: '3 days ago' },
  { id: 'g_7', hash: 'y9z0a1b', message: 'fix: padding on mobile navbar', author: 'Alex Developer', date: '4 days ago' },
  { id: 'g_8', hash: 'c2d3e4f', message: 'style: format with prettier', author: 'Sarah Chen', date: '5 days ago' },
  { id: 'g_9', hash: 'g5h6i7j', message: 'test: add unit tests for utils', author: 'James Wilson', date: '1 week ago' },
  { id: 'g_10', hash: 'k8l9m0n', message: 'feat: initialize project structure', author: 'Alex Developer', date: '1 week ago' },
  { id: 'g_11', hash: 'o1p2q3r', message: 'Initial commit', author: 'Alex Developer', date: '2 weeks ago' },
];

export const mockTerminalResponses = {
  'ls': 'src\npublic\npackage.json\nvite.config.js\nREADME.md',
  'pwd': '/Users/alex/projects/nexus-dashboard',
  'npm run dev': '>\n> vite\n\n  VITE v5.0.0  ready in 350 ms\n\n  ➜  Local:   http://localhost:5173/\n  ➜  Network: use --host to expose\n',
  'npm install': 'added 145 packages, and audited 146 packages in 2s\n\n24 packages are looking for funding\n  run `npm fund` for details\n\nfound 0 vulnerabilities',
  'git status': 'On branch main\nYour branch is up to date with "origin/main".\n\nnothing to commit, working tree clean',
  'git log': 'commit a1b2c3d\nAuthor: Sarah Chen <sarah@example.com>\nDate:   Thu Sep 5 14:00:00 2026\n\n    feat: add authentication middleware',
  'clear': '',
  'help': 'Available mock commands: ls, pwd, npm run dev, npm install, git status, git log, clear, help',
};

// Tree helper for initial structure
const generateId = () => Math.random().toString(36).substr(2, 9);

export const getReactFileTree = () => [
  {
    id: generateId(),
    name: 'src',
    type: 'folder',
    children: [
      {
        id: generateId(),
        name: 'components',
        type: 'folder',
        children: [
          { id: 'file_1', name: 'App.jsx', type: 'file', content: `import React, { useState } from 'react';\nimport './App.css';\n\nfunction App() {\n  const [count, setCount] = useState(0);\n\n  return (\n    <div className="App">\n      <header className="App-header">\n        <h1>Hello React!</h1>\n        <button onClick={() => setCount(count + 1)}>\n          Count is: {count}\n        </button>\n      </header>\n    </div>\n  );\n}\n\nexport default App;\n` },
          { id: 'file_2', name: 'Button.jsx', type: 'file', content: `import React from 'react';\n\nexport const Button = ({ children, onClick }) => (\n  <button \n    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"\n    onClick={onClick}\n  >\n    {children}\n  </button>\n);\n` }
        ]
      },
      { id: 'file_3', name: 'main.jsx', type: 'file', content: `import React from 'react'\nimport ReactDOM from 'react-dom/client'\nimport App from './components/App'\nimport './index.css'\n\nReactDOM.createRoot(document.getElementById('root')).render(\n  <React.StrictMode>\n    <App />\n  </React.StrictMode>,\n)\n` },
      { id: 'file_4', name: 'index.css', type: 'file', content: `body {\n  margin: 0;\n  font-family: sans-serif;\n}\n` }
    ]
  },
  { id: 'file_5', name: 'package.json', type: 'file', content: `{\n  "name": "react-app",\n  "version": "1.0.0",\n  "dependencies": {\n    "react": "^18.2.0",\n    "react-dom": "^18.2.0"\n  }\n}\n` },
  { id: 'file_6', name: 'README.md', type: 'file', content: `# React App\n\nThis is a sample React application.\n` }
];

export const getNodeFileTree = () => [
  {
    id: generateId(),
    name: 'src',
    type: 'folder',
    children: [
      { id: 'file_1', name: 'index.js', type: 'file', content: `const express = require('express');\nconst app = express();\nconst PORT = process.env.PORT || 3000;\n\napp.use(express.json());\n\napp.get('/', (req, res) => {\n  res.json({ message: 'Welcome to the API' });\n});\n\napp.listen(PORT, () => {\n  console.log(\`Server running on port \${PORT}\`);\n});\n` },
      { id: 'file_2', name: 'routes.js', type: 'file', content: `const express = require('express');\nconst router = express.Router();\n\nrouter.get('/users', (req, res) => {\n  res.json([{ id: 1, name: 'Alice' }]);\n});\n\nmodule.exports = router;\n` }
    ]
  },
  { id: 'file_3', name: 'package.json', type: 'file', content: `{\n  "name": "node-api",\n  "main": "src/index.js",\n  "dependencies": {\n    "express": "^4.18.2"\n  }\n}\n` },
  { id: 'file_4', name: '.env', type: 'file', content: `PORT=3000\nDB_URL=mongodb://localhost:27017/dev\n` }
];

export const getPythonFileTree = () => [
  {
    id: generateId(),
    name: 'app',
    type: 'folder',
    children: [
      { id: 'file_1', name: 'main.py', type: 'file', content: `from flask import Flask, jsonify\n\napp = Flask(__name__)\n\n@app.route('/')\ndef hello():\n    return jsonify({"status": "ok", "message": "Hello Python!"})\n\nif __name__ == '__main__':\n    app.run(port=5000)\n` },
      { id: 'file_2', name: 'models.py', type: 'file', content: `class User:\n    def __init__(self, id, name):\n        self.id = id\n        self.name = name\n\n    def to_dict(self):\n        return {"id": self.id, "name": self.name}\n` }
    ]
  },
  { id: 'file_3', name: 'requirements.txt', type: 'file', content: `Flask==2.2.2\nWerkzeug==2.2.2\n` },
  { id: 'file_4', name: 'README.md', type: 'file', content: `# Python App\n\nSimple Flask application.\n` }
];

// Aliases for backwards compatibility with existing components
export const PROJECTS = mockProjects;
export const COLLABORATORS = mockCollaborators;
export const MOCK_ACTIVITIES = mockActivities;
export const ACTIVITIES = mockActivities;
export const MOCK_NOTIFICATIONS = mockNotifications;

export const GIT_COMMITS = mockGitCommits;
export const GIT_WORKING_TREE = [
  { id: 'f_1', path: 'src/components/Button.jsx', status: 'M', staged: true },
  { id: 'f_2', path: 'src/App.jsx', status: 'M', staged: false },
  { id: 'f_3', path: 'src/utils/helpers.js', status: 'A', staged: true },
  { id: 'f_4', path: 'package.json', status: 'M', staged: false },
];
export const GIT_BRANCHES = [
  { id: 'b_1', name: 'main', current: false },
  { id: 'b_2', name: 'feature/auth', current: true },
  { id: 'b_3', name: 'fix/navbar', current: false },
];
