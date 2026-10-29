import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Explore from './pages/Explore';
import PropertyDetails from './pages/PropertyDetails';
import SavedProperties from './pages/SavedProperties';
import AIAssistant from './pages/AIAssistant';
import Activity from './pages/Activity';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import { SavedProvider } from './context/SavedPropertiesContext';

import LandRecords from './pages/LandRecords';
import IntelligenceReport from './pages/IntelligenceReport';
import PropertyComparison from './pages/PropertyComparison';
import BrokerDashboard from './pages/BrokerDashboard';

function App() {
  return (
    <SavedProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Navigate to="/explore" replace />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/property/:id" element={<PropertyDetails />} />
            <Route path="/saved" element={<SavedProperties />} />
            <Route path="/assistant" element={<AIAssistant />} />
            <Route path="/records" element={<LandRecords />} />
            <Route path="/intelligence" element={<IntelligenceReport />} />
            <Route path="/compare" element={<PropertyComparison />} />
            <Route path="/broker" element={<BrokerDashboard />} />
            <Route path="/activity" element={<Activity />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </Layout>
      </Router>
    </SavedProvider>
  );
}

export default App;
