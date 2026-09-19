import React, { useState, useEffect } from 'react';
import { DoctorDTO, AvailableSlot } from '@pulsepoint/shared';
import { api } from '../services/api';
import { DoctorCard } from '../components/booking/DoctorCard';
import { SlotPicker } from '../components/booking/SlotPicker';
import { SymptomTriageModal } from '../components/booking/SymptomTriageModal';
import { EmergencyUrgentModal } from '../components/common/EmergencyUrgentModal';
import { DoctorDirectChatModal } from '../components/chat/DoctorDirectChatModal';
import { useAuth } from '../context/AuthContext';
import { 
  HeartPulse, Search, Shield, Zap, Sparkles, CheckCircle2, 
  Calendar, Stethoscope, ArrowRight, Activity, SlidersHorizontal, 
  Tag, Video, Clock, Star, PhoneCall, MessageSquare, Pill, 
  Lock, Award, ShieldCheck, HelpCircle, FileText, X, ArrowUpDown
} from 'lucide-react';

import { DEFAULT_PHYSICIANS } from '../services/defaultDoctors';

interface LandingPageProps {
  onNavigate: (view: string) => void;
}

const filterAndSortDoctors = (
  sourceList: DoctorDTO[],
  specialty: string,
  search: string,
  sort: string
): DoctorDTO[] => {
  let filtered = [...sourceList];
  if (specialty && specialty !== 'All Specialties') {
    filtered = filtered.filter(d => 
      d.specialization.toLowerCase().includes(specialty.toLowerCase()) ||
      specialty.toLowerCase().includes(d.specialization.toLowerCase())
    );
  }
  if (search && search.trim()) {
    const q = search.toLowerCase().trim();
    filtered = filtered.filter(d =>
      d.name.toLowerCase().includes(q) ||
      d.specialization.toLowerCase().includes(q) ||
      d.bio.toLowerCase().includes(q)
    );
  }
  if (sort === 'rating') {
    filtered.sort((a, b) => (b.rating || 4.9) - (a.rating || 4.9));
  } else if (sort === 'fee_asc') {
    filtered.sort((a, b) => a.consultationFee - b.consultationFee);
  } else if (sort === 'experience') {
    filtered.sort((a, b) => (b.experienceYears || 0) - (a.experienceYears || 0));
  }
  return filtered;
};

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('All Specialties');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortBy, setSortBy] = useState<'rating' | 'fee_asc' | 'experience' | 'recommended' | 'name_asc'>('rating');
  const [doctors, setDoctors] = useState<DoctorDTO[]>(() => 
    filterAndSortDoctors(DEFAULT_PHYSICIANS, 'All Specialties', '', 'rating')
  );
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorDTO | null>(() => DEFAULT_PHYSICIANS[0] || null);
  const [selectedSlot, setSelectedSlot] = useState<AvailableSlot | null>(null);
  const [isTriageModalOpen, setIsTriageModalOpen] = useState<boolean>(false);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState<boolean>(false);
  const [isDoctorChatOpen, setIsDoctorChatOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [bookingSuccessNotice, setBookingSuccessNotice] = useState<string | null>(null);

  const specialties = [
    { name: 'All Specialties', icon: '🩺' },
    { name: 'Cardiology', icon: '❤️' },
    { name: 'Neurology', icon: '🧠' },
    { name: 'Dermatology', icon: '🧴' },
    { name: 'Orthopedics', icon: '🦴' },
    { name: 'Pediatrics', icon: '👶' },
    { name: 'Psychiatry', icon: '🧘' },
    { name: 'Endocrinology', icon: '🧬' },
    { name: 'Ophthalmology', icon: '👁️' },
    { name: 'Gynecology', icon: '🌸' },
    { name: 'Gastroenterology', icon: '🍏' },
    { name: 'Oncology', icon: '🔬' },
    { name: 'ENT (Otolaryngology)', icon: '👂' },
    { name: 'Pulmonology', icon: '🫁' },
    { name: 'Rheumatology', icon: '🩹' },
    { name: 'Urology', icon: '🩺' },
    { name: 'Allergy & Immunology', icon: '🌿' },
    { name: 'Nephrology', icon: '💧' },
    { name: 'Physical Medicine & Rehab', icon: '🏃' }
  ];

  const popularSymptoms = [
    { label: 'Chest Tightness', specialty: 'Cardiology' },
    { label: 'Severe Migraine', specialty: 'Neurology' },
    { label: 'Skin Rash & Eczema', specialty: 'Dermatology' },
    { label: 'Knee & Joint Pain', specialty: 'Orthopedics' },
    { label: 'Child Fever & Cough', specialty: 'Pediatrics' },
    { label: 'Anxiety & Sleep', specialty: 'Psychiatry' },
    { label: 'Diabetes & Thyroid', specialty: 'Endocrinology' },
    { label: 'Asthma & Breath Shortness', specialty: 'Pulmonology' },
    { label: 'Arthritis & Autoimmune', specialty: 'Rheumatology' },
    { label: 'Kidney Stones & Urinary', specialty: 'Urology' },
    { label: 'Food & Seasonal Allergy', specialty: 'Allergy & Immunology' },
    { label: 'Sports Spine Rehab', specialty: 'Physical Medicine & Rehab' },
    { label: 'Eye Strain & Vision', specialty: 'Ophthalmology' },
    { label: 'Acid Reflux & Gut', specialty: 'Gastroenterology' },
    { label: 'Sinus & Ear Pain', specialty: 'ENT (Otolaryngology)' }
  ];

  const fetchDoctors = async () => {
    // 1. Instant local filter
    const localFiltered = filterAndSortDoctors(DEFAULT_PHYSICIANS, selectedSpecialty, searchTerm, sortBy);
    setDoctors(localFiltered);
    if (localFiltered.length > 0) {
      if (!selectedDoctor || !localFiltered.some(d => d.id === selectedDoctor.id)) {
        setSelectedDoctor(localFiltered[0]);
      }
    } else {
      setSelectedDoctor(null);
    }

    // 2. Background non-blocking network revalidation
    try {
      const data = await api.getDoctors(
        selectedSpecialty === 'All Specialties' ? undefined : selectedSpecialty,
        searchTerm
      );
      if (Array.isArray(data) && data.length > 0) {
        const sorted = filterAndSortDoctors(data, selectedSpecialty, searchTerm, sortBy);
        setDoctors(sorted);
        if (sorted.length > 0) {
          if (!selectedDoctor || !sorted.some(d => d.id === selectedDoctor.id)) {
            setSelectedDoctor(sorted[0]);
          }
        }
      }
    } catch (err) {
      // Ignored - fallback already active
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
    <div style={{ paddingBottom: '80px' }}>
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #F0FDFA 0%, #F0F9FF 35%, #FAF5FF 100%)',
        padding: '68px 24px 80px',
        borderBottom: '1px solid rgba(226, 232, 240, 0.8)',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Ambient radial lighting */}
        <div style={{
          position: 'absolute',
          top: '-15%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '700px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(2, 132, 199, 0.15) 0%, rgba(13, 148, 136, 0.08) 50%, transparent 80%)',
          pointerEvents: 'none'
        }} />

        <div style={{ maxWidth: '1020px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '8px', 
            background: '#FFFFFF', 
            padding: '7px 18px', 
            borderRadius: '30px', 
            border: '1px solid #BAE6FD', 
            boxShadow: '0 2px 10px rgba(2, 132, 199, 0.12)', 
            marginBottom: '22px' 
          }}>
            <span className="live-indicator" />
            <span style={{ fontSize: '0.825rem', fontWeight: 800, color: '#0369A1', letterSpacing: '0.02em' }}>
              PULSEPOINT CLINICAL CLOUD • 18 SPECIALTIES • ZERO DOUBLE-BOOKING GUARANTEE
            </span>
          </div>

          <h1 style={{ 
            fontSize: '3.3rem', 
            fontWeight: 900, 
            color: 'var(--text-main)', 
            letterSpacing: '-0.035em', 
            lineHeight: 1.15, 
            marginBottom: '22px',
            fontFamily: 'var(--font-display)'
          }}>
            Connect with World-Class Doctors with <span style={{ 
              background: 'linear-gradient(135deg, #0284C7 0%, #0D9488 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>Instant Slot Lock</span> & AI Clinical Triage
          </h1>

          <p style={{ fontSize: '1.15rem', color: '#475569', lineHeight: 1.65, maxWidth: '780px', margin: '0 auto 36px', fontWeight: 500 }}>
            Experience seamless modern medicine: 5-minute atomic slot holds, AI pre-visit intake assessments, encrypted HD WebRTC exam rooms, and automatic prescription vaults.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <a 
              href="#booking-directory" 
              className="pulse-btn pulse-btn-primary" 
              style={{ padding: '14px 30px', fontSize: '1.02rem', borderRadius: '14px' }}
            >
              <Calendar size={19} /> Find & Book Doctor
            </a>
            
            <button 
              onClick={() => setIsEmergencyModalOpen(true)}
              className="pulse-btn"
              style={{ 
                background: '#FEF2F2', 
                color: '#DC2626', 
                border: '1.5px solid #FCA5A5', 
                padding: '14px 24px', 
                fontSize: '1.02rem', 
                fontWeight: 800,
                borderRadius: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 2px 8px rgba(220, 38, 38, 0.12)'
              }}
            >
              <PhoneCall size={18} /> 24/7 Urgent Care SOS
            </button>
            
            {!user && (
              <button 
                onClick={() => onNavigate('login')} 
                className="pulse-btn pulse-btn-secondary" 
                style={{ padding: '14px 24px', fontSize: '1.02rem', borderRadius: '14px' }}
              >
                <Stethoscope size={18} color="#0284C7" /> Clinician Portal
              </button>
            )}
          </div>

          {/* Social Proof Trust Bar */}
          <div style={{ 
            marginTop: '36px', 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            gap: '24px', 
            flexWrap: 'wrap',
            color: '#64748B',
            fontSize: '0.85rem',
            fontWeight: 600
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Star size={16} fill="#F59E0B" color="#F59E0B" />
              <span><strong style={{ color: '#0F172A' }}>4.98 / 5.0</strong> (120k+ Verified Encounters)</span>
            </div>
            <span>•</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldCheck size={16} color="#10B981" />
              <span>100% HIPAA & SOC-2 Certified</span>
            </div>
            <span>•</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Award size={16} color="#0284C7" />
              <span>Top 1% Board-Certified Specialists</span>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section style={{ maxWidth: '1280px', margin: '-32px auto 40px', padding: '0 24px', position: 'relative', zIndex: 10 }}>
        <div className="pulse-glass" style={{ borderRadius: '22px', padding: '24px 32px', boxShadow: '0 10px 30px -5px rgba(15, 23, 42, 0.1)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
          <div className="pulse-card-interactive" style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '10px 14px', borderRadius: '16px' }}>
            <div style={{ background: '#EFF6FF', color: '#0284C7', padding: '14px', borderRadius: '14px' }}>
              <Lock size={24} />
            </div>
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-main)' }}>5-Min Slot Lock Hold</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Zero double-booking guarantee</p>
            </div>
          </div>

          <div className="pulse-card-interactive" style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '10px 14px', borderRadius: '16px' }}>
            <div style={{ background: '#F0FDFA', color: '#0D9488', padding: '14px', borderRadius: '14px' }}>
              <Sparkles size={24} />
            </div>
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-main)' }}>AI Symptom Intake</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Acuity triage & doctor prep prompts</p>
            </div>
          </div>

          <div className="pulse-card-interactive" style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '10px 14px', borderRadius: '16px' }}>
            <div style={{ background: '#EDE9FE', color: '#7C3AED', padding: '14px', borderRadius: '14px' }}>
              <Video size={24} />
            </div>
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-main)' }}>HD Telehealth Rooms</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Encrypted video & live chat</p>
            </div>
          </div>

          <div className="pulse-card-interactive" style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '10px 14px', borderRadius: '16px' }}>
            <div style={{ background: '#ECFDF5', color: '#059669', padding: '14px', borderRadius: '14px' }}>
              <Pill size={24} />
            </div>
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-main)' }}>Digital Rx Vault</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Instant printable prescriptions</p>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Success Notice */}
      {bookingSuccessNotice && (
        <div style={{ maxWidth: '1280px', margin: '0 auto 24px', padding: '0 24px' }}>
          <div style={{ background: 'var(--success-bg)', border: '1.5px solid var(--success-border)', padding: '18px 24px', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--success-text)', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <CheckCircle2 size={24} />
              <span style={{ fontWeight: 800, fontSize: '0.95rem' }}>{bookingSuccessNotice}</span>
            </div>
            <button
              onClick={() => onNavigate('patient')}
              className="pulse-btn pulse-btn-primary"
              style={{ padding: '8px 18px', fontSize: '0.85rem' }}
            >
              Go to Care Portal <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Doctor Directory Section */}
      <section id="booking-directory" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
        {/* Search & Sort Header */}
        <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '18px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <h2 style={{ fontSize: '2.1rem', fontWeight: 900, color: 'var(--text-main)', letterSpacing: '-0.025em' }}>
                Board-Certified Medical Specialists ({doctors.length})
              </h2>
              <span style={{ background: '#CCFBF1', color: '#0F766E', fontSize: '0.75rem', fontWeight: 800, padding: '3px 9px', borderRadius: '12px' }}>
                18 Domains Available
              </span>
            </div>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', margin: 0 }}>
              Select a medical domain or search your specific symptoms to connect with verified attending clinicians.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
            {/* Search Input */}
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="Search physician, domain, or symptom..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pulse-input"
                style={{
                  padding: '11px 16px 11px 40px',
                  borderRadius: '12px',
                  fontSize: '0.875rem',
                  minWidth: '290px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
                }}
              />
              <Search size={18} color="var(--text-light)" style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: '#E2E8F0',
                    border: 'none',
                    borderRadius: '50%',
                    width: '20px',
                    height: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: '#64748B'
                  }}
                >
                  <X size={12} />
                </button>
              )}
            </div>

            {/* Sort Select */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ArrowUpDown size={16} color="var(--text-muted)" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="pulse-input"
                style={{
                  padding: '10px 14px',
                  borderRadius: '12px',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  width: 'auto'
                }}
              >
                <option value="recommended">Highest Rated & Experience</option>
                <option value="fee_asc">Lowest Consultation Fee (₹)</option>
                <option value="name_asc">Doctor Name (A to Z)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Popular Symptoms Quick Chips */}
        <div style={{ marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
            <Tag size={13} color="#0284C7" /> Quick Symptoms:
          </span>
          {popularSymptoms.map((sym, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setSelectedSpecialty(sym.specialty);
                setSearchTerm('');
              }}
              className="pulse-chip-hover"
              style={{
                background: selectedSpecialty === sym.specialty ? '#0284C7' : '#FFFFFF',
                border: selectedSpecialty === sym.specialty ? '1px solid #0284C7' : '1px solid #CBD5E1',
                borderRadius: '16px',
                padding: '5px 14px',
                fontSize: '0.75rem',
                fontWeight: 700,
                color: selectedSpecialty === sym.specialty ? '#FFFFFF' : '#334155',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                flexShrink: 0,
                boxShadow: '0 1px 2px rgba(0,0,0,0.04)'
              }}
            >
              {sym.label}
            </button>
          ))}
        </div>

        {/* Specialty Filter Pills Carousel */}
        <div className="specialty-scroll-row">
          {specialties.map((spec) => {
            const isActive = selectedSpecialty === spec.name;
            return (
              <button
                key={spec.name}
                type="button"
                onClick={() => setSelectedSpecialty(spec.name)}
                className={`pulse-btn ${isActive ? '' : 'pulse-chip-hover'}`}
                style={{
                  fontSize: '0.85rem',
                  fontWeight: 800,
                  padding: '9px 18px',
                  borderRadius: '30px',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                  background: isActive ? 'linear-gradient(135deg, #0284C7 0%, #0D9488 100%)' : '#FFFFFF',
                  color: isActive ? '#FFFFFF' : 'var(--text-main)',
                  border: isActive ? '1px solid #0284C7' : '1.5px solid #CBD5E1',
                  boxShadow: isActive ? '0 4px 12px rgba(2, 132, 199, 0.35)' : 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span>{spec.icon}</span>
                <span>{spec.name}</span>
              </button>
            );
          })}
        </div>

        {/* Main Grid: Doctors List & Sticky Slot Picker */}
        <div className={`booking-main-grid ${selectedDoctor ? 'has-selected-doctor' : ''}`}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                {selectedSpecialty === 'All Specialties' ? 'All Verified Physicians' : `${selectedSpecialty} Specialists`}
              </h3>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                Showing {doctors.length} clinician{doctors.length === 1 ? '' : 's'}
              </span>
            </div>

            {isLoading ? (
              <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
                <div className="live-indicator" style={{ margin: '0 auto 12px' }} />
                Loading specialists and schedules...
              </div>
            ) : doctors.length === 0 ? (
              <div style={{ padding: '48px', textAlign: 'center', background: '#FFFFFF', border: '1px solid var(--border-light)', borderRadius: '16px', color: 'var(--text-muted)' }}>
                <p style={{ fontWeight: 800, fontSize: '1.1rem', marginBottom: '6px', color: 'var(--text-main)' }}>No matching physicians found.</p>
                <p style={{ fontSize: '0.875rem' }}>Try clearing your search query or selecting "All Specialties".</p>
                <button 
                  onClick={() => { setSelectedSpecialty('All Specialties'); setSearchTerm(''); }}
                  className="pulse-btn pulse-btn-secondary"
                  style={{ marginTop: '16px', fontSize: '0.85rem' }}
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
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
            <div style={{ position: 'sticky', top: '90px', width: '100%', display: 'flex', justifyContent: 'center' }}>
              <SlotPicker
                doctorId={selectedDoctor.id}
                doctorName={selectedDoctor.name}
                doctorSpecialization={selectedDoctor.specialization}
                consultationFee={selectedDoctor.consultationFee}
                selectedSlot={selectedSlot}
                onSlotSelected={handleSlotSelected}
                onClose={() => {
                  setSelectedDoctor(null);
                  setSelectedSlot(null);
                }}
                onOpenMessage={() => setIsDoctorChatOpen(true)}
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

      {/* Direct Doctor Chat Modal */}
      {isDoctorChatOpen && selectedDoctor && (
        <DoctorDirectChatModal
          doctor={selectedDoctor}
          onClose={() => setIsDoctorChatOpen(false)}
          onBookAppointment={(doc) => {
            setIsDoctorChatOpen(false);
            setSelectedDoctor(doc);
          }}
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
