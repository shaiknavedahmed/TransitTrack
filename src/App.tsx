import React, { useState } from 'react';
import { TransitProvider, useTransit } from './context/TransitContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { AlertBanner } from './components/layout/AlertBanner';

// Screens
import { LiveMapScreen } from './screens/LiveMapScreen';
import { TimetableScreen } from './screens/TimetableScreen';
import { FeedbackScreen } from './screens/FeedbackScreen';
import { AuthScreen } from './screens/AuthScreen';
import { AdminDashboard } from './screens/AdminDashboard';
import { OperatorScreen } from './screens/OperatorScreen';
import { DriverCockpit } from './screens/DriverCockpit';
import { ReportsScreen } from './screens/ReportsScreen';

const MainApp: React.FC = () => {
  const [activeScreen, setActiveScreen] = useState<string>('live-map');
  const { currentUser } = useTransit();

  const renderScreen = () => {
    switch (activeScreen) {
      case 'live-map':
        return <LiveMapScreen />;
      case 'routes':
        return <TimetableScreen />;
      case 'feedback':
        return <FeedbackScreen />;
      case 'auth':
        return <AuthScreen onNavigateToScreen={screen => setActiveScreen(screen)} />;
      case 'admin':
        return <AdminDashboard onNavigateToReports={() => setActiveScreen('reports')} />;
      case 'operator':
        return <OperatorScreen />;
      case 'driver':
        return <DriverCockpit />;
      case 'reports':
        return <ReportsScreen />;
      default:
        return <LiveMapScreen />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Active Service Delay Alert Banner */}
      <AlertBanner onNavigateToDelays={() => setActiveScreen('feedback')} />

      {/* Main Top Navbar */}
      <Navbar activeScreen={activeScreen} setActiveScreen={setActiveScreen} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {renderScreen()}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export function App() {
  return (
    <TransitProvider>
      <MainApp />
    </TransitProvider>
  );
}

export default App;
