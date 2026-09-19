import React from 'react';
import { AlertOctagon, PhoneCall, ShieldAlert, Zap, X, MapPin, Stethoscope, Clock, CheckCircle } from 'lucide-react';

interface EmergencyUrgentModalProps {
  onClose: () => void;
  onInstantTriage: () => void;
}

export const EmergencyUrgentModal: React.FC<EmergencyUrgentModalProps> = ({
  onClose,
  onInstantTriage
}) => {
  return (
    <div className="pulse-modal-overlay">
      <div 
        className="pulse-modal" 
        style={{ 
          maxWidth: '680px', 
          width: '92vw', 
          padding: '28px',
          borderRadius: '16px',
          border: '2px solid #EF4444' 
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ 
              width: '44px', 
              height: '44px', 
              borderRadius: '12px', 
              background: '#FEE2E2', 
              color: '#DC2626', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}>
              <AlertOctagon size={26} />
            </div>
            <div>
              <div style={{ color: '#DC2626', fontWeight: 800, fontSize: '0.8rem', letterSpacing: '0.05em' }}>
                24/7 RAPID CLINICAL ASSISTANCE
              </div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', margin: '2px 0 0' }}>
                Emergency & Urgent Care Guidance
              </h2>
            </div>
          </div>
          <button 
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
          >
            <X size={22} />
          </button>
        </div>

        {/* Warning Callout */}
        <div style={{ 
          background: '#FEF2F2', 
          border: '1px solid #FCA5A5', 
          borderRadius: '10px', 
          padding: '14px 16px', 
          marginBottom: '20px',
          color: '#991B1B',
          fontSize: '0.875rem',
          lineHeight: 1.5
        }}>
          <strong>⚠️ Immediate Life Threat Warning:</strong> If you are experiencing severe chest pain, sudden numbness/paralysis, difficulty breathing, or severe hemorrhage, call <strong>911</strong> or go to the nearest Emergency Room immediately.
        </div>

        {/* Action Options */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '14px', marginBottom: '24px' }}>
          {/* Option 1: Instant AI Triage */}
          <div 
            className="pulse-card pulse-card-hover"
            style={{ 
              padding: '16px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              cursor: 'pointer',
              border: '1px solid var(--primary-300)',
              background: 'var(--primary-50)'
            }}
            onClick={() => {
              onClose();
              onInstantTriage();
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ 
                width: '40px', 
                height: '40px', 
                borderRadius: '50%', 
                background: 'var(--primary-600)', 
                color: '#FFF', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center' 
              }}>
                <Zap size={20} />
              </div>
              <div>
                <div style={{ fontWeight: 700, color: 'var(--primary-900)', fontSize: '1rem' }}>
                  Instant AI Clinical Triage & Queue
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--primary-700)' }}>
                  Submit symptoms for real-time acuity scoring and priority slot hold.
                </div>
              </div>
            </div>
            <span className="pulse-btn pulse-btn-primary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
              Start Triage
            </span>
          </div>

          {/* Option 2: 24/7 Physician On-Call Hotline */}
          <div 
            className="pulse-card"
            style={{ 
              padding: '16px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              background: 'var(--bg-subtle)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ 
                width: '40px', 
                height: '40px', 
                borderRadius: '50%', 
                background: '#0D9488', 
                color: '#FFF', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center' 
              }}>
                <PhoneCall size={20} />
              </div>
              <div>
                <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '1rem' }}>
                  PulsePoint 24/7 Clinical Hotline
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Toll-Free triage nurse: <strong>1-800-PULSE-MD (1-800-785-7363)</strong>
                </div>
              </div>
            </div>
            <a 
              href="tel:18007857363" 
              className="pulse-btn"
              style={{ background: '#0D9488', color: '#FFF', padding: '6px 12px', fontSize: '0.8rem', textDecoration: 'none' }}
            >
              Call Now
            </a>
          </div>

          {/* Option 3: Poison Control & Mental Health */}
          <div 
            className="pulse-card"
            style={{ 
              padding: '16px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              background: 'var(--bg-subtle)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ 
                width: '40px', 
                height: '40px', 
                borderRadius: '50%', 
                background: '#7C3AED', 
                color: '#FFF', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center' 
              }}>
                <ShieldAlert size={20} />
              </div>
              <div>
                <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '1rem' }}>
                  Crisis & Poison Control Helpline
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  National Suicide & Crisis Lifeline: <strong>988</strong> | Poison Control: <strong>1-800-222-1222</strong>
                </div>
              </div>
            </div>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#7C3AED' }}>24/7 Free</span>
          </div>
        </div>

        <button 
          onClick={onClose}
          className="pulse-btn pulse-btn-secondary"
          style={{ width: '100%', padding: '10px' }}
        >
          Close Emergency Guide
        </button>
      </div>
    </div>
  );
};
