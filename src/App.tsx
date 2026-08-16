import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { LandingPage } from '@/pages/LandingPage';
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { DashboardLayout } from '@/components/DashboardLayout';
import { DashboardHome } from '@/pages/DashboardHome';
import { AIAssistantPage } from '@/pages/AIAssistantPage';
import { NotesPage } from '@/pages/NotesPage';
import { SubjectsPage } from '@/pages/SubjectsPage';
import { TasksPage } from '@/pages/TasksPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { Spinner } from '@/components/ui/Card';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuth();
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }
  if (!session) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function PublicOnly({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuth();
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }
  if (session) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<PublicOnly><LoginPage /></PublicOnly>} />
        <Route path="/register" element={<PublicOnly><RegisterPage /></PublicOnly>} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardHome />} />
          <Route path="assistant" element={<AIAssistantPage />} />
          <Route path="notes" element={<NotesPage />} />
          <Route path="subjects" element={<SubjectsPage />} />
          <Route path="tasks" element={<TasksPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
