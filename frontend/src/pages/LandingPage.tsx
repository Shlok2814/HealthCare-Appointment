import React, { useState, useEffect } from 'react';
import { DoctorDTO, AvailableSlot } from '@pulsepoint/shared';
import { api } from '../services/api';
import { DoctorCard } from '../components/booking/DoctorCard';
import { SlotPicker } from '../components/booking/SlotPicker';
import { SymptomTriageModal } from '../components/booking/SymptomTriageModal';
import { useAuth } from '../context/AuthContext';
import { HeartPulse, Search, Shield, Zap, Sparkles, CheckCircle2, Calendar, Stethoscope, ArrowRight } from 'lucide-react';

interface LandingPageProps {
  onNavigate: (view: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [doctors, setDoctors] = useState<DoctorDTO[]>([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorDTO | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<AvailableSlot | null>(null);
  const [isTriageModalOpen, setIsTriageModalOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [bookingSuccessNotice, setBookingSuccessNotice] = useState<string | null>(null);

  const specialties = [
    'All Specialties',
    'Cardiology',
    'Neurology',
    'Dermatology',
    'Orthopedics',
    'Pediatrics'
  ];

  const fetchDoctors = async () => {
    setIsLoading(true);
    try {
      const data = await api.getDoctors(
        selectedSpecialty === 'All Specialties' ? undefined : selectedSpecialty,
        searchTerm
      );
      setDoctors(data);
      if (data.length > 0 && !selectedDoctor) {
        setSelectedDoctor(data[0]);
      }
    } catch (err) {
      console.error('Failed to load doctors:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, [selectedSpecialty, searchTerm]);

  const handleDoctorSelect = (doc: DoctorDTO) => {
    setSelectedDoctor(doc);
    setSelectedSlot(null);
  };

  const handleSlotSelected = (slot: AvailableSlot) => {
    setSelectedSlot(slot);
    setIsTriageModalOpen(true);
  };

  const handleBookingSuccess = (appt: any) => {
    setIsTriageModalOpen(false);
    setSelectedSlot(null);
    setBookingSuccessNotice(
      `Appointment confirmed for ${new Date(appt.slotStart).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}! You can view full clinical records in My Care Portal.`
    );
  };

  return (
    <div style={{ paddingBottom: '40px' }}>
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #F0FDFA 0%, #EEF2FF 50%, #F8FAFC 100%)',
        padding: '60px 24px 80px',
        borderBottom: '1px solid var(--border-light)',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#FFFFFF', padding: '6px 14px', borderRadius: '20px', border: '1px solid var(--primary-200)', boxShadow: 'var(--shadow-sm)', marginBottom: '20px' }}>
            <span className="live-indicator" />
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary-800)' }}>
              Next-Gen Healthcare Scheduling & Practice Intelligence
            </span>
          </div>

          <h1 style={{ fontSize: '2.75rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.03em', lineHeight: 1.2, marginBottom: '20px' }}>
            Book Top Physicians with <span style={{ color: 'var(--primary-600)' }}>Zero Race Conditions</span> & AI Triage
          </h1>

          <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: 1.6, maxWidth: '720px', margin: '0 auto 36px' }}>
            Real-time slot lock holds, clinical urgency assessment, automated medication reminder schedules, and practice leave conflict sweeps in one unified platform.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <a href="#booking-directory" className="pulse-btn pulse-btn-primary" style={{ padding: '14px 28px', fontSize: '1rem' }}>
              <Calendar size={18} /> Book an Appointment
            </a>
            {!user && (
              <button onClick={() => onNavigate('login')} className="pulse-btn pulse-btn-secondary" style={{ padding: '14px 24px', fontSize: '1rem' }}>
                <Stethoscope size={18} /> Clinician Portal Login
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Highlights Bar */}
      <section style={{ maxWidth: '1280px', margin: '-30px auto 40px', padding: '0 24px' }}>
        <div className="pulse-glass" style={{ borderRadius: '18px', padding: '24px 32px', boxShadow: 'var(--shadow-md)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ background: 'var(--primary-50)', color: 'var(--primary-600)', padding: '12px', borderRadius: '12px' }}>
              <Shield size={24} />
            </div>
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)' }}>5-Min Slot Lock</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Concurrency-safe checkout reservation</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ background: 'var(--accent-50)', color: 'var(--accent-600)', padding: '12px', borderRadius: '12px' }}>
              <Sparkles size={24} />
            </div>
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)' }}>AI Clinical Triage</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Pre-visit risk & question engine</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ background: 'var(--success-bg)', color: 'var(--success-text)', padding: '12px', borderRadius: '12px' }}>
              <Zap size={24} />
            </div>
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)' }}>Auto Leave Resolver</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Automated conflicting appointment sweeps</p>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Notice */}
      {bookingSuccessNotice && (
        <div style={{ maxWidth: '1280px', margin: '0 auto 24px', padding: '0 24px' }}>
          <div style={{ background: 'var(--success-bg)', border: '1.5px solid var(--success-border)', padding: '16px 20px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--success-text)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <CheckCircle2 size={20} />
              <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{bookingSuccessNotice}</span>
            </div>
            <button
              onClick={() => onNavigate('patient')}
              className="pulse-btn pulse-btn-primary"
              style={{ padding: '6px 14px', fontSize: '0.85rem' }}
            >
              Go to Portal <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Doctor Directory & Booking Section */}
      <section id="booking-directory" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
        <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)' }}>
              Find Your Specialist
            </h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              Browse verified physicians, check practicing availability, and lock your slot
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="Search physician or specialty..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  padding: '10px 14px 10px 38px',
                  borderRadius: '10px',
                  border: '1.5px solid var(--border-strong)',
                  fontSize: '0.875rem',
                  fontFamily: 'var(--font-family)',
                  minWidth: '240px'
                }}
              />
              <Search size={16} color="var(--text-light)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>
        </div>

        {/* Specialty Filter Pills */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '16px', marginBottom: '24px' }}>
          {specialties.map((spec) => (
            <button
              key={spec}
              onClick={() => setSelectedSpecialty(spec)}
              className="pulse-btn"
              style={{
                fontSize: '0.85rem',
                padding: '8px 18px',
                borderRadius: '20px',
                background: (selectedSpecialty === spec || (!selectedSpecialty && spec === 'All Specialties')) ? 'var(--primary-600)' : '#FFFFFF',
                color: (selectedSpecialty === spec || (!selectedSpecialty && spec === 'All Specialties')) ? '#FFFFFF' : 'var(--text-main)',
                border: '1px solid var(--border-strong)'
              }}
            >
              {spec}
            </button>
          ))}
        </div>

        {/* Doctor Grid & Slot Picker Split */}
        <div style={{ display: 'grid', gridTemplateColumns: selectedDoctor ? '1fr 1fr' : '1fr', gap: '28px' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '16px' }}>
              Available Physicians ({doctors.length})
            </h3>

            {isLoading ? (
              <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
                <div className="live-indicator" style={{ margin: '0 auto 12px' }} />
                Loading specialists...
              </div>
            ) : doctors.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', background: 'var(--bg-subtle)', borderRadius: '12px', color: 'var(--text-muted)' }}>
                No physicians found matching your search.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {doctors.map((doc) => (
                  <DoctorCard
                    key={doc.id}
                    doctor={doc}
                    isSelected={selectedDoctor?.id === doc.id}
                    onSelect={handleDoctorSelect}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Interactive Slot Picker for Selected Doctor */}
          {selectedDoctor && (
            <div>
              <SlotPicker
                doctorId={selectedDoctor.id}
                doctorName={selectedDoctor.name}
                selectedSlot={selectedSlot}
                onSlotSelected={handleSlotSelected}
              />
            </div>
          )}
        </div>
      </section>

      {/* Symptom Intake & AI Triage Modal */}
      {isTriageModalOpen && selectedDoctor && selectedSlot && (
        <SymptomTriageModal
          doctor={selectedDoctor}
          slot={selectedSlot}
          onClose={() => setIsTriageModalOpen(false)}
          onConfirmSuccess={handleBookingSuccess}
        />
      )}
    </div>
  );
};
