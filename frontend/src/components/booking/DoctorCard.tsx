import React from 'react';
import { DoctorDTO } from '@pulsepoint/shared';
import { Star, Clock, DollarSign, Calendar, Award } from 'lucide-react';

interface DoctorCardProps {
  doctor: DoctorDTO;
  onSelect: (doctor: DoctorDTO) => void;
  isSelected?: boolean;
}

export const DoctorCard: React.FC<DoctorCardProps> = ({ doctor, onSelect, isSelected }) => {
  return (
    <div
      className={`pulse-card pulse-card-hover ${isSelected ? 'selected' : ''}`}
      style={{
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        cursor: 'pointer',
        border: isSelected ? '2px solid var(--primary-600)' : '1px solid var(--border-light)',
        background: isSelected ? 'var(--primary-50)' : 'var(--bg-card)'
      }}
      onClick={() => onSelect(doctor)}
    >
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
          <div>
            <span className="pulse-badge pulse-badge-info" style={{ marginBottom: '8px' }}>
              {doctor.specialization}
            </span>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '4px' }}>
              {doctor.name}
            </h3>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#FEF3C7', padding: '4px 8px', borderRadius: '8px', color: '#B45309', fontWeight: 700, fontSize: '0.85rem' }}>
            <Star size={14} fill="#F59E0B" color="#F59E0B" />
            {doctor.rating ? doctor.rating.toFixed(2) : '4.95'}
          </div>
        </div>

        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '20px', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {doctor.bio}
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', padding: '12px', background: 'var(--bg-subtle)', borderRadius: '10px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.825rem', color: 'var(--text-main)', fontWeight: 600 }}>
            <Award size={16} color="var(--primary-600)" />
            <span>{doctor.experienceYears || 10}+ Yrs Exp</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.825rem', color: 'var(--text-main)', fontWeight: 600 }}>
            <Clock size={16} color="var(--primary-600)" />
            <span>{doctor.slotDurationMinutes} min / slot</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-light)', paddingTop: '16px' }}>
        <div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Consultation Fee</span>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-700)' }}>
            ${doctor.consultationFee}
          </div>
        </div>
        <button
          className={`pulse-btn ${isSelected ? 'pulse-btn-primary' : 'pulse-btn-secondary'}`}
          style={{ padding: '8px 16px', fontSize: '0.875rem' }}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(doctor);
          }}
        >
          <Calendar size={16} />
          {isSelected ? 'Selected' : 'Select Doctor'}
        </button>
      </div>
    </div>
  );
};
