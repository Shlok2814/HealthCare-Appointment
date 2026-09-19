import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { PatientPortal } from './pages/PatientPortal';
import { DoctorPortal } from './pages/DoctorPortal';
import { AdminPortal } from './pages/AdminPortal';
import { EmergencyUrgentModal } from './components/common/EmergencyUrgentModal';
import { UserRole } from '@pulsepoint/shared';

const AppContent: React.FC = () => {
  const { user, isLoading } = useAuth();
  const [currentView, setCurrentView] = useState<string>('landing');
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState<boolean>(false);

  useEffect(() => {
    if (user) {
      if (user.role === UserRole.ADMIN && currentView === 'login') {
        setCurrentView('admin');
      } else if (user.role === UserRole.DOCTOR && currentView === 'login') {
        setCurrentView('doctor');
      } else if (user.role === UserRole.PATIENT && currentView === 'login') {
        setCurrentView('patient');
      }
    }
  }, [user]);

  const handleNavigate = (view: string) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAuthSuccess = (role: UserRole) => {
    if (role === UserRole.ADMIN) setCurrentView('admin');
    else if (role === UserRole.DOCTOR) setCurrentView('doctor');
    else setCurrentView('patient');
  };

  if (isLoading) {
    return (
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-main)' }}>
        <div className="live-indicator" style={{ width: 18, height: 18, marginBottom: 16 }} />
        <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>
          Pulse<span style={{ color: 'var(--primary-600)' }}>Point</span> Health
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: 6 }}>Initializing secure clinical session...</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar 
        currentView={currentView} 
        onNavigate={handleNavigate} 
        onOpenEmergency={() => setIsEmergencyModalOpen(true)}
      />

      <main style={{ flex: 1 }}>
        {currentView === 'landing' && (
          <LandingPage onNavigate={handleNavigate} />
        )}

        {currentView === 'login' && (
          <AuthPage onSuccessNavigate={handleAuthSuccess} />
        )}

        {currentView === 'patient' && (
          <PatientPortal onNavigateToBooking={() => handleNavigate('landing')} />
        )}

        {currentView === 'doctor' && (
          <DoctorPortal />
        )}

        {currentView === 'admin' && (
          <AdminPortal />
        )}
      </main>

      {/* Global 24/7 SOS Emergency Modal */}
      {isEmergencyModalOpen && (
        <EmergencyUrgentModal
          onClose={() => setIsEmergencyModalOpen(false)}
          onInstantTriage={() => {
            setIsEmergencyModalOpen(false);
            handleNavigate('landing');
            setTimeout(() => {
              const el = document.getElementById('booking-directory');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }, 100);
          }}
        />
      )}

      <Footer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
