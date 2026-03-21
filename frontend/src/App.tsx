import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import './index.css';

function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={
            <div className="flex flex-col items-center justify-center h-full text-slate-400">
              <h2 className="text-2xl font-bold mb-2">404</h2>
              <p>Page not found</p>
            </div>
          } />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;
