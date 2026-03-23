import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import './index.css';

// Layout wrapper for authenticated routes
const AuthenticatedLayout = () => (
  <MainLayout>
    <Outlet />
  </MainLayout>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Route */}
          <Route path="/login" element={<Login />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AuthenticatedLayout />}>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/analytics" element={<Analytics />} />
              
              {/* Admin Only Route */}
              <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                <Route path="/settings" element={<Settings />} />
              </Route>
            </Route>
          </Route>

          <Route path="*" element={
            <div className="flex flex-col items-center justify-center h-screen text-slate-400 bg-background">
              <h2 className="text-4xl font-bold mb-2 text-white">404</h2>
              <p className="text-lg">Access Terminal Unauthorized / Path Not Found</p>
              <button 
                onClick={() => window.location.href = '/'}
                className="mt-6 px-4 py-2 bg-accent text-background rounded-lg font-bold"
              >
                RETURN TO HOME
              </button>
            </div>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
