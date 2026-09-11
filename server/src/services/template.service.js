import { File } from "../models/File.js";

const TEMPLATES = {
  "react-vite": [
    {
      path: "package.json",
      type: "file",
      language: "json",
      parentPath: "",
      name: "package.json",
      content: `{
  "name": "react-vite-app",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.1",
    "vite": "^5.1.4"
  }
}`,
    },
    {
      path: "vite.config.js",
      type: "file",
      language: "javascript",
      parentPath: "",
      name: "vite.config.js",
      content: `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
})`,
    },
    {
      path: "index.html",
      type: "file",
      language: "html",
      parentPath: "",
      name: "index.html",
      content: `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite + React</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>`,
    },
    {
      path: "src",
      type: "folder",
      language: "",
      parentPath: "",
      name: "src",
      content: "",
    },
    {
      path: "src/main.jsx",
      type: "file",
      language: "javascript",
      parentPath: "src",
      name: "main.jsx",
      content: `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)`,
    },
    {
      path: "src/App.jsx",
      type: "file",
      language: "javascript",
      parentPath: "src",
      name: "App.jsx",
      content: `import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
      </div>
    </>
  )
}

export default App`,
    },
    {
      path: "src/App.css",
      type: "file",
      language: "css",
      parentPath: "src",
      name: "App.css",
      content: `#root {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}`,
    },
    {
      path: "src/index.css",
      type: "file",
      language: "css",
      parentPath: "src",
      name: "index.css",
      content: `body {
  margin: 0;
  display: flex;
  place-items: center;
  min-width: 320px;
  min-height: 100vh;
}`,
    },
  ],
  "node-express": [
    {
      path: "package.json",
      type: "file",
      language: "json",
      parentPath: "",
      name: "package.json",
      content: `{
  "name": "node-express-app",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "start": "node index.js"
  },
  "dependencies": {
    "express": "^4.18.2"
  }
}`,
    },
    {
      path: "index.js",
      type: "file",
      language: "javascript",
      parentPath: "",
      name: "index.js",
      content: `const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(\`Example app listening on port \${port}\`);
});`,
    },
    {
      path: ".gitignore",
      type: "file",
      language: "ignore",
      parentPath: "",
      name: ".gitignore",
      content: `node_modules
.env`,
    },
  ],
  "html-css-js": [
    {
      path: "index.html",
      type: "file",
      language: "html",
      parentPath: "",
      name: "index.html",
      content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <h1>Hello World</h1>
  <script src="script.js"></script>
</body>
</html>`,
    },
    {
      path: "style.css",
      type: "file",
      language: "css",
      parentPath: "",
      name: "style.css",
      content: `body {
  font-family: sans-serif;
  text-align: center;
  padding-top: 50px;
}`,
    },
    {
      path: "script.js",
      type: "file",
      language: "javascript",
      parentPath: "",
      name: "script.js",
      content: `console.log("Hello from script.js");`,
    },
  ],
};

export const seedProjectFiles = async (projectId, templateId) => {
  const filesToSeed = TEMPLATES[templateId];
  if (!filesToSeed) return;

  const fileDocs = filesToSeed.map((f) => ({
    ...f,
    projectId,
  }));

  await File.insertMany(fileDocs);
};
