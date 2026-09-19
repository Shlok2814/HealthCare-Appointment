import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '@pulsepoint/shared';
import { HeartPulse, Lock, Mail, User, Shield, Stethoscope, ArrowRight, AlertCircle, Sparkles, KeyRound } from 'lucide-react';

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
      let loggedInUser;
      if (isRegisterMode) {
        loggedInUser = await register({
          name,
          email,
          password,
          role,
          ...(role === UserRole.DOCTOR && { specialization })
        });
      } else {
        loggedInUser = await login({ email, password });
      }
      onSuccessNavigate(loggedInUser?.role || role);
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
      const loggedInUser = await loginAsDemo(demoRole);
      onSuccessNavigate(loggedInUser?.role || (demoRole as UserRole));
    } catch (err: any) {
      setError(err.message || 'Demo login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFillCredentials = (fillRole: 'ADMIN' | 'DOCTOR' | 'PATIENT') => {
    setIsRegisterMode(false);
    setError(null);
    if (fillRole === 'ADMIN') {
      setEmail('admin@pulsepoint.health');
      setPassword('Admin@1234');
    } else if (fillRole === 'DOCTOR') {
      setEmail('dr.sarah@pulsepoint.health');
      setPassword('Doctor@1234');
    } else {
      setEmail('alex.reynolds@gmail.com');
      setPassword('Patient@1234');
    }
  };

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
      <div className="pulse-card" style={{ maxWidth: '500px', width: '100%', padding: '36px', boxShadow: 'var(--shadow-xl)' }}>
        {/* Brand header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
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
          <h2 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-main)' }}>
            {isRegisterMode ? 'Create Your Account' : 'Welcome to PulsePoint'}
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            {isRegisterMode ? 'Join our modern healthcare platform' : 'Sign in as Patient, Doctor, or Guest Administrator'}
          </p>
        </div>

        {/* 1-Click Guest & Demo Login Profiles */}
        <div style={{ 
          background: 'linear-gradient(135deg, #F0FDFA 0%, #EEF2FF 100%)', 
          borderRadius: '14px', 
          padding: '16px', 
          marginBottom: '24px',
          border: '1.5px solid var(--primary-200)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 800, color: 'var(--primary-800)', textTransform: 'uppercase', marginBottom: '10px' }}>
            <Sparkles size={15} /> Instant 1-Click Guest Profiles
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
            {/* Guest Admin */}
            <button
              type="button"
              onClick={() => handleDemoLogin('ADMIN')}
              className="pulse-btn"
              style={{
                background: '#FFFFFF',
                color: '#4338CA',
                border: '1.5px solid #C7D2FE',
                fontSize: '0.8rem',
                fontWeight: 700,
                padding: '10px 6px',
                borderRadius: '10px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                boxShadow: 'var(--shadow-sm)'
              }}
              disabled={isLoading}
              title="Click to instantly log in as System Administrator"
            >
              <Shield size={18} color="#4F46E5" />
              <span>Guest Admin</span>
            </button>

            {/* Guest Doctor */}
            <button
              type="button"
              onClick={() => handleDemoLogin('DOCTOR')}
              className="pulse-btn"
              style={{
                background: '#FFFFFF',
                color: '#0369A1',
                border: '1.5px solid #BAE6FD',
                fontSize: '0.8rem',
                fontWeight: 700,
                padding: '10px 6px',
                borderRadius: '10px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                boxShadow: 'var(--shadow-sm)'
              }}
              disabled={isLoading}
              title="Click to instantly log in as Cardiologist Doctor"
            >
              <Stethoscope size={18} color="#0284C7" />
              <span>Guest Doctor</span>
            </button>

            {/* Guest Patient */}
            <button
              type="button"
              onClick={() => handleDemoLogin('PATIENT')}
              className="pulse-btn"
              style={{
                background: '#FFFFFF',
                color: '#0F766E',
                border: '1.5px solid #99F6E4',
                fontSize: '0.8rem',
                fontWeight: 700,
                padding: '10px 6px',
                borderRadius: '10px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                boxShadow: 'var(--shadow-sm)'
              }}
              disabled={isLoading}
              title="Click to instantly log in as Patient"
            >
              <User size={18} color="#0D9488" />
              <span>Guest Patient</span>
            </button>
          </div>

          <div style={{ textAlign: 'center', marginTop: '10px' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              Or autofill credentials:
            </span>{' '}
            <button 
              type="button"
              onClick={() => handleFillCredentials('ADMIN')}
              style={{ background: 'none', border: 'none', color: '#4F46E5', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
            >
              Admin
            </button>{' '}
            •{' '}
            <button 
              type="button"
              onClick={() => handleFillCredentials('DOCTOR')}
              style={{ background: 'none', border: 'none', color: '#0284C7', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
            >
              Doctor
            </button>{' '}
            •{' '}
            <button 
              type="button"
              onClick={() => handleFillCredentials('PATIENT')}
              style={{ background: 'none', border: 'none', color: '#0D9488', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
            >
              Patient
            </button>
          </div>
        </div>

        {/* Auth Mode Switcher */}
        <div style={{ display: 'flex', borderBottom: '2px solid var(--border-light)', marginBottom: '22px' }}>
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
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                required
                placeholder="admin@pulsepoint.health"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px 10px 38px',
                  borderRadius: '8px',
                  border: '1.5px solid var(--border-strong)',
                  fontSize: '0.9rem',
                  fontFamily: 'var(--font-family)'
                }}
              />
              <Mail size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px' }}>
              Password:
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px 10px 38px',
                  borderRadius: '8px',
                  border: '1.5px solid var(--border-strong)',
                  fontSize: '0.9rem',
                  fontFamily: 'var(--font-family)'
                }}
              />
              <Lock size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <button
            type="submit"
            className="pulse-btn pulse-btn-primary"
            style={{ width: '100%', padding: '12px', marginTop: '8px', fontSize: '0.95rem', fontWeight: 800 }}
            disabled={isLoading}
          >
            {isLoading ? 'Authenticating...' : isRegisterMode ? 'Register & Continue' : 'Sign In'}
            <ArrowRight size={16} />
          </button>
        </form>
      </div>
    </div>
  );
};
