import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '@pulsepoint/shared';
import { HeartPulse, Lock, Mail, User, Shield, Stethoscope, ArrowRight, AlertCircle } from 'lucide-react';

interface AuthPageProps {
  onSuccessNavigate: (role: UserRole) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onSuccessNavigate }) => {
  const { login, register, loginAsDemo } = useAuth();
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.PATIENT);
  const [specialization, setSpecialization] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (isRegisterMode) {
        await register({
          name,
          email,
          password,
          role,
          ...(role === UserRole.DOCTOR && { specialization })
        });
      } else {
        await login({ email, password });
      }
      onSuccessNavigate(role);
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async (demoRole: 'PATIENT' | 'DOCTOR' | 'ADMIN') => {
    setIsLoading(true);
    setError(null);
    try {
      await loginAsDemo(demoRole);
      onSuccessNavigate(demoRole as UserRole);
    } catch (err: any) {
      setError(err.message || 'Demo login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
      <div className="pulse-card" style={{ maxWidth: '480px', width: '100%', padding: '36px', boxShadow: 'var(--shadow-xl)' }}>
        {/* Brand header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            display: 'inline-flex',
            background: 'linear-gradient(135deg, var(--primary-600) 0%, var(--accent-600) 100%)',
            color: '#FFFFFF',
            padding: '12px',
            borderRadius: '16px',
            boxShadow: '0 4px 12px rgba(13, 148, 136, 0.3)',
            marginBottom: '14px'
          }}>
            <HeartPulse size={28} />
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)' }}>
            {isRegisterMode ? 'Create Your Account' : 'Welcome to PulsePoint'}
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            {isRegisterMode ? 'Join our modern healthcare ecosystem' : 'Access your patient or doctor portal'}
          </p>
        </div>

        {/* Quick Demo Switcher Tabs */}
        <div style={{ background: 'var(--bg-subtle)', borderRadius: '12px', padding: '14px', marginBottom: '24px' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px', textAlign: 'center' }}>
            ⚡ Instant 1-Click Demo Profiles
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
            <button
              type="button"
              onClick={() => handleDemoLogin('PATIENT')}
              className="pulse-btn pulse-btn-secondary"
              style={{ fontSize: '0.78rem', padding: '8px 4px' }}
              disabled={isLoading}
            >
              <User size={13} /> Patient
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('DOCTOR')}
              className="pulse-btn pulse-btn-secondary"
              style={{ fontSize: '0.78rem', padding: '8px 4px' }}
              disabled={isLoading}
            >
              <Stethoscope size={13} /> Doctor
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('ADMIN')}
              className="pulse-btn pulse-btn-secondary"
              style={{ fontSize: '0.78rem', padding: '8px 4px' }}
              disabled={isLoading}
            >
              <Shield size={13} /> Admin
            </button>
          </div>
        </div>

        {/* Auth Mode Toggle */}
        <div style={{ display: 'flex', borderBottom: '2px solid var(--border-light)', marginBottom: '24px' }}>
          <button
            type="button"
            onClick={() => { setIsRegisterMode(false); setError(null); }}
            style={{
              flex: 1,
              padding: '10px',
              background: 'transparent',
              border: 'none',
              fontWeight: 700,
              fontSize: '0.9rem',
              color: !isRegisterMode ? 'var(--primary-600)' : 'var(--text-muted)',
              borderBottom: !isRegisterMode ? '2px solid var(--primary-600)' : 'none',
              cursor: 'pointer',
              marginBottom: '-2px'
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setIsRegisterMode(true); setError(null); }}
            style={{
              flex: 1,
              padding: '10px',
              background: 'transparent',
              border: 'none',
              fontWeight: 700,
              fontSize: '0.9rem',
              color: isRegisterMode ? 'var(--primary-600)' : 'var(--text-muted)',
              borderBottom: isRegisterMode ? '2px solid var(--primary-600)' : 'none',
              cursor: 'pointer',
              marginBottom: '-2px'
            }}
          >
            Register
          </button>
        </div>

        {error && (
          <div style={{ padding: '12px', background: 'var(--danger-bg)', color: 'var(--danger-text)', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {isRegisterMode && (
            <>
              <div>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px' }}>
                  Full Name:
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Reynolds"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1.5px solid var(--border-strong)',
                    fontSize: '0.9rem',
                    fontFamily: 'var(--font-family)'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px' }}>
                  Account Role:
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1.5px solid var(--border-strong)',
                    fontSize: '0.9rem',
                    fontFamily: 'var(--font-family)'
                  }}
                >
                  <option value={UserRole.PATIENT}>Patient</option>
                  <option value={UserRole.DOCTOR}>Medical Doctor / Specialist</option>
                </select>
              </div>

              {role === UserRole.DOCTOR && (
                <div>
                  <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px' }}>
                    Specialization:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Cardiology, Dermatology"
                    value={specialization}
                    onChange={(e) => setSpecialization(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1.5px solid var(--border-strong)',
                      fontSize: '0.9rem',
                      fontFamily: 'var(--font-family)'
                    }}
                  />
                </div>
              )}
            </>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px' }}>
              Email Address:
            </label>
            <input
              type="email"
              required
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1.5px solid var(--border-strong)',
                fontSize: '0.9rem',
                fontFamily: 'var(--font-family)'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px' }}>
              Password:
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1.5px solid var(--border-strong)',
                fontSize: '0.9rem',
                fontFamily: 'var(--font-family)'
              }}
            />
          </div>

          <button
            type="submit"
            className="pulse-btn pulse-btn-primary"
            style={{ width: '100%', padding: '12px', marginTop: '8px', fontSize: '0.95rem' }}
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : isRegisterMode ? 'Register & Continue' : 'Sign In'}
            <ArrowRight size={16} />
          </button>
        </form>
      </div>
    </div>
  );
};
