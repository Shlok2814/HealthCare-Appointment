import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Activity, Calendar, User, LogOut, ShieldCheck, Stethoscope, HeartPulse, PhoneCall, Sparkles, UserCheck } from 'lucide-react';
import { UserRole } from '@pulsepoint/shared';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onOpenEmergency?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate, onOpenEmergency }) => {
  const { user, logout, loginAsDemo } = useAuth();

  return (
    <nav className="pulse-glass" style={{ position: 'sticky', top: 0, zIndex: 100, borderBottom: '1px solid rgba(226, 232, 240, 0.8)' }}>
      {/* Top Micro-Bar: Live Practice Status */}
      <div style={{
        background: 'linear-gradient(90deg, #0F172A 0%, #1E293B 50%, #0F172A 100%)',
        padding: '5px 24px',
        color: '#CBD5E1',
        fontSize: '0.72rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        letterSpacing: '0.01em'
      }}>
        <div style={{ maxWidth: '1280px', width: '100%', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="live-indicator" style={{ width: '7px', height: '7px' }} />
            <span style={{ fontWeight: 600, color: '#E2E8F0' }}>
              48 Verified Board-Certified Specialists On Duty • HIPAA Encrypted Virtual Exam Rooms
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <span style={{ color: '#38BDF8', fontWeight: 700 }}>Avg. Slot Hold Speed: 2.1s</span>
            <span>•</span>
            <span style={{ color: '#34D399', fontWeight: 700 }}>Zero Double-Booking Guarantee</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Brand Logo */}
        <div 
          onClick={() => onNavigate('landing')}
          style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
        >
          <div style={{
            background: 'linear-gradient(135deg, #0284C7 0%, #0D9488 100%)',
            color: '#FFFFFF',
            padding: '9px',
            borderRadius: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(2, 132, 199, 0.35)'
          }}>
            <HeartPulse size={22} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
              <span style={{ fontSize: '1.35rem', fontWeight: 900, letterSpacing: '-0.03em', color: 'var(--text-main)', fontFamily: 'var(--font-display)' }}>
                Pulse<span style={{ color: '#0284C7' }}>Point</span>
              </span>
              <span style={{
                fontSize: '0.65rem',
                fontWeight: 800,
                color: '#0D9488',
                background: '#CCFBF1',
                padding: '2px 6px',
                borderRadius: '4px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                HEALTH
              </span>
            </div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              Clinical Cloud & Virtual Care
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            type="button"
            onClick={() => onNavigate('landing')}
            className={`pulse-btn ${currentView === 'landing' ? 'pulse-btn-secondary' : 'pulse-chip-hover'}`}
            style={{ 
              background: currentView === 'landing' ? 'var(--primary-50)' : 'transparent', 
              border: currentView === 'landing' ? '1px solid var(--primary-200)' : '1px solid transparent', 
              color: currentView === 'landing' ? 'var(--primary-700)' : 'var(--text-main)',
              padding: '8px 16px',
              fontSize: '0.875rem'
            }}
          >
            Find Specialists
          </button>

          {user && user.role === UserRole.PATIENT && (
            <button
              type="button"
              onClick={() => onNavigate('patient')}
              className={`pulse-btn ${currentView === 'patient' ? 'pulse-btn-secondary' : 'pulse-chip-hover'}`}
              style={{ 
                background: currentView === 'patient' ? '#EFF6FF' : 'transparent', 
                border: currentView === 'patient' ? '1px solid #BAE6FD' : '1px solid transparent', 
                color: currentView === 'patient' ? '#0369A1' : 'var(--text-main)',
                padding: '8px 16px',
                fontSize: '0.875rem'
              }}
            >
              <Calendar size={15} color="#0284C7" /> My Care Portal
            </button>
          )}

          {user && user.role === UserRole.DOCTOR && (
            <button
              type="button"
              onClick={() => onNavigate('doctor')}
              className={`pulse-btn ${currentView === 'doctor' ? 'pulse-btn-secondary' : 'pulse-chip-hover'}`}
              style={{ 
                background: currentView === 'doctor' ? 'var(--primary-50)' : 'transparent', 
                border: currentView === 'doctor' ? '1px solid var(--primary-200)' : '1px solid transparent', 
                color: currentView === 'doctor' ? 'var(--primary-700)' : 'var(--text-main)',
                padding: '8px 16px',
                fontSize: '0.875rem'
              }}
            >
              <Stethoscope size={15} color="#0D9488" /> Doctor Console
            </button>
          )}

          {user && user.role === UserRole.ADMIN && (
            <button
              type="button"
              onClick={() => onNavigate('admin')}
              className={`pulse-btn ${currentView === 'admin' ? 'pulse-btn-secondary' : 'pulse-chip-hover'}`}
              style={{ 
                background: currentView === 'admin' ? '#FAF5FF' : 'transparent', 
                border: currentView === 'admin' ? '1px solid #E9D5FF' : '1px solid transparent', 
                color: currentView === 'admin' ? '#7E22CE' : 'var(--text-main)',
                padding: '8px 16px',
                fontSize: '0.875rem'
              }}
            >
              <ShieldCheck size={15} color="#9333EA" /> Clinic Admin
            </button>
          )}

          {/* 24/7 Urgent Care SOS Button */}
          {onOpenEmergency && (
            <button
              type="button"
              onClick={onOpenEmergency}
              className="pulse-btn pulse-chip-hover"
              style={{ 
                background: 'linear-gradient(135deg, #FEF2F2 0%, #FEE2E2 100%)', 
                color: '#DC2626', 
                border: '1.5px solid #FCA5A5', 
                padding: '7px 14px', 
                fontSize: '0.825rem',
                fontWeight: 800,
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 2px 8px rgba(220, 38, 38, 0.12)'
              }}
            >
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#DC2626', animation: 'pulseGlow 1.5s infinite' }} />
              <PhoneCall size={14} />
              <span>24/7 Urgent SOS</span>
            </button>
          )}
        </div>

        {/* User Status / Quick Demo Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {!user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ 
                display: 'flex', 
                background: '#F1F5F9', 
                borderRadius: '10px', 
                padding: '3px',
                border: '1px solid #E2E8F0'
              }}>
                <button
                  type="button"
                  onClick={() => loginAsDemo('PATIENT')}
                  className="pulse-chip-hover"
                  style={{ fontSize: '0.75rem', fontWeight: 700, padding: '5px 9px', border: 'none', background: 'transparent', color: '#475569', borderRadius: '6px' }}
                >
                  Patient
                </button>
                <button
                  type="button"
                  onClick={() => loginAsDemo('DOCTOR')}
                  className="pulse-chip-hover"
                  style={{ fontSize: '0.75rem', fontWeight: 700, padding: '5px 9px', border: 'none', background: 'transparent', color: '#475569', borderRadius: '6px' }}
                >
                  Doctor
                </button>
                <button
                  type="button"
                  onClick={() => loginAsDemo('ADMIN')}
                  className="pulse-chip-hover"
                  style={{ fontSize: '0.75rem', fontWeight: 700, padding: '5px 9px', border: 'none', background: 'transparent', color: '#475569', borderRadius: '6px' }}
                >
                  Admin
                </button>
              </div>
              <button 
                type="button"
                onClick={() => onNavigate('login')} 
                className="pulse-btn pulse-btn-primary" 
                style={{ padding: '8px 18px', fontSize: '0.85rem' }}
              >
                Sign In
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.875rem', fontWeight: 800, color: 'var(--text-main)' }}>{user.name}</div>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#0284C7', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  {user.role}
                </div>
              </div>
              <button
                type="button"
                onClick={logout}
                className="pulse-btn pulse-btn-secondary"
                title="Log out"
                style={{ padding: '8px 10px', borderRadius: '10px' }}
              >
                <LogOut size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
