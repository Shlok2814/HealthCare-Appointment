import React, { useState } from 'react';
import { DoctorDTO } from '@pulsepoint/shared';
import { Star, Clock, Calendar, Award, Globe, Building2, CheckCircle2, ShieldCheck, UserCheck, ChevronRight } from 'lucide-react';
import { DoctorProfileModal } from './DoctorProfileModal';

interface DoctorCardProps {
  doctor: DoctorDTO;
  onSelect: (doctor: DoctorDTO) => void;
  isSelected?: boolean;
}

export const DoctorCard: React.FC<DoctorCardProps> = ({ doctor, onSelect, isSelected }) => {
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const getSpecialtyColor = (specialty: string) => {
    switch (specialty.toLowerCase()) {
      case 'cardiology': return { bg: '#FEE2E2', text: '#DC2626', border: '#FCA5A5' };
      case 'neurology': return { bg: '#EDE9FE', text: '#7C3AED', border: '#DDD6FE' };
      case 'dermatology': return { bg: '#FEF3C7', text: '#D97706', border: '#FDE68A' };
      case 'orthopedics': return { bg: '#E0F2FE', text: '#0284C7', border: '#BAE6FD' };
      case 'pediatrics': return { bg: '#FCE7F3', text: '#DB2777', border: '#FBCFE8' };
      case 'psychiatry': return { bg: '#F3E8FF', text: '#9333EA', border: '#E9D5FF' };
      case 'endocrinology': return { bg: '#CCFBF1', text: '#0D9488', border: '#99F6E4' };
      case 'ophthalmology': return { bg: '#E0E7FF', text: '#4F46E5', border: '#C7D2FE' };
      case 'gynecology': return { bg: '#FFE4E6', text: '#E11D48', border: '#FECDD3' };
      case 'gastroenterology': return { bg: '#FEF9C3', text: '#CA8A04', border: '#FEF08A' };
      case 'oncology': return { bg: '#F1F5F9', text: '#475569', border: '#CBD5E1' };
      default: return { bg: '#E0F2FE', text: '#0369A1', border: '#BAE6FD' };
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
          border: isSelected ? '2px solid var(--primary-600)' : '1px solid var(--border-light)',
          background: isSelected ? 'var(--primary-50)' : 'var(--bg-card)',
          position: 'relative',
          transition: 'all 0.25s ease'
        }}
        onClick={() => onSelect(doctor)}
      >
        <div>
          {/* Header Avatar & Name */}
          <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', marginBottom: '14px' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              background: `linear-gradient(135deg, ${specStyle.text}, #0D9488)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              fontSize: '1.35rem',
              fontWeight: 900,
              flexShrink: 0,
              boxShadow: '0 4px 14px rgba(0,0,0,0.12)'
            }}>
              {doctor.name.replace('Dr. ', '').charAt(0)}
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    background: specStyle.bg,
                    color: specStyle.text,
                    border: `1px solid ${specStyle.border}`,
                    padding: '2px 8px',
                    borderRadius: '6px'
                  }}
                >
                  {doctor.specialization}
                </span>
                <span style={{ fontSize: '0.7rem', color: '#10B981', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '2px' }}>
                  <CheckCircle2 size={12} /> Top Rated MD
                </span>
              </div>

              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '4px', lineHeight: 1.3 }}>
                {doctor.name}
              </h3>
            </div>

            {/* Rating Badge */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              background: '#FEF3C7',
              padding: '4px 8px',
              borderRadius: '8px',
              color: '#B45309',
              fontWeight: 800,
              fontSize: '0.85rem'
            }}>
              <Star size={14} fill="#F59E0B" color="#F59E0B" />
              {doctor.rating ? doctor.rating.toFixed(2) : '4.95'}
            </div>
          </div>

          {/* Bio description */}
          <p style={{
            fontSize: '0.875rem',
            color: 'var(--text-muted)',
            lineHeight: 1.5,
            marginBottom: '16px',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {doctor.bio}
          </p>

          {/* Stats Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '10px',
            padding: '12px',
            background: 'var(--bg-subtle)',
            borderRadius: '10px',
            marginBottom: '16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-main)', fontWeight: 600 }}>
              <Award size={15} color="var(--primary-600)" />
              <span>{doctor.experienceYears || 10}+ Yrs Practicing</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-main)', fontWeight: 600 }}>
              <Clock size={15} color="var(--primary-600)" />
              <span>{doctor.slotDurationMinutes} min / slot</span>
            </div>
          </div>

          {/* Career & Credentials Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsProfileModalOpen(true);
            }}
            className="pulse-btn"
            style={{
              width: '100%',
              padding: '7px 12px',
              fontSize: '0.8rem',
              fontWeight: 700,
              color: 'var(--primary-700)',
              background: 'var(--primary-50)',
              border: '1px solid var(--primary-200)',
              borderRadius: '8px',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <UserCheck size={14} />
            <span>View Career Achievements & Reviews</span>
            <ChevronRight size={14} />
          </button>
        </div>

        {/* Footer Fee & Selection */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTop: '1px solid var(--border-light)',
          paddingTop: '16px'
        }}>
          <div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
              Consultation Fee
            </span>
            <div style={{ fontSize: '1.3rem', fontWeight: 900, color: 'var(--primary-700)' }}>
              ${doctor.consultationFee}
            </div>
          </div>

          <button
            className={`pulse-btn ${isSelected ? 'pulse-btn-primary' : 'pulse-btn-secondary'}`}
            style={{ padding: '8px 18px', fontSize: '0.875rem', fontWeight: 800 }}
            onClick={(e) => {
              e.stopPropagation();
              onSelect(doctor);
            }}
          >
            <Calendar size={16} />
            {isSelected ? 'Selected' : 'Book Visit'}
          </button>
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
        />
      )}
    </>
  );
};
