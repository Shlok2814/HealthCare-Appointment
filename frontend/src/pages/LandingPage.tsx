import React, { useState, useEffect } from 'react';
import { DoctorDTO, AvailableSlot } from '@pulsepoint/shared';
import { api } from '../services/api';
import { DoctorCard } from '../components/booking/DoctorCard';
import { SlotPicker } from '../components/booking/SlotPicker';
import { SymptomTriageModal } from '../components/booking/SymptomTriageModal';
import { EmergencyUrgentModal } from '../components/common/EmergencyUrgentModal';
import { useAuth } from '../context/AuthContext';
import { 
  HeartPulse, Search, Shield, Zap, Sparkles, CheckCircle2, 
  Calendar, Stethoscope, ArrowRight, Activity, SlidersHorizontal, 
  Tag, Video, Clock, Star, PhoneCall
} from 'lucide-react';

interface LandingPageProps {
  onNavigate: (view: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [doctors, setDoctors] = useState<DoctorDTO[]>([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('All Specialties');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortBy, setSortBy] = useState<'rating' | 'fee_asc' | 'experience'>('rating');
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorDTO | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<AvailableSlot | null>(null);
  const [isTriageModalOpen, setIsTriageModalOpen] = useState<boolean>(false);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [bookingSuccessNotice, setBookingSuccessNotice] = useState<string | null>(null);

  const specialties = [
    'All Specialties',
    'Cardiology',
    'Neurology',
    'Dermatology',
    'Orthopedics',
    'Pediatrics',
    'Psychiatry',
    'Endocrinology',
    'Ophthalmology',
    'Gynecology',
    'Gastroenterology',
    'Oncology',
    'ENT (Otolaryngology)'
  ];

  const popularSymptoms = [
    { label: 'Chest Tightness', specialty: 'Cardiology' },
    { label: 'Severe Migraine', specialty: 'Neurology' },
    { label: 'Skin Rash & Acne', specialty: 'Dermatology' },
    { label: 'Knee & Joint Pain', specialty: 'Orthopedics' },
    { label: 'Child Fever & Cough', specialty: 'Pediatrics' },
    { label: 'Anxiety & Sleep', specialty: 'Psychiatry' },
    { label: 'Diabetes & Thyroid', specialty: 'Endocrinology' },
    { label: 'Eye Strain & Vision', specialty: 'Ophthalmology' },
    { label: 'Acid Reflux & Gut', specialty: 'Gastroenterology' },
    { label: 'Sinus & Allergy', specialty: 'ENT (Otolaryngology)' }
  ];

  const fetchDoctors = async () => {
    setIsLoading(true);
    try {
      const data = await api.getDoctors(
        selectedSpecialty === 'All Specialties' ? undefined : selectedSpecialty,
        searchTerm
      );

      // Sort doctors
      let sorted = [...data];
      if (sortBy === 'rating') {
        sorted.sort((a, b) => (b.rating || 4.9) - (a.rating || 4.9));
      } else if (sortBy === 'fee_asc') {
        sorted.sort((a, b) => a.consultationFee - b.consultationFee);
      } else if (sortBy === 'experience') {
        sorted.sort((a, b) => (b.experienceYears || 0) - (a.experienceYears || 0));
      }

      setDoctors(sorted);
      if (sorted.length > 0 && !selectedDoctor) {
        setSelectedDoctor(sorted[0]);
      }
    } catch (err) {
      console.error('Failed to load doctors:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, [selectedSpecialty, searchTerm, sortBy]);

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
      `Appointment confirmed for ${new Date(appt.slotStart).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}! You can view full clinical records and join virtual consultations in My Care Portal.`
    );
  };

  return (
    <div style={{ paddingBottom: '60px' }}>
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #F0FDFA 0%, #EEF2FF 40%, #FAF5FF 100%)',
        padding: '60px 24px 70px',
        borderBottom: '1px solid var(--border-light)',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#FFFFFF', padding: '6px 16px', borderRadius: '20px', border: '1px solid var(--primary-200)', boxShadow: 'var(--shadow-sm)', marginBottom: '20px' }}>
            <span className="live-indicator" />
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--primary-800)', letterSpacing: '0.02em' }}>
              PULSEPOINT CLINICAL CLOUD • 12+ BOARD CERTIFIED SPECIALTIES
            </span>
          </div>

          <h1 style={{ fontSize: '3rem', fontWeight: 900, color: 'var(--text-main)', letterSpacing: '-0.03em', lineHeight: 1.15, marginBottom: '20px' }}>
            Book Top Healthcare Specialists with <span style={{ color: 'var(--primary-600)' }}>Zero Double-Booking</span> & AI Triage
          </h1>

          <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', lineHeight: 1.6, maxWidth: '760px', margin: '0 auto 32px' }}>
            Experience modern medicine: instant slot holds, AI pre-visit intake assessments, telehealth virtual exam rooms, and automatic medication vaults.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <a href="#booking-directory" className="pulse-btn pulse-btn-primary" style={{ padding: '14px 28px', fontSize: '1rem', fontWeight: 700 }}>
              <Calendar size={18} /> Find & Book Doctor
            </a>
            <button 
              onClick={() => setIsEmergencyModalOpen(true)}
              className="pulse-btn"
              style={{ 
                background: '#FEE2E2', 
                color: '#DC2626', 
                border: '1px solid #FCA5A5', 
                padding: '14px 22px', 
                fontSize: '1rem', 
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <PhoneCall size={18} /> 24/7 Urgent Care SOS
            </button>
            {!user && (
              <button onClick={() => onNavigate('login')} className="pulse-btn pulse-btn-secondary" style={{ padding: '14px 22px', fontSize: '1rem' }}>
                <Stethoscope size={18} /> Clinician Login
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section style={{ maxWidth: '1280px', margin: '-28px auto 40px', padding: '0 24px' }}>
        <div className="pulse-glass" style={{ borderRadius: '18px', padding: '24px 32px', boxShadow: 'var(--shadow-md)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ background: 'var(--primary-50)', color: 'var(--primary-600)', padding: '12px', borderRadius: '12px' }}>
              <Shield size={24} />
            </div>
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-main)' }}>5-Min Slot Lock Hold</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Zero double-booking checkout guarantee</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ background: 'var(--accent-50)', color: 'var(--accent-600)', padding: '12px', borderRadius: '12px' }}>
              <Sparkles size={24} />
            </div>
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-main)' }}>AI Symptom Intake</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Real-time acuity triage & doctor prompts</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ background: '#EDE9FE', color: '#7C3AED', padding: '12px', borderRadius: '12px' }}>
              <Video size={24} />
            </div>
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-main)' }}>HD Telehealth Rooms</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>HIPAA encrypted video & clinical chat</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ background: 'var(--success-bg)', color: 'var(--success-text)', padding: '12px', borderRadius: '12px' }}>
              <Zap size={24} />
            </div>
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-main)' }}>Auto Leave Resolver</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Proactive conflict cancellation sweeps</p>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Success Notice */}
      {bookingSuccessNotice && (
        <div style={{ maxWidth: '1280px', margin: '0 auto 24px', padding: '0 24px' }}>
          <div style={{ background: 'var(--success-bg)', border: '1.5px solid var(--success-border)', padding: '16px 20px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--success-text)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <CheckCircle2 size={20} />
              <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{bookingSuccessNotice}</span>
            </div>
            <button
              onClick={() => onNavigate('patient')}
              className="pulse-btn pulse-btn-primary"
              style={{ padding: '6px 16px', fontSize: '0.85rem' }}
            >
              Go to Care Portal <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Doctor Directory Section */}
      <section id="booking-directory" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
        {/* Search & Sort Header */}
        <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h2 style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
              Find Top Medical Specialists ({doctors.length})
            </h2>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Filter by medical department or search symptoms to connect with verified specialists.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
            {/* Search Input */}
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="Search physician, disease, or symptom..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  padding: '10px 14px 10px 38px',
                  borderRadius: '10px',
                  border: '1.5px solid var(--border-strong)',
                  fontSize: '0.875rem',
                  fontFamily: 'var(--font-family)',
                  minWidth: '280px',
                  background: '#FFFFFF'
                }}
              />
              <Search size={16} color="var(--text-light)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            </div>

            {/* Sort Dropdown */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <SlidersHorizontal size={16} color="var(--text-muted)" />
              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                style={{
                  padding: '10px 12px',
                  borderRadius: '10px',
                  border: '1.5px solid var(--border-strong)',
                  fontSize: '0.875rem',
                  background: '#FFFFFF',
                  color: 'var(--text-main)',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                <option value="rating">Top Rated (⭐)</option>
                <option value="fee_asc">Lowest Consultation Fee ($)</option>
                <option value="experience">Most Experienced (Yrs)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Popular Symptoms Quick Chips */}
        <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Tag size={13} /> Common Symptoms:
          </span>
          {popularSymptoms.map((sym, idx) => (
            <button
              key={idx}
              onClick={() => {
                setSelectedSpecialty(sym.specialty);
                setSearchTerm(sym.label);
              }}
              style={{
                background: 'var(--bg-subtle)',
                border: '1px solid var(--border-light)',
                borderRadius: '14px',
                padding: '3px 10px',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: 'var(--text-main)',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {sym.label}
            </button>
          ))}
        </div>

        {/* Specialty Filter Pills Carousel */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '16px', marginBottom: '24px' }}>
          {specialties.map((spec) => {
            const isActive = selectedSpecialty === spec;
            return (
              <button
                key={spec}
                onClick={() => setSelectedSpecialty(spec)}
                className="pulse-btn"
                style={{
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  padding: '8px 18px',
                  borderRadius: '24px',
                  whiteSpace: 'nowrap',
                  background: isActive ? 'var(--primary-600)' : '#FFFFFF',
                  color: isActive ? '#FFFFFF' : 'var(--text-main)',
                  border: isActive ? '1px solid var(--primary-600)' : '1px solid var(--border-strong)',
                  boxShadow: isActive ? '0 2px 8px rgba(2, 132, 199, 0.3)' : 'none'
                }}
              >
                {spec}
              </button>
            );
          })}
        </div>

        {/* Main Grid: Doctors list & Live Slot Picker */}
        <div style={{ display: 'grid', gridTemplateColumns: selectedDoctor ? '1.1fr 0.9fr' : '1fr', gap: '28px' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '16px' }}>
              {selectedSpecialty === 'All Specialties' ? 'All Verified Physicians' : `${selectedSpecialty} Specialists`}
            </h3>

            {isLoading ? (
              <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
                <div className="live-indicator" style={{ margin: '0 auto 12px' }} />
                Loading specialists and schedules...
              </div>
            ) : doctors.length === 0 ? (
              <div style={{ padding: '48px', textAlign: 'center', background: 'var(--bg-subtle)', borderRadius: '14px', color: 'var(--text-muted)' }}>
                <p style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '6px' }}>No physicians found.</p>
                <p style={{ fontSize: '0.85rem' }}>Try clearing your search query or selecting "All Specialties".</p>
                <button 
                  onClick={() => { setSelectedSpecialty('All Specialties'); setSearchTerm(''); }}
                  className="pulse-btn pulse-btn-secondary"
                  style={{ marginTop: '14px', fontSize: '0.85rem' }}
                >
                  Reset Filters
                </button>
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

          {/* Slot Picker for Selected Doctor */}
          {selectedDoctor && (
            <div style={{ position: 'sticky', top: '90px' }}>
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

      {/* Emergency & Urgent Care Guide Modal */}
      {isEmergencyModalOpen && (
        <EmergencyUrgentModal
          onClose={() => setIsEmergencyModalOpen(false)}
          onInstantTriage={() => {
            if (doctors.length > 0) {
              setSelectedDoctor(doctors[0]);
              const el = document.getElementById('booking-directory');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }
          }}
        />
      )}
    </div>
  );
};
