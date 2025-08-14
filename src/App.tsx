import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginForm from './components/auth/LoginForm';
import DashboardLayout from './components/layout/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Provinces from './pages/Provinces';
import ComingSoon from './pages/ComingSoon';
import Heroes from './pages/Heroes';
import Linguas from './pages/linguas';
import Parcs from './pages/Parcs';
import Presidents from './pages/Presidents';
import HistoriaPage from './pages/historia';
import MusicaPage from './pages/musica';

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
          <Route path="/heroes" element={<Heroes />} />
          <Route path="/languages" element={<Linguas />} />
          <Route path="/parcs" element={<Parcs />} />
          <Route path="/presidents" element={<Presidents />} />
          <Route
            path="/sites"
            element={
              <ComingSoon
                title="Sítios Culturais"
                description="Gestão dos sítios culturais e históricos de Angola"
              />
            }
          />
          <Route path="/historia" element={<HistoriaPage />} />
          <Route path="/musica" element={<MusicaPage />} />
          <Route 
            path="/cozinha" 
            element={
              <ComingSoon 
                title="Cozinha Angolana" 
                description="Gestão dos pratos típicos e receitas tradicionais de Angola" 
              /> 
            } 
          />
          <Route 
            path="/feriados" 
            element={
              <ComingSoon 
                title="Feriados Nacionais" 
                description="Gestão dos feriados e datas comemorativas de Angola" 
              /> 
            } 
          />
          <Route 
            path="/locais-turisticos" 
            element={
              <ComingSoon 
                title="Locais Turísticos" 
                description="Gestão dos pontos turísticos e atrações de Angola" 
              /> 
            } 
          />
          <Route 
            path="/eventos" 
            element={
              <ComingSoon 
                title="Eventos Culturais" 
                description="Gestão dos eventos culturais e festivais de Angola" 
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