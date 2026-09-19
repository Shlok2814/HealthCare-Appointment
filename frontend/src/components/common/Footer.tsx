import React from 'react';
import { HeartPulse, ShieldCheck, Zap, Lock } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer style={{ background: '#FFFFFF', borderTop: '1px solid var(--border-light)', marginTop: '80px', padding: '48px 24px 32px' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '32px', marginBottom: '40px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <div style={{ background: 'var(--primary-600)', color: '#FFFFFF', padding: '6px', borderRadius: '8px' }}>
                <HeartPulse size={18} />
              </div>
              <span style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)' }}>
                Pulse<span style={{ color: 'var(--primary-600)' }}>Point</span> Health
              </span>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              Enterprise-grade clinical scheduling, automated practice workflows, and intelligent patient-care synchronization.
            </p>
          </div>

          <div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '12px' }}>Core Capabilities</h4>
            <ul style={{ listStyle: 'none', fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Lock size={14} color="var(--primary-600)" /> Redis Concurrency Slot Holds</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Zap size={14} color="var(--primary-600)" /> AI Clinical Symptom Triage</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><ShieldCheck size={14} color="var(--primary-600)" /> Auto-Conflict Leave Resolution</li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '12px' }}>Clinical Portals</h4>
            <ul style={{ listStyle: 'none', fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li>Patient Appointments & Digital Rx</li>
              <li>Doctor Practice & Prescription Console</li>
              <li>Clinic Operations & Revenue Analytics</li>
            </ul>
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>
            © {new Date().getFullYear()} PulsePoint Health Technologies. All rights reserved.
          </p>
          <div style={{ display: 'flex', gap: '16px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <span>HIPAA Compliant Architecture</span>
            <span>•</span>
            <span>256-bit TLS Encryption</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
