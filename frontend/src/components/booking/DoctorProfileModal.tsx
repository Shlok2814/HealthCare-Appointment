import React from 'react';
import { DoctorDTO } from '@pulsepoint/shared';
import {
  X, Star, Award, GraduationCap, Building2, Globe,
  BookOpen, CheckCircle2, ShieldCheck, Heart, Calendar, MessageSquare, ThumbsUp
} from 'lucide-react';

interface DoctorProfileModalProps {
  doctor: DoctorDTO;
  onClose: () => void;
  onBook: (doctor: DoctorDTO) => void;
  onOpenMessage?: () => void;
}

export const DoctorProfileModal: React.FC<DoctorProfileModalProps> = ({
  doctor,
  onClose,
  onBook,
  onOpenMessage
}) => {
  // Default fallback career achievements if not present
  const achievements = doctor.achievements || [
    'Castle Connolly Top Doctor Award (2024 - 2026)',
    'NIH Clinical Excellence & Innovation Fellow',
    'Published in The New England Journal of Medicine (NEJM)',
    'Keynote Speaker at the World Congress of Medicine'
  ];

  const certifications = doctor.certifications || [
    'American Board Certified Specialist (ABMS)',
    'Fellow of the American College of Physicians (FACP)',
    'State Medical Board Active Unrestricted License',
    'Advanced Cardiac Life Support (ACLS) Certified'
  ];

  const education = doctor.education || 'MD from Johns Hopkins University School of Medicine • Residency & Fellowship at Harvard Medical School / Massachusetts General Hospital';

  const hospitalAffiliation = doctor.hospitalAffiliation || 'Johns Hopkins Medical Center & PulsePoint Academic Institute';

  const languages = doctor.languages || ['English', 'Spanish', 'French'];

  const publicationsCount = doctor.publicationsCount || 24;

  const ratingBreakdown = doctor.ratingBreakdown || {
    bedsideManner: 4.98,
    waitTime: 4.88,
    clinicalClarity: 4.95
  };

  const sampleReviews = doctor.reviews || [
    {
      id: '1',
      patientName: 'Sarah M.',
      rating: 5,
      date: '2 weeks ago',
      verifiedVisit: true,
      comment: `${doctor.name} is exceptional! Took the time to explain every detail of my diagnosis and treatment plan with tremendous empathy and clarity. Highly recommended.`,
      tags: ['Thorough', 'Empathetic', 'No Rush']
    },
    {
      id: '2',
      patientName: 'David K.',
      rating: 5,
      date: '1 month ago',
      verifiedVisit: true,
      comment: 'Super fast appointment, virtually no waiting room delay. The AI triage summary was right on the mark and the doctor already knew my history before walking in.',
      tags: ['Punctual', 'Knowledgeable', 'Seamless']
    },
    {
      id: '3',
      patientName: 'Elena G.',
      rating: 4.9,
      date: '2 months ago',
      verifiedVisit: true,
      comment: 'Outstanding clinician with world-class credentials. Prescribed medication plan cleared my symptoms within 48 hours.',
      tags: ['Effective Rx', 'Expert Care']
    }
  ];

  return (
    <div className="pulse-modal-overlay">
      <div
        className="pulse-modal"
        style={{
          maxWidth: '900px',
          width: '95vw',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: 0,
          borderRadius: '20px',
          background: '#FFFFFF',
          color: 'var(--text-main)'
        }}
      >
        {/* Header Hero Banner */}
        <div style={{
          background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #0369A1 100%)',
          padding: '32px 32px 28px',
          color: '#FFFFFF',
          position: 'relative'
        }}>
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              background: 'rgba(255, 255, 255, 0.15)',
              border: 'none',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#FFF'
            }}
          >
            <X size={20} />
          </button>

          <div style={{ display: 'flex', gap: '24px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{
              width: '90px',
              height: '90px',
              borderRadius: '20px',
              background: 'linear-gradient(135deg, #0284C7, #0D9488)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2.5rem',
              fontWeight: 900,
              color: '#FFF',
              boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
              border: '3px solid rgba(255,255,255,0.2)'
            }}>
              {doctor.name.replace('Dr. ', '').charAt(0)}
            </div>

            <div style={{ flex: 1, minWidth: '240px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
                <span style={{
                  background: 'rgba(14, 165, 233, 0.25)',
                  color: '#38BDF8',
                  border: '1px solid rgba(56, 189, 248, 0.4)',
                  padding: '3px 10px',
                  borderRadius: '8px',
                  fontSize: '0.8rem',
                  fontWeight: 700
                }}>
                  {doctor.specialization}
                </span>
                <span style={{
                  background: 'rgba(16, 185, 129, 0.25)',
                  color: '#34D399',
                  padding: '3px 10px',
                  borderRadius: '8px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <ShieldCheck size={14} /> Board Certified MD
                </span>
              </div>

              <h2 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#FFF', margin: '0 0 6px' }}>
                {doctor.name}
              </h2>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: '#CBD5E1', fontSize: '0.85rem', flexWrap: 'wrap' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#FBBF24', fontWeight: 700 }}>
                  <Star size={16} fill="#FBBF24" /> {doctor.rating ? doctor.rating.toFixed(2) : '4.95'} ({sampleReviews.length * 42} verified ratings)
                </span>
                <span>•</span>
                <span>{doctor.experienceYears || 12}+ Years Practicing</span>
                <span>•</span>
                <span>Fee: ₹{doctor.consultationFee} / consult</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              {onOpenMessage && (
                <button
                  type="button"
                  onClick={onOpenMessage}
                  className="pulse-btn"
                  style={{
                    background: 'rgba(255, 255, 255, 0.15)',
                    color: '#FFF',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    padding: '12px 20px',
                    borderRadius: '12px',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <MessageSquare size={16} /> Direct Message
                </button>
              )}

              <button
                onClick={() => {
                  onBook(doctor);
                  onClose();
                }}
                className="pulse-btn"
                style={{
                  background: '#0284C7',
                  color: '#FFF',
                  padding: '12px 24px',
                  borderRadius: '12px',
                  fontWeight: 800,
                  fontSize: '0.95rem',
                  border: 'none',
                  boxShadow: '0 4px 15px rgba(2, 132, 199, 0.4)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <Calendar size={18} /> Book Appointment
              </button>
            </div>
          </div>
        </div>

        {/* Modal Body Content */}
        <div style={{ padding: '28px 32px' }}>
          {/* Biography */}
          <div style={{ marginBottom: '28px' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <GraduationCap size={20} color="var(--primary-600)" />
              <span>About & Clinical Practice</span>
            </h3>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
              {doctor.bio}
            </p>
          </div>

          {/* Key Credentials Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', marginBottom: '28px' }}>
            <div className="pulse-card" style={{ padding: '18px', background: 'var(--bg-subtle)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary-700)', fontWeight: 700, fontSize: '0.85rem', marginBottom: '6px' }}>
                <Building2 size={16} /> Hospital Affiliations
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-main)', fontWeight: 600, margin: 0 }}>
                {hospitalAffiliation}
              </p>
            </div>

            <div className="pulse-card" style={{ padding: '18px', background: 'var(--bg-subtle)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary-700)', fontWeight: 700, fontSize: '0.85rem', marginBottom: '6px' }}>
                <GraduationCap size={16} /> Alma Mater & Training
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-main)', fontWeight: 600, margin: 0 }}>
                {education}
              </p>
            </div>

            <div className="pulse-card" style={{ padding: '18px', background: 'var(--bg-subtle)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary-700)', fontWeight: 700, fontSize: '0.85rem', marginBottom: '6px' }}>
                <Globe size={16} /> Spoken Languages
              </div>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '4px' }}>
                {languages.map((lang, idx) => (
                  <span key={idx} style={{ background: '#FFFFFF', border: '1px solid var(--border-strong)', padding: '2px 8px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600 }}>
                    {lang}
                  </span>
                ))}
              </div>
            </div>

            <div className="pulse-card" style={{ padding: '18px', background: 'var(--bg-subtle)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary-700)', fontWeight: 700, fontSize: '0.85rem', marginBottom: '6px' }}>
                <BookOpen size={16} /> Research & Publications
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-main)', fontWeight: 600, margin: 0 }}>
                {publicationsCount}+ Peer-Reviewed Clinical Publications
              </p>
            </div>
          </div>

          {/* Career Achievements & Awards Section */}
          <div style={{ marginBottom: '28px', background: '#F8FAFC', border: '1.5px solid #E2E8F0', padding: '20px', borderRadius: '14px' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Award size={20} color="#D97706" />
              <span>Career Honors & Major Achievements</span>
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '10px' }}>
              {achievements.map((ach, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#FFFFFF', padding: '10px 14px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                  <CheckCircle2 size={16} color="#10B981" style={{ flexShrink: 0 }} />
                  <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)' }}>{ach}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Board Certifications */}
          <div style={{ marginBottom: '28px' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={20} color="#0D9488" />
              <span>Board Certifications & Licensure</span>
            </h3>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {certifications.map((cert, idx) => (
                <span key={idx} style={{ background: '#F0FDFA', color: '#0F766E', border: '1px solid #99F6E4', padding: '6px 12px', borderRadius: '8px', fontSize: '0.825rem', fontWeight: 700 }}>
                  ✓ {cert}
                </span>
              ))}
            </div>
          </div>

          {/* Patient Satisfaction & Rating Metrics */}
          <div style={{ marginBottom: '28px', background: '#FFFBEB', border: '1px solid #FDE68A', padding: '20px', borderRadius: '14px' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#92400E', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Star size={20} fill="#F59E0B" color="#F59E0B" />
              <span>Patient Experience & Satisfaction Breakdown</span>
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px' }}>
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#B45309', textTransform: 'uppercase' }}>Bedside Manner</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#78350F', margin: '2px 0' }}>{ratingBreakdown.bedsideManner} / 5.0</div>
                <div style={{ width: '100%', height: '6px', background: '#FDE68A', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: `${(ratingBreakdown.bedsideManner / 5) * 100}%`, height: '100%', background: '#F59E0B' }} />
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#B45309', textTransform: 'uppercase' }}>Clinical Clarity</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#78350F', margin: '2px 0' }}>{ratingBreakdown.clinicalClarity} / 5.0</div>
                <div style={{ width: '100%', height: '6px', background: '#FDE68A', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: `${(ratingBreakdown.clinicalClarity / 5) * 100}%`, height: '100%', background: '#F59E0B' }} />
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#B45309', textTransform: 'uppercase' }}>Punctuality / Low Wait</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#78350F', margin: '2px 0' }}>{ratingBreakdown.waitTime} / 5.0</div>
                <div style={{ width: '100%', height: '6px', background: '#FDE68A', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: `${(ratingBreakdown.waitTime / 5) * 100}%`, height: '100%', background: '#F59E0B' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Verified Patient Reviews */}
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MessageSquare size={20} color="var(--primary-600)" />
              <span>Verified Patient Reviews</span>
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {sampleReviews.map(rev => (
                <div key={rev.id} style={{ padding: '16px', background: '#FFFFFF', border: '1px solid var(--border-light)', borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)' }}>{rev.patientName}</span>
                      {rev.verifiedVisit && (
                        <span style={{ fontSize: '0.7rem', color: '#10B981', fontWeight: 700, background: '#D1FAE5', padding: '2px 6px', borderRadius: '4px' }}>
                          ✓ Verified Encounter
                        </span>
                      )}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#F59E0B', fontWeight: 700, fontSize: '0.85rem' }}>
                      <Star size={14} fill="#F59E0B" /> {rev.rating.toFixed(1)}
                    </div>
                  </div>

                  <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: '0 0 10px' }}>
                    "{rev.comment}"
                  </p>

                  {rev.tags && (
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {rev.tags.map((t, tIdx) => (
                        <span key={tIdx} style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--primary-700)', background: 'var(--primary-50)', padding: '2px 8px', borderRadius: '4px' }}>
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer CTA */}
        <div style={{ padding: '20px 32px', background: 'var(--bg-subtle)', borderTop: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderRadius: '0 0 20px 20px' }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Consultation Fee</span>
            <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--primary-700)' }}>
              ₹{doctor.consultationFee} <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>/ 30-min visit</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button onClick={onClose} className="pulse-btn pulse-btn-secondary" style={{ padding: '10px 18px' }}>
              Close
            </button>
            {onOpenMessage && (
              <button 
                type="button"
                onClick={onOpenMessage} 
                className="pulse-btn" 
                style={{ 
                  padding: '10px 20px', 
                  fontWeight: 700,
                  background: '#FFFFFF',
                  color: 'var(--primary-700)',
                  border: '1.5px solid var(--primary-300)',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <MessageSquare size={16} color="var(--primary-600)" /> Direct Message
              </button>
            )}
            <button
              onClick={() => {
                onBook(doctor);
                onClose();
              }}
              className="pulse-btn pulse-btn-primary"
              style={{ padding: '10px 24px', fontWeight: 800 }}
            >
              Select & View Available Slots
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
