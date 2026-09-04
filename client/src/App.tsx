import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

const Placeholder = ({ title }: { title: string }) => (
  <div className="min-h-screen flex items-center justify-center">
    <h1 className="text-4xl font-bold">{title}</h1>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Placeholder title="Login Page" />} />
        <Route path="/signup" element={<Placeholder title="Signup Page" />} />
        <Route path="/onboarding" element={<Placeholder title="Onboarding Page" />} />
        <Route path="/dashboard" element={<Placeholder title="Dashboard Page" />} />
        <Route path="/workspace/:id" element={<Placeholder title="Workspace Page" />} />
        <Route path="/project/:id" element={<Placeholder title="Project Page" />} />
        <Route path="/settings" element={<Placeholder title="Settings Page" />} />
        <Route path="/404" element={<Placeholder title="404 Not Found" />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
