import React, { useState } from 'react';
import { DoctorDTO } from '@pulsepoint/shared';
import { 
  Star, Clock, Calendar, Award, Globe, Building2, CheckCircle2, 
  ShieldCheck, UserCheck, ChevronRight, MessageSquare, Video, Sparkles, MapPin 
} from 'lucide-react';
import { DoctorProfileModal } from './DoctorProfileModal';
import { DoctorDirectChatModal } from '../chat/DoctorDirectChatModal';

interface DoctorCardProps {
  doctor: DoctorDTO;
  onSelect: (doctor: DoctorDTO) => void;
  isSelected?: boolean;
}

export const DoctorCard: React.FC<DoctorCardProps> = ({ doctor, onSelect, isSelected }) => {
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);

  const getSpecialtyColor = (specialty: string) => {
    switch (specialty.toLowerCase()) {
      case 'cardiology': return { bg: '#FEE2E2', text: '#DC2626', border: '#FCA5A5', icon: '❤️' };
      case 'neurology': return { bg: '#EDE9FE', text: '#7C3AED', border: '#DDD6FE', icon: '🧠' };
      case 'dermatology': return { bg: '#FEF3C7', text: '#D97706', border: '#FDE68A', icon: '🧴' };
      case 'orthopedics': return { bg: '#E0F2FE', text: '#0284C7', border: '#BAE6FD', icon: '🦴' };
      case 'pediatrics': return { bg: '#FCE7F3', text: '#DB2777', border: '#FBCFE8', icon: '👶' };
      case 'psychiatry': return { bg: '#F3E8FF', text: '#9333EA', border: '#E9D5FF', icon: '🧘' };
      case 'endocrinology': return { bg: '#CCFBF1', text: '#0D9488', border: '#99F6E4', icon: '🧬' };
      case 'ophthalmology': return { bg: '#E0E7FF', text: '#4F46E5', border: '#C7D2FE', icon: '👁️' };
      case 'gynecology': return { bg: '#FFE4E6', text: '#E11D48', border: '#FECDD3', icon: '🌸' };
      case 'gastroenterology': return { bg: '#FEF9C3', text: '#CA8A04', border: '#FEF08A', icon: '🍏' };
      case 'oncology': return { bg: '#F1F5F9', text: '#334155', border: '#CBD5E1', icon: '🔬' };
      case 'ent (otolaryngology)': return { bg: '#E0F2FE', text: '#0369A1', border: '#BAE6FD', icon: '👂' };
      case 'pulmonology': return { bg: '#ECFDF5', text: '#059669', border: '#A7F3D0', icon: '🫁' };
      case 'rheumatology': return { bg: '#EDE9FE', text: '#6D28D9', border: '#DDD6FE', icon: '🩹' };
      case 'urology': return { bg: '#E0F2FE', text: '#0284C7', border: '#BAE6FD', icon: '🩺' };
      case 'allergy & immunology': return { bg: '#FEF3C7', text: '#B45309', border: '#FDE68A', icon: '🌿' };
      case 'nephrology': return { bg: '#EFF6FF', text: '#1D4ED8', border: '#BFDBFE', icon: '💧' };
      case 'physical medicine & rehab': return { bg: '#F0FDFA', text: '#0F766E', border: '#99F6E4', icon: '🏃' };
      default: return { bg: '#E0F2FE', text: '#0369A1', border: '#BAE6FD', icon: '🩺' };
    }
  };

  const specStyle = getSpecialtyColor(doctor.specialization);

  return (
    <>
      <div
        className={`pulse-card pulse-card-hover ${isSelected ? 'selected' : ''}`}
        style={{
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          cursor: 'pointer',
          borderRadius: '20px',
          background: isSelected ? '#F0F9FF' : '#FFFFFF',
          border: isSelected ? '2px solid #0284C7' : '1px solid #E2E8F0',
          position: 'relative',
          boxShadow: isSelected ? '0 10px 25px -5px rgba(2, 132, 199, 0.25)' : 'var(--shadow-sm)',
          transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
        onClick={() => onSelect(doctor)}
      >
        <div>
          {/* Top Row: Avatar, Name & Live Rating */}
          <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', marginBottom: '14px' }}>
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <div style={{ 
                width: '60px', 
                height: '60px', 
                borderRadius: '18px', 
                background: `linear-gradient(135deg, ${specStyle.text}, #0284C7)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                fontSize: '1.45rem',
                fontWeight: 900,
                boxShadow: '0 6px 16px rgba(0,0,0,0.12)',
                border: '2px solid #FFFFFF'
              }}>
                {doctor.name.replace('Dr. ', '').charAt(0)}
              </div>
              
              {/* Online indicator */}
              <div style={{
                position: 'absolute',
                bottom: '-2px',
                right: '-2px',
                width: '14px',
                height: '14px',
                borderRadius: '50%',
                background: '#10B981',
                border: '2.5px solid #FFFFFF'
              }} />
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginBottom: '4px' }}>
                <span 
                  style={{ 
                    fontSize: '0.75rem', 
                    fontWeight: 800, 
                    background: specStyle.bg, 
                    color: specStyle.text, 
                    border: `1px solid ${specStyle.border}`,
                    padding: '3px 8px', 
                    borderRadius: '6px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <span>{specStyle.icon}</span>
                  <span>{doctor.specialization}</span>
                </span>
                
                <span style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '3px', background: '#ECFDF5', padding: '2px 7px', borderRadius: '4px' }}>
                  <ShieldCheck size={12} /> Board-Certified
                </span>
              </div>

              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1.25, margin: 0 }}>
                {doctor.name}
              </h3>

              {doctor.hospitalAffiliation && (
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '3px' }}>
                  <Building2 size={12} color="#0284C7" />
                  <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{doctor.hospitalAffiliation}</span>
                </div>
              )}
            </div>

            {/* Rating Badge */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '4px', 
              background: '#FEF3C7', 
              padding: '5px 9px', 
              borderRadius: '10px', 
              color: '#B45309', 
              fontWeight: 800, 
              fontSize: '0.875rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              flexShrink: 0
            }}>
              <Star size={14} fill="#F59E0B" color="#F59E0B" />
              {doctor.rating ? doctor.rating.toFixed(2) : '4.95'}
            </div>
          </div>

          {/* Bio Description */}
          <p style={{ 
            fontSize: '0.875rem', 
            color: 'var(--text-muted)', 
            lineHeight: 1.55, 
            marginBottom: '14px', 
            display: '-webkit-box', 
            WebkitLineClamp: 2, 
            WebkitBoxOrient: 'vertical', 
            overflow: 'hidden' 
          }}>
            {doctor.bio}
          </p>

          {/* Continuous Rotation & Shift Loop Status */}
          {doctor.rotation && (
            <div style={{
              background: doctor.rotation.shiftStatus === 'ACTIVE_ON_DUTY' 
                ? 'linear-gradient(135deg, #ECFDF5 0%, #F0FDFA 100%)' 
                : doctor.rotation.shiftStatus === 'NEXT_IN_ROTATION'
                ? 'linear-gradient(135deg, #EFF6FF 0%, #F0F9FF 100%)'
                : 'linear-gradient(135deg, #FAF5FF 0%, #F5F3FF 100%)',
              border: doctor.rotation.shiftStatus === 'ACTIVE_ON_DUTY'
                ? '1px solid #A7F3D0'
                : doctor.rotation.shiftStatus === 'NEXT_IN_ROTATION'
                ? '1px solid #BAE6FD'
                : '1px solid #E9D5FF',
              borderRadius: '12px',
              padding: '9px 12px',
              marginBottom: '14px',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '6px' }}>
                <span style={{ 
                  fontSize: '0.74rem', 
                  fontWeight: 800, 
                  color: doctor.rotation.shiftStatus === 'ACTIVE_ON_DUTY' ? '#047857' : doctor.rotation.shiftStatus === 'NEXT_IN_ROTATION' ? '#0284C7' : '#7E22CE',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}>
                  {doctor.rotation.shiftStatus === 'ACTIVE_ON_DUTY' ? (
                    <>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981', display: 'inline-block', boxShadow: '0 0 0 2px rgba(16, 185, 129, 0.25)' }} />
                      <span>Active Shift: {doctor.rotation.activeShiftWindow}</span>
                    </>
                  ) : doctor.rotation.shiftStatus === 'NEXT_IN_ROTATION' ? (
                    <>
                      <Clock size={12} />
                      <span>Next on Roster: {doctor.rotation.activeShiftWindow}</span>
                    </>
                  ) : (
                    <>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#8B5CF6', display: 'inline-block' }} />
                      <span>Shift Renewed: {doctor.rotation.nextRenewalTime}</span>
                    </>
                  )}
                </span>
                <span style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)', background: '#FFFFFF', padding: '1px 6px', borderRadius: '4px', border: '1px solid rgba(0,0,0,0.06)' }}>
                  {doctor.rotation.shiftLabel}
                </span>
              </div>
              {doctor.rotation.handoverDoctorName && (
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span>🔄 Shift Handover to <strong>{doctor.rotation.handoverDoctorName}</strong> at {doctor.rotation.handoverTime}</span>
                </div>
              )}
            </div>
          )}

          {/* Highlights Grid */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: '8px', 
            padding: '10px 14px', 
            background: 'var(--bg-subtle)', 
            borderRadius: '12px', 
            marginBottom: '14px' 
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--text-main)', fontWeight: 700 }}>
              <Award size={14} color="#0284C7" />
              <span>{doctor.experienceYears || 12}+ Yrs Experience</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--text-main)', fontWeight: 700 }}>
              <Video size={14} color="#0D9488" />
              <span>HD Video & In-Clinic</span>
            </div>
          </div>

          {/* Career & Achievements Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsProfileModalOpen(true);
            }}
            className="pulse-btn pulse-chip-hover"
            style={{
              width: '100%',
              padding: '8px 12px',
              fontSize: '0.8rem',
              fontWeight: 700,
              color: '#0369A1',
              background: '#EFF6FF',
              border: '1px solid #BFDBFE',
              borderRadius: '10px',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <UserCheck size={14} color="#0284C7" />
            <span>View Career Achievements & Patient Reviews</span>
            <ChevronRight size={14} />
          </button>
        </div>

        {/* Footer Fee & Selection */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          borderTop: '1px solid var(--border-light)', 
          paddingTop: '14px',
          gap: '10px',
          flexWrap: 'wrap'
        }}>
          <div>
            <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.04em' }}>
              Consultation Fee
            </span>
            <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#0369A1', fontFamily: 'var(--font-display)', lineHeight: 1.1 }}>
              ₹{doctor.consultationFee} <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>/ 30 min</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button
              type="button"
              className="pulse-btn pulse-chip-hover"
              style={{
                padding: '8px 13px',
                fontSize: '0.8rem',
                fontWeight: 700,
                color: '#0284C7',
                background: '#FFFFFF',
                border: '1.5px solid #BAE6FD',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
              onClick={(e) => {
                e.stopPropagation();
                setIsChatModalOpen(true);
              }}
            >
              <MessageSquare size={14} color="#0284C7" />
              <span>Message</span>
            </button>

            <button
              type="button"
              className={`pulse-btn ${isSelected ? 'pulse-btn-primary' : 'pulse-btn-secondary pulse-chip-hover'}`}
              style={{ padding: '8px 16px', fontSize: '0.85rem', fontWeight: 800, borderRadius: '10px' }}
              onClick={(e) => {
                e.stopPropagation();
                onSelect(doctor);
              }}
            >
              <Calendar size={15} />
              {isSelected ? '✓ Selected' : 'Book Visit'}
            </button>
          </div>
        </div>
      </div>

      {/* Doctor Profile Modal */}
      {isProfileModalOpen && (
        <DoctorProfileModal
          doctor={doctor}
          onClose={() => setIsProfileModalOpen(false)}
          onBook={(doc) => {
            onSelect(doc);
            setIsProfileModalOpen(false);
          }}
          onOpenMessage={() => {
            setIsProfileModalOpen(false);
            setIsChatModalOpen(true);
          }}
        />
      )}

      {/* Doctor Direct Chat Modal */}
      {isChatModalOpen && (
        <DoctorDirectChatModal
          doctor={doctor}
          onClose={() => setIsChatModalOpen(false)}
          onBookAppointment={(doc) => {
            setIsChatModalOpen(false);
            onSelect(doc);
          }}
        />
      )}
    </>
  );
};
