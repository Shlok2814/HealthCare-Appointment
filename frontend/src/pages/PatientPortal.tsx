import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { AppointmentDTO } from '@pulsepoint/shared';
import { AppointmentCard } from '../components/patient/AppointmentCard';
import { MedicationVault } from '../components/patient/MedicationVault';
import { VitalsTrackerModal } from '../components/patient/VitalsTrackerModal';
import { TelehealthRoomModal } from '../components/telehealth/TelehealthRoomModal';
import { PrescriptionPrintModal } from '../components/patient/PrescriptionPrintModal';
import { useAuth } from '../context/AuthContext';
import { Calendar, Pill, Plus, RefreshCw, AlertCircle, CheckCircle2, Activity, Heart, FileText, Video } from 'lucide-react';

interface PatientPortalProps {
  onNavigateToBooking: () => void;
}

export const PatientPortal: React.FC<PatientPortalProps> = ({ onNavigateToBooking }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'appointments' | 'medications'>('appointments');
  const [appointments, setAppointments] = useState<AppointmentDTO[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [notice, setNotice] = useState<string | null>(null);

  // Modals state
  const [isVitalsModalOpen, setIsVitalsModalOpen] = useState(false);
  const [activeTelehealthAppt, setActiveTelehealthAppt] = useState<AppointmentDTO | null>(null);
  const [activePrintAppt, setActivePrintAppt] = useState<AppointmentDTO | null>(null);

  const fetchAppointments = async () => {
    setIsLoading(true);
    try {
      const data = await api.getPatientAppointments();
      setAppointments(data);
    } catch (err) {
      console.error('Failed to load patient appointments:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleCancelAppointment = async (appointmentId: string) => {
    if (!confirm('Are you sure you want to cancel this appointment?')) return;
    try {
      await api.cancelAppointment(appointmentId);
      setNotice('Appointment cancelled successfully.');
      fetchAppointments();
    } catch (err: any) {
      alert(err.message || 'Failed to cancel appointment');
    }
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 24px' }}>
      {/* Header Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <span className="pulse-badge pulse-badge-info" style={{ marginBottom: '6px' }}>Patient Care Portal</span>
          <h1 style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-main)' }}>
            Welcome, {user?.name || 'Patient'}
          </h1>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>
            Manage your clinical consultations, live telehealth rooms, digital prescriptions, and vital signs
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setIsVitalsModalOpen(true)}
            className="pulse-btn"
            style={{ 
              background: '#F0FDFA', 
              color: '#0D9488', 
              border: '1px solid #99F6E4', 
              padding: '10px 18px', 
              fontSize: '0.9rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Activity size={18} /> Vital Signs Vault
          </button>

          <button
            onClick={onNavigateToBooking}
            className="pulse-btn pulse-btn-primary"
            style={{ padding: '10px 20px', fontSize: '0.9rem', fontWeight: 700 }}
          >
            <Plus size={16} /> Book New Appointment
          </button>
        </div>
      </div>

      {notice && (
        <div style={{ background: 'var(--success-bg)', border: '1px solid var(--success-border)', padding: '12px 16px', borderRadius: '10px', color: 'var(--success-text)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle2 size={16} />
          {notice}
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '12px', borderBottom: '2px solid var(--border-light)', marginBottom: '24px' }}>
        <button
          onClick={() => setActiveTab('appointments')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 20px',
            background: 'transparent',
            border: 'none',
            fontWeight: 700,
            fontSize: '0.95rem',
            color: activeTab === 'appointments' ? 'var(--primary-600)' : 'var(--text-muted)',
            borderBottom: activeTab === 'appointments' ? '2px solid var(--primary-600)' : 'none',
            cursor: 'pointer',
            marginBottom: '-2px'
          }}
        >
          <Calendar size={18} /> My Consultations ({appointments.length})
        </button>

        <button
          onClick={() => setActiveTab('medications')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 20px',
            background: 'transparent',
            border: 'none',
            fontWeight: 700,
            fontSize: '0.95rem',
            color: activeTab === 'medications' ? 'var(--primary-600)' : 'var(--text-muted)',
            borderBottom: activeTab === 'medications' ? '2px solid var(--primary-600)' : 'none',
            cursor: 'pointer',
            marginBottom: '-2px'
          }}
        >
          <Pill size={18} /> Medication Vault & Reminders
        </button>
      </div>

      {/* Active Tab Content */}
      {activeTab === 'appointments' ? (
        <div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
            <button
              onClick={fetchAppointments}
              className="pulse-btn pulse-btn-secondary"
              style={{ fontSize: '0.8rem', padding: '6px 12px' }}
            >
              <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} /> Refresh List
            </button>
          </div>

          {isLoading ? (
            <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
              <div className="live-indicator" style={{ margin: '0 auto 12px' }} />
              Loading your appointment history...
            </div>
          ) : appointments.length === 0 ? (
            <div style={{ padding: '60px', textAlign: 'center', background: '#FFFFFF', border: '1px solid var(--border-light)', borderRadius: '16px' }}>
              <Calendar size={36} color="var(--primary-600)" style={{ margin: '0 auto 12px' }} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>
                No Appointments Scheduled
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
                You have no upcoming or past clinical bookings yet.
              </p>
              <button onClick={onNavigateToBooking} className="pulse-btn pulse-btn-primary">
                <Plus size={16} /> Book Your First Consultation
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {appointments.map((appt) => (
                <AppointmentCard
                  key={appt.id}
                  appointment={appt}
                  onCancel={handleCancelAppointment}
                  onOpenTelehealth={(a) => setActiveTelehealthAppt(a)}
                  onPrintPrescription={(a) => setActivePrintAppt(a)}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        <MedicationVault />
      )}

      {/* Vitals Tracker Modal */}
      {isVitalsModalOpen && (
        <VitalsTrackerModal
          patientName={user?.name || 'Patient'}
          onClose={() => setIsVitalsModalOpen(false)}
        />
      )}

      {/* Virtual Telehealth Room */}
      {activeTelehealthAppt && (
        <TelehealthRoomModal
          appointment={activeTelehealthAppt}
          userRole="PATIENT"
          onClose={() => setActiveTelehealthAppt(null)}
        />
      )}

      {/* Prescription Printable Modal */}
      {activePrintAppt && (
        <PrescriptionPrintModal
          appointment={activePrintAppt}
          onClose={() => setActivePrintAppt(null)}
        />
      )}
    </div>
  );
};
