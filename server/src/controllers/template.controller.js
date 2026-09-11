import { asyncHandler } from "../utils/asyncHandler.js";

const TEMPLATES = [
  { id: 'react-vite', name: 'React + Vite', description: 'Modern React starter with fast HMR', icon: 'react', language: 'JavaScript' },
  { id: 'node-express', name: 'Node.js Express', description: 'Basic REST API setup', icon: 'nodejs', language: 'JavaScript' },
  { id: 'html-css-js', name: 'Vanilla Web', description: 'HTML, CSS, and JS', icon: 'html', language: 'HTML' }
];

export const getTemplates = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true, data: TEMPLATES });
});
