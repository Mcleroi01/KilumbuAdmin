import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginForm from './components/auth/LoginForm';
import DashboardLayout from './components/layout/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Provinces from './pages/Provinces';
import ComingSoon from './pages/ComingSoon';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return user ? <>{children}</> : <Navigate to="/login" />;
};

const AppRoutes = () => {
  const { user } = useAuth();

  if (user) {
    return (
      <DashboardLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/provinces" element={<Provinces />} />
          <Route 
            path="/heroes" 
            element={
              <ComingSoon 
                title="Heróis Nacionais" 
                description="Gestão de dados dos heróis nacionais de Angola" 
              />
            } 
          />
          <Route 
            path="/languages" 
            element={
              <ComingSoon 
                title="Idiomas Nacionais" 
                description="Gestão dos idiomas falados em Angola" 
              />
            } 
          />
          <Route 
            path="/sites" 
            element={
              <ComingSoon 
                title="Sítios Culturais" 
                description="Gestão dos sítios culturais e históricos de Angola" 
              />
            } 
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </DashboardLayout>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={<LoginForm />} />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;