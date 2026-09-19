import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Activity, Calendar, User, LogOut, ShieldCheck, Stethoscope, HeartPulse } from 'lucide-react';
import { UserRole } from '@pulsepoint/shared';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onOpenEmergency?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate, onOpenEmergency }) => {
  const { user, logout, loginAsDemo } = useAuth();

  return (
    <nav className="pulse-glass" style={{ position: 'sticky', top: 0, zIndex: 100, borderBottom: '1px solid var(--border-light)' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Brand Logo */}
        <div 
          onClick={() => onNavigate('landing')}
          style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
        >
          <div style={{
            background: 'linear-gradient(135deg, var(--primary-600) 0%, var(--accent-600) 100%)',
            color: '#FFFFFF',
            padding: '8px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 10px rgba(13, 148, 136, 0.25)'
          }}>
            <HeartPulse size={22} />
          </div>
          <div>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-main)' }}>
              Pulse<span style={{ color: 'var(--primary-600)' }}>Point</span>
            </span>
            <span style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--accent-600)', marginLeft: '6px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Health
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={() => onNavigate('landing')}
            className={`pulse-btn ${currentView === 'landing' ? 'pulse-btn-secondary' : ''}`}
            style={{ background: currentView === 'landing' ? 'var(--primary-50)' : 'transparent', border: 'none', color: currentView === 'landing' ? 'var(--primary-700)' : 'var(--text-muted)' }}
          >
            Find Doctors
          </button>

          {user && user.role === UserRole.PATIENT && (
            <button
              onClick={() => onNavigate('patient')}
              className={`pulse-btn ${currentView === 'patient' ? 'pulse-btn-secondary' : ''}`}
              style={{ background: currentView === 'patient' ? 'var(--primary-50)' : 'transparent', border: 'none', color: currentView === 'patient' ? 'var(--primary-700)' : 'var(--text-muted)' }}
            >
              <Calendar size={16} /> My Care Portal
            </button>
          )}

          {user && user.role === UserRole.DOCTOR && (
            <button
              onClick={() => onNavigate('doctor')}
              className={`pulse-btn ${currentView === 'doctor' ? 'pulse-btn-secondary' : ''}`}
              style={{ background: currentView === 'doctor' ? 'var(--primary-50)' : 'transparent', border: 'none', color: currentView === 'doctor' ? 'var(--primary-700)' : 'var(--text-muted)' }}
            >
              <Stethoscope size={16} /> Doctor Console
            </button>
          )}

          {user && user.role === UserRole.ADMIN && (
            <button
              onClick={() => onNavigate('admin')}
              className={`pulse-btn ${currentView === 'admin' ? 'pulse-btn-secondary' : ''}`}
              style={{ background: currentView === 'admin' ? 'var(--primary-50)' : 'transparent', border: 'none', color: currentView === 'admin' ? 'var(--primary-700)' : 'var(--text-muted)' }}
            >
              <ShieldCheck size={16} /> Clinic Admin
            </button>
          )}

          {/* 24/7 Urgent Care SOS button */}
          {onOpenEmergency && (
            <button
              onClick={onOpenEmergency}
              className="pulse-btn"
              style={{ 
                background: '#FEE2E2', 
                color: '#DC2626', 
                border: '1px solid #FCA5A5', 
                padding: '6px 12px', 
                fontSize: '0.8rem',
                fontWeight: 700,
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#DC2626', animation: 'pulse 1.5s infinite' }} />
              <span>24/7 Urgent Care SOS</span>
            </button>
          )}
        </div>

        {/* User Status / Quick Demo Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {!user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ display: 'flex', background: 'var(--bg-subtle)', borderRadius: '8px', padding: '3px' }}>
                <button
                  onClick={() => loginAsDemo('PATIENT')}
                  style={{ fontSize: '0.75rem', fontWeight: 600, padding: '4px 8px', border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)' }}
                >
                  Demo Patient
                </button>
                <button
                  onClick={() => loginAsDemo('DOCTOR')}
                  style={{ fontSize: '0.75rem', fontWeight: 600, padding: '4px 8px', border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)' }}
                >
                  Demo Doctor
                </button>
                <button
                  onClick={() => loginAsDemo('ADMIN')}
                  style={{ fontSize: '0.75rem', fontWeight: 600, padding: '4px 8px', border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)' }}
                >
                  Demo Admin
                </button>
              </div>
              <button onClick={() => onNavigate('login')} className="pulse-btn pulse-btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                Sign In
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-main)' }}>{user.name}</div>
                <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--primary-600)', textTransform: 'capitalize' }}>
                  {user.role.toLowerCase()}
                </div>
              </div>
              <button
                onClick={logout}
                className="pulse-btn pulse-btn-secondary"
                title="Log out"
                style={{ padding: '8px', borderRadius: '10px' }}
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
