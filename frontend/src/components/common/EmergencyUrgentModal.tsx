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
          maxWidth: '500px', 
          width: '92vw', 
          padding: '22px',
          borderRadius: '20px',
          border: '1.5px solid #FECACA',
          boxShadow: '0 20px 40px -10px rgba(220, 38, 38, 0.15), 0 0 0 1px rgba(239, 68, 68, 0.1)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ 
              width: '40px', 
              height: '40px', 
              borderRadius: '12px', 
              background: '#FEE2E2', 
              color: '#DC2626', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}>
              <AlertOctagon size={22} />
            </div>
            <div>
              <div style={{ color: '#DC2626', fontWeight: 800, fontSize: '0.72rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                24/7 Rapid Clinical Care
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                Emergency & Urgent Guidance
              </h3>
            </div>
          </div>
          <button 
            type="button"
            onClick={onClose}
            style={{ background: '#F1F5F9', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', borderRadius: '8px', padding: '6px' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Warning Callout */}
        <div style={{ 
          background: '#FEF2F2', 
          border: '1px solid #FCA5A5', 
          borderRadius: '12px', 
          padding: '12px 14px', 
          marginBottom: '16px',
          color: '#991B1B',
          fontSize: '0.8rem',
          lineHeight: 1.45
        }}>
          <strong>⚠️ Immediate Life Threat Warning:</strong> For chest pain, sudden numbness/paralysis, acute shortness of breath, or severe trauma, call <strong>112 / 911</strong> or go to an Emergency Department immediately.
        </div>

        {/* Action Options */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '10px', marginBottom: '18px' }}>
          {/* Option 1: Instant AI Triage */}
          <div 
            className="pulse-card pulse-card-hover"
            style={{ 
              padding: '12px 14px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              cursor: 'pointer',
              border: '1.5px solid #BAE6FD',
              background: '#F0F9FF',
              borderRadius: '12px'
            }}
            onClick={() => {
              onClose();
              onInstantTriage();
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ 
                width: '36px', 
                height: '36px', 
                borderRadius: '10px', 
                background: 'linear-gradient(135deg, #0284C7, #0D9488)', 
                color: '#FFF', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center' 
              }}>
                <Zap size={18} />
              </div>
              <div>
                <div style={{ fontWeight: 800, color: '#0369A1', fontSize: '0.9rem' }}>
                  Instant AI Clinical Triage
                </div>
                <div style={{ fontSize: '0.74rem', color: '#0284C7' }}>
                  Real-time symptom scoring & priority doctor slot hold
                </div>
              </div>
            </div>
            <span className="pulse-btn pulse-btn-primary" style={{ padding: '5px 10px', fontSize: '0.75rem', borderRadius: '8px' }}>
              Start Triage
            </span>
          </div>

          {/* Option 2: 24/7 Physician On-Call Hotline */}
          <div 
            className="pulse-card"
            style={{ 
              padding: '12px 14px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              background: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderRadius: '12px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ 
                width: '36px', 
                height: '36px', 
                borderRadius: '10px', 
                background: '#0D9488', 
                color: '#FFF', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center' 
              }}>
                <PhoneCall size={18} />
              </div>
              <div>
                <div style={{ fontWeight: 800, color: 'var(--text-main)', fontSize: '0.9rem' }}>
                  24/7 Clinical Nurse Hotline
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                  Toll-Free: <strong>1-800-PULSE-MD</strong> (1-800-785-7363)
                </div>
              </div>
            </div>
            <a 
              href="tel:18007857363" 
              className="pulse-btn"
              style={{ background: '#0D9488', color: '#FFF', padding: '5px 10px', fontSize: '0.75rem', textDecoration: 'none', borderRadius: '8px' }}
            >
              Call Now
            </a>
          </div>

          {/* Option 3: Poison Control & Mental Health */}
          <div 
            className="pulse-card"
            style={{ 
              padding: '12px 14px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              background: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderRadius: '12px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ 
                width: '36px', 
                height: '36px', 
                borderRadius: '10px', 
                background: '#7C3AED', 
                color: '#FFF', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center' 
              }}>
                <ShieldAlert size={18} />
              </div>
              <div>
                <div style={{ fontWeight: 800, color: 'var(--text-main)', fontSize: '0.9rem' }}>
                  Crisis & Helpline
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                  National Lifeline: <strong>988</strong> | Poison: <strong>1-800-222-1222</strong>
                </div>
              </div>
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#7C3AED', background: '#F3E8FF', padding: '3px 8px', borderRadius: '6px' }}>
              24/7 Free
            </span>
          </div>
        </div>

        <button 
          type="button"
          onClick={onClose}
          className="pulse-btn pulse-btn-secondary"
          style={{ width: '100%', padding: '9px', fontSize: '0.85rem', borderRadius: '10px' }}
        >
          Close Emergency Guide
        </button>
      </div>
    </div>
  );
};
