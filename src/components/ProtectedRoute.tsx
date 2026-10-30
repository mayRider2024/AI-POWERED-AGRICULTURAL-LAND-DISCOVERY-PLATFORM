import { type ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading, isConfigured } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center p-6 text-[#8C7A6B]">
        <Loader2 size={24} className="animate-spin text-[#E86A17] mb-2" />
        <span className="text-xs font-semibold">Authenticating…</span>
      </div>
    );
  }

  // If Supabase is not configured yet with anon key, allow user access in demo mode with warning
  if (!isConfigured) {
    return <>{children}</>;
  }

  // If user is not authenticated, redirect to /auth preserving intended location
  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
