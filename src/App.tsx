import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Explore from './pages/Explore';
import PropertyDetails from './pages/PropertyDetails';
import SavedProperties from './pages/SavedProperties';
import AIAssistant from './pages/AIAssistant';
import Activity from './pages/Activity';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import { SavedProvider } from './context/SavedPropertiesContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import LandRecords from './pages/LandRecords';
import IntelligenceReport from './pages/IntelligenceReport';
import PropertyComparison from './pages/PropertyComparison';
import BrokerDashboard from './pages/BrokerDashboard';
import Onboarding, { ONBOARDING_STORAGE_KEY } from './pages/Onboarding';
import Auth from './pages/Auth';
import ResetPassword from './pages/ResetPassword';

function AppRoutes() {
  const { user, isConfigured, loading } = useAuth();
  const [isOnboarded, setIsOnboarded] = useState<boolean>(() => {
    try {
      return localStorage.getItem(ONBOARDING_STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  });

  // While restoring session from local storage / Supabase on app open, show branded loading screen
  if (loading) {
    return (
      <div className="min-h-[100dvh] w-full bg-[#FFF3E3] flex flex-col items-center justify-center p-6 text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#E86A17] to-[#C54E12] flex items-center justify-center text-white font-black text-xl shadow-md shadow-[#E86A17]/25 animate-pulse">
          L
        </div>
        <p className="text-xs font-bold text-[#6B5E54]">Loading LandLens AI...</p>
      </div>
    );
  }

  return (
    <Routes>
      {/* Standalone Onboarding Route */}
      <Route
        path="/onboarding"
        element={
          <Onboarding
            onComplete={() => {
              setIsOnboarded(true);
              window.location.href = isConfigured && !user ? '/auth' : '/home';
            }}
          />
        }
      />

      {/* Standalone Auth Routes without bottom/side nav layout */}
      <Route
        path="/auth"
        element={user ? <Navigate to="/home" replace /> : <Auth />}
      />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Core Application Routes wrapped in Layout */}
      <Route
        path="/*"
        element={
          <Layout>
            <Routes>
              <Route
                path="/"
                element={
                  !isOnboarded ? (
                    <Navigate to="/onboarding" replace />
                  ) : (
                    <Navigate to="/home" replace />
                  )
                }
              />
              <Route path="/home" element={<Home />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/property/:id" element={<PropertyDetails />} />
              <Route
                path="/saved"
                element={
                  <ProtectedRoute>
                    <SavedProperties />
                  </ProtectedRoute>
                }
              />
              <Route path="/assistant" element={<AIAssistant />} />
              <Route path="/records" element={<LandRecords />} />
              <Route path="/intelligence" element={<IntelligenceReport />} />
              <Route path="/compare" element={<PropertyComparison />} />
              <Route path="/broker" element={<BrokerDashboard />} />
              <Route path="/activity" element={<Activity />} />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route path="/admin" element={<AdminDashboard />} />
            </Routes>
          </Layout>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <SavedProvider>
        <Router>
          <AppRoutes />
        </Router>
      </SavedProvider>
    </AuthProvider>
  );
}

export default App;

