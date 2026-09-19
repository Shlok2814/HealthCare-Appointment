import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { AppointmentDTO } from '@pulsepoint/shared';
import { AppointmentCard } from '../components/patient/AppointmentCard';
import { ConsultationModal } from '../components/doctor/ConsultationModal';
import { LeaveManagerModal } from '../components/doctor/LeaveManagerModal';
import { useAuth } from '../context/AuthContext';
import { Stethoscope, Calendar, Clock, Coffee, RefreshCw, CheckCircle2 } from 'lucide-react';

export const DoctorPortal: React.FC = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<AppointmentDTO[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [consultingAppointment, setConsultingAppointment] = useState<AppointmentDTO | null>(null);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState<boolean>(false);
  const [notice, setNotice] = useState<string | null>(null);

  const fetchAppointments = async () => {
    setIsLoading(true);
    try {
      const data = await api.getDoctorAppointments(selectedDate);
      setAppointments(data);
    } catch (err) {
      console.error('Failed to load doctor appointments:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [selectedDate]);

  const handleConsultationSuccess = () => {
    setConsultingAppointment(null);
    setNotice('Clinical consultation completed and digital prescription logged!');
    fetchAppointments();
  };

  const handleLeaveRegistered = () => {
    fetchAppointments();
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 24px' }}>
      {/* Doctor Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <span className="pulse-badge pulse-badge-info" style={{ marginBottom: '6px' }}>Clinician Console</span>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-main)' }}>
            Practice Schedule: {user?.name || 'Dr. Specialist'}
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Review incoming patient queues, assess AI symptom triage, and record digital prescriptions
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button
            onClick={() => setIsLeaveModalOpen(true)}
            className="pulse-btn pulse-btn-secondary"
            style={{ padding: '10px 18px', fontSize: '0.875rem' }}
          >
            <Coffee size={16} color="var(--warning-text)" /> Schedule Leave & Conflicts
          </button>
        </div>
      </div>

      {notice && (
        <div style={{ background: 'var(--success-bg)', border: '1px solid var(--success-border)', padding: '12px 16px', borderRadius: '10px', color: 'var(--success-text)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle2 size={16} />
          {notice}
        </div>
      )}

      {/* Date Filter Bar */}
      <div className="pulse-card" style={{ padding: '16px 20px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Calendar size={18} color="var(--primary-600)" />
          <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)' }}>Consultation Date:</span>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              border: '1.5px solid var(--border-strong)',
              fontSize: '0.875rem',
              fontFamily: 'var(--font-family)'
            }}
          />
        </div>

        <button onClick={fetchAppointments} className="pulse-btn pulse-btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
          <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} /> Refresh Queue
        </button>
      </div>

      {/* Queue List */}
      <div>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '16px' }}>
          Patient Consultations for {new Date(selectedDate).toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' })} ({appointments.length})
        </h3>

        {isLoading ? (
          <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <div className="live-indicator" style={{ margin: '0 auto 12px' }} />
            Loading practicing schedule...
          </div>
        ) : appointments.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center', background: '#FFFFFF', border: '1px solid var(--border-light)', borderRadius: '16px' }}>
            <Calendar size={32} color="var(--text-light)" style={{ margin: '0 auto 10px' }} />
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px' }}>No Bookings on this Date</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              There are no confirmed appointments scheduled for this date.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {appointments.map((appt) => (
              <AppointmentCard
                key={appt.id}
                appointment={appt}
                isDoctorView={true}
                onOpenConsultation={(a) => setConsultingAppointment(a)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Consultation Modal */}
      {consultingAppointment && (
        <ConsultationModal
          appointment={consultingAppointment}
          onClose={() => setConsultingAppointment(null)}
          onConsultationComplete={handleConsultationSuccess}
        />
      )}

      {/* Leave Manager Modal */}
      {isLeaveModalOpen && (
        <LeaveManagerModal
          onClose={() => setIsLeaveModalOpen(false)}
          onLeaveRegistered={handleLeaveRegistered}
        />
      )}
    </div>
  );
};
