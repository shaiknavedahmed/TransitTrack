import React, { useState, useEffect, useRef } from 'react';
import { TransitProvider, useTransit } from './context/TransitContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { AlertBanner } from './components/layout/AlertBanner';
import { UserRole } from './types';
import { ROLE_DEFAULT_SCREEN, ROLE_ALLOWED_SCREENS } from './utils/roleConfig';

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
  const { currentUser, isAuthenticated } = useTransit();
  const [activeScreen, setActiveScreen] = useState<string>(() => ROLE_DEFAULT_SCREEN[currentUser?.role || 'Passenger'] || 'live-map');
  const [reportsInitialTab, setReportsInitialTab] = useState<'schedule' | 'vehicle' | 'feedback' | 'delay'>('schedule');
  const prevRoleRef = useRef<UserRole>(currentUser?.role || 'Passenger');

  // Automatically switch active screen whenever currentUser.role changes
  useEffect(() => {
    if (currentUser?.role && prevRoleRef.current !== currentUser.role) {
      prevRoleRef.current = currentUser.role;
      setActiveScreen(ROLE_DEFAULT_SCREEN[currentUser.role] || 'live-map');
    }
  }, [currentUser?.role]);

  // Route guard: if active screen is not allowed for the active role, redirect to role's default dashboard
  useEffect(() => {
    if (isAuthenticated && currentUser?.role) {
      const allowed = ROLE_ALLOWED_SCREENS[currentUser.role] || ['live-map'];
      if (!allowed.includes(activeScreen)) {
        setActiveScreen(ROLE_DEFAULT_SCREEN[currentUser.role] || 'live-map');
      }
    }
  }, [activeScreen, currentUser?.role, isAuthenticated]);

  const handleOpenReport = (tab: 'schedule' | 'vehicle' | 'feedback' | 'delay' = 'schedule') => {
    setReportsInitialTab(tab);
    setActiveScreen('reports');
  };

  // If user is not authenticated, show the Login screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-900 text-slate-100">
        <AuthScreen onNavigateToScreen={(screen) => setActiveScreen(screen)} />
        <Footer />
      </div>
    );
  }

  const renderScreen = () => {
    switch (activeScreen) {
      case 'admin':
        return (
          <AdminDashboard
            onNavigateToReports={handleOpenReport}
            onNavigateToScreen={screen => setActiveScreen(screen)}
          />
        );
      case 'operator':
        return <OperatorScreen />;
      case 'driver':
        return <DriverCockpit />;
      case 'live-map':
        return <LiveMapScreen onNavigateToScreen={screen => setActiveScreen(screen)} />;
      case 'routes':
        return <TimetableScreen />;
      case 'feedback':
        return <FeedbackScreen />;
      case 'reports':
        return <ReportsScreen initialTab={reportsInitialTab} />;
      case 'auth':
        return <AuthScreen onNavigateToScreen={screen => setActiveScreen(screen)} />;
      default:
        return <LiveMapScreen onNavigateToScreen={screen => setActiveScreen(screen)} />;
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
