import React from 'react';
import { HeartPulse, ShieldCheck, Zap, Lock, PhoneCall, Award, Video, FileText } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer style={{ 
      background: 'linear-gradient(180deg, #0F172A 0%, #090D16 100%)', 
      color: '#F8FAFC',
      marginTop: '100px', 
      borderTop: '1px solid rgba(255,255,255,0.1)'
    }}>
      {/* 24/7 Clinical Hotline Banner */}
      <div style={{
        background: 'rgba(2, 132, 199, 0.15)',
        borderBottom: '1px solid rgba(56, 189, 248, 0.2)',
        padding: '16px 24px'
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ background: '#0284C7', color: '#FFF', padding: '6px', borderRadius: '8px' }}>
              <PhoneCall size={16} />
            </div>
            <div>
              <span style={{ fontWeight: 800, fontSize: '0.875rem' }}>Need Immediate Medical Triage?</span>
              <span style={{ color: '#94A3B8', fontSize: '0.8rem', marginLeft: '8px' }}>
                Our 24/7 AI Clinical Assistant and on-duty triage coordinators are available round-the-clock.
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#38BDF8', fontWeight: 700 }}>
            <span>Emergency Dial: 911 / 112</span>
            <span>•</span>
            <span>Crisis Line: 988</span>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '60px 24px 36px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '40px', marginBottom: '48px' }}>
          {/* Brand Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{ 
                background: 'linear-gradient(135deg, #0284C7, #0D9488)', 
                color: '#FFFFFF', 
                padding: '8px', 
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(2, 132, 199, 0.4)'
              }}>
                <HeartPulse size={20} />
              </div>
              <span style={{ fontSize: '1.3rem', fontWeight: 900, fontFamily: 'var(--font-display)', letterSpacing: '-0.02em' }}>
                Pulse<span style={{ color: '#38BDF8' }}>Point</span> Health
              </span>
            </div>

            <p style={{ fontSize: '0.875rem', color: '#94A3B8', lineHeight: 1.6, marginBottom: '20px' }}>
              Enterprise-grade clinical booking engine with instant slot holds, AI pre-visit intake assessments, HD WebRTC telehealth exam rooms, and automatic digital prescription vaults.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34D399', border: '1px solid rgba(52, 211, 153, 0.3)', padding: '3px 8px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 700 }}>
                ✓ HIPAA Compliant
              </span>
              <span style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38BDF8', border: '1px solid rgba(56, 189, 248, 0.3)', padding: '3px 8px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 700 }}>
                ✓ SOC-2 Type II
              </span>
              <span style={{ background: 'rgba(168, 85, 247, 0.15)', color: '#C084FC', border: '1px solid rgba(192, 132, 252, 0.3)', padding: '3px 8px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 700 }}>
                ✓ 256-Bit TLS
              </span>
            </div>
          </div>

          {/* Clinical Architecture */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#F1F5F9', marginBottom: '16px', letterSpacing: '0.02em', textTransform: 'uppercase' }}>
              Core Infrastructure
            </h4>
            <ul style={{ listStyle: 'none', fontSize: '0.85rem', color: '#94A3B8', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Lock size={14} color="#38BDF8" /> 5-Min Atomic Slot Lock Holds
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Zap size={14} color="#38BDF8" /> AI Clinical Triage & Acuity Scoring
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Video size={14} color="#38BDF8" /> Encrypted HD WebRTC Video Rooms
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText size={14} color="#38BDF8" /> Digital Prescription & Vitals Vault
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck size={14} color="#38BDF8" /> Autonomous Leave Conflict Resolver
              </li>
            </ul>
          </div>

          {/* Clinical Specialties */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#F1F5F9', marginBottom: '16px', letterSpacing: '0.02em', textTransform: 'uppercase' }}>
              Specialty Departments
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.825rem', color: '#94A3B8' }}>
              <span>Cardiology</span>
              <span>Neurology</span>
              <span>Dermatology</span>
              <span>Orthopedics</span>
              <span>Pediatrics</span>
              <span>Psychiatry</span>
              <span>Endocrinology</span>
              <span>Ophthalmology</span>
              <span>Gynecology</span>
              <span>Oncology</span>
            </div>
          </div>

          {/* Clinical Accreditation */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#F1F5F9', marginBottom: '16px', letterSpacing: '0.02em', textTransform: 'uppercase' }}>
              Clinical Excellence
            </h4>
            <p style={{ fontSize: '0.825rem', color: '#94A3B8', lineHeight: 1.6, marginBottom: '14px' }}>
              Affiliated with top academic medical centers including Johns Hopkins, Harvard Medical, Mayo Clinic, Stanford Health Care, and Cleveland Clinic.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#FBBF24', fontSize: '0.85rem', fontWeight: 800 }}>
              <span>⭐ 4.98/5.0</span>
              <span style={{ color: '#94A3B8', fontWeight: 400 }}>from 120,000+ verified encounters</span>
            </div>
          </div>
        </div>

        {/* Bottom copyright & disclaimer */}
        <div style={{ 
          borderTop: '1px solid rgba(255, 255, 255, 0.08)', 
          paddingTop: '28px', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          flexWrap: 'wrap', 
          gap: '16px',
          fontSize: '0.78rem',
          color: '#64748B'
        }}>
          <p>
            © {new Date().getFullYear()} PulsePoint Health Technologies Inc. All rights reserved. Not a substitute for primary emergency services.
          </p>
          <div style={{ display: 'flex', gap: '18px' }}>
            <span>Privacy Policy</span>
            <span>•</span>
            <span>Terms of Clinical Service</span>
            <span>•</span>
            <span>HIPAA Notice of Privacy Practices</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
